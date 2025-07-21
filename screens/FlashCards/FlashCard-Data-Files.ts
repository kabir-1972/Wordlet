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
    const path= `${RNFS.DocumentDirectoryPath}/${'flash-cards.json'}`;
    const exists=await RNFS.exists(path);
    console.log(exists);
      if(exists){
      const content = await RNFS.readFile(path, 'utf8');
      try{
        const data=JSON.parse(content);
        return data[name] ? 1 : 0;
      }
      catch (error){return 0;}
      }
    
      else
        return 0;
}