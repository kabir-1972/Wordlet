import RNFS from 'react-native-fs';

export const getTheGameData=async ()=>{
  const gameDataFileName = "ortographia.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    return JSON.parse(fileContent);
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    const arr=Array.from({ length: 70 }, (_, i) => i);
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const fileContent={lastLevelCleared: 0, array: arr};
    await RNFS.writeFile(path, JSON.stringify(fileContent), 'utf8');
    return fileContent;
}
}

export const updateTheNumberOfLevelsCleared=async(level: number)=>{
  const gameDataFileName = "ortographia.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const data=JSON.parse(fileContent);
    data.lastLevelCleared=level;
    await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}
else{
    const arr=Array.from({ length: 70 }, (_, i) => i);
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const fileContent={lastLevelCleared: 0, array: arr};
    await RNFS.writeFile(path, JSON.stringify(fileContent), 'utf8');
    }
} 

export const resetTheGameData=async ()=>{
  const gameDataFileName = "ortographia.json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  
  try{
    const arr=Array.from({ length: 70 }, (_, i) => i);
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const fileContent={lastLevelCleared: 0, array: arr};
    await RNFS.writeFile(path, JSON.stringify(fileContent), 'utf8');
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    }
}