import RNFS from 'react-native-fs';

export const updateNumberofLevelsCleared=async(wordSize: number)=>{
  const gameDataFileName = "gapfills-"+wordSize+".json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    const clearedLevels=jsonData.clearedLevels;
    if(Array.isArray(clearedLevels)){
      if(!clearedLevels.includes(wordSize))
        clearedLevels.push(wordSize);
    jsonData.clearedLevels=clearedLevels;
    await RNFS.writeFile(path, JSON.stringify(jsonData));  
    }
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    const clearedLevels: number[]=[];
    const jsonData ={clearedLevels: clearedLevels};
    await RNFS.writeFile(path, JSON.stringify(jsonData));
}
}
 
export const getTheNumberofLevelsCleared=async(wordSize: number)=>{
  const gameDataFileName = "gapfills-"+wordSize+".json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    return jsonData.clearedLevels.length;
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    return 0;
    }
}
else{
    const clearedLevels: number[]=[];
    const jsonData ={clearedLevels: clearedLevels};
    await RNFS.writeFile(path, JSON.stringify(jsonData));
    return [];
}
}