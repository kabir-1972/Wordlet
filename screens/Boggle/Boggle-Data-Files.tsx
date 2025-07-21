import RNFS from 'react-native-fs';

export const getTheNumberOfWordsCreated=async ()=>{
  const gameDataFileName = "boggle.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    return jsonData;    
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else return [];
}

export const addFoundWordsToFile=async(str:string, level: number)=>{
  const gameDataFileName = "boggle.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    const previousWords=jsonData[level];
    if(!previousWords?.length) jsonData[level] = [str];  
    else jsonData[level].push(str);
      
    await RNFS.writeFile(path, JSON.stringify(jsonData));
    
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    const jsonData ={[level]: [str]};
    await RNFS.writeFile(path, JSON.stringify(jsonData));
}
}

export const getThePreviousWordsForBoggle = async (level: number)=>{
  const gameDataFileName = "boggle.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    console.log(jsonData);
    const previousWords=jsonData[level];
    if(!previousWords?.length) return [];
    else return previousWords;  
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else return [];
}