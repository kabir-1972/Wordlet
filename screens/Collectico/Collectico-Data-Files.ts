import RNFS from 'react-native-fs';

export const getTheNumberOfLevelsCleared=async ()=>{
  const gameDataFileName = "collectico.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    return parseInt(fileContent)+1;
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    await RNFS.writeFile(path, "0");
    return 1;
}
}

export const updateTheNumberOfLevelsCleared=async(level: number)=>{
  const gameDataFileName = "collectico.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    await RNFS.writeFile(path, level.toString());
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else
    await RNFS.writeFile(path, level.toString());
} 