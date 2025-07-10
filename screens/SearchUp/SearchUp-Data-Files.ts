import RNFS from 'react-native-fs';

export const saveSearchUpDataToFile=async(
    fileName: string,
    detectedWords: string[],
    floatingBoxesPositions: number[][]
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={detectedWords: detectedWords, floatingBoxesPositions: floatingBoxesPositions};
    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
    catch(err){
        return;
    }
}

export const readSearchUpDataFile = async (fileName:string) => {
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
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
};

export const updateAccessoryDataInPreviousSearchUpFile=async (fileName:string,
    detectedWords: string[], 
    floatingBoxesPositions: number[][]
)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.detectedWords= detectedWords;
  jsonData.floatingBoxesPositions=floatingBoxesPositions;

  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}
//gameType is normal
//gameMode is easy

export const getTheListofLevelsCleared=async(gameType: string, gameMode: string)=>{
  const gameDataFileName = "searchup-"+ gameType + "-"+gameMode+".json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    /*console.log('JSON Data for List of Levels Cleared: ');
    console.log(jsonData);*/
    return jsonData.clearedLevels/*.length*/;
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    const clearedLevels: number[]=[];
    const jsonData ={clearedLevels: clearedLevels};
    await RNFS.writeFile(path, JSON.stringify(jsonData));
    return [];
}
}

export const updateNumberofLevelsCleared=async(gameType: string, gameMode:string, level: number)=>{
  const gameDataFileName = "searchup-"+ gameType + "-"+gameMode+".json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    const clearedLevels=jsonData.clearedLevels;
    if(Array.isArray(clearedLevels)){
      if(!clearedLevels.includes(level))
        clearedLevels.push(level);
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
 