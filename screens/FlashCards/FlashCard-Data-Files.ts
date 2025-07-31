import RNFS from 'react-native-fs';

export const userFlashCardData = async ()=>{
    const path= `${RNFS.DocumentDirectoryPath}/${'flash-cards.json'}`;
    const exists=await RNFS.exists(path);
    
      if(exists){
      const content = await RNFS.readFile(path, 'utf8');
      try{
        const data=JSON.parse(content);
        return data;
      }
      catch (error){return undefined;}
      }
    
      else
        return undefined;
    
}

export const checkTheName = async(name: string)=>{
    const path= `${RNFS.DocumentDirectoryPath}/player-flash-cards/${name}.json`;
    const exists=await RNFS.exists(path);
    
    if(exists) return 1;
    else return 0;
}

export const addAFavoriteFlashCard=async(data:object)=>{
    const path=`${RNFS.DocumentDirectoryPath}/favorite-flash-cards.json`;
    const exists=await RNFS.exists(path);
    
    //RNFS.unlink(path);

    let previousData:any={};
    
    //Check for the previous keys here
    
    if(exists){
      const content=await RNFS.readFile(path, 'utf8');
      previousData=content? JSON.parse(content): {};
    }

     const isDuplicate = Object.values(previousData).some(
      (entry: any) =>{JSON.stringify(entry)===JSON.stringify(data)});

    if (isDuplicate) return 0;
    
    //Find the next key

    const keys=Object.keys(previousData).map(Number);
    const nextKey=keys.length>0?Math.max(...keys)+1:1;
    previousData[nextKey.toString()]=data;

    await RNFS.writeFile(path, JSON.stringify(previousData, null, 2), 'utf8');
    return 1;  
}

export const getTheNamesOfTheCard=async()=>{
    const path= `${RNFS.DocumentDirectoryPath}/player-flash-cards`;
    const exists=await RNFS.exists(path);
    if(exists){
      const files=await RNFS.readDir(path);
      const filteredFilesName=files.filter(file=>file.name.endsWith('.json'));
      
const filesInfo = await Promise.all(
  filteredFilesName.map(async (file) => {
    const name = file.name.replace('.json', '');
    const date = file.mtime
      ? new Date(file.mtime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      : '';

    const filePath = path + '/' + file.name;
    const fileData = await RNFS.readFile(filePath);
    const description = JSON.parse(fileData).description;

    return { name, date, description };
  })
);

      return filesInfo;
    }
}