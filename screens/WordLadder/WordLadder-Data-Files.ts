import RNFS from 'react-native-fs';

export const updateNumberofLevelsCleared=async(wordSize: number, level: number)=>{
  const gameDataFileName = "wordladder-"+wordSize+".json";
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
 
export const getTheNumberofLevelsCleared=async(wordSize: number)=>{
  const gameDataFileName = "wordladder-"+wordSize+".json";
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

export const getTheCorrespondingsOfWord=async (size: number, word: string)=>{
  let sizeInString:string;
  switch(size){
    case 3: sizeInString="three"; break;
    case 4: sizeInString="four"; break;
    case 5: sizeInString="five"; break;
    case 6: sizeInString="six"; break;
    default: sizeInString="three"; break;
  }

  const wordListDataFile = sizeInString+"-letter-words-for-word-ladder.json";
  const path=`${RNFS.DocumentDirectoryPath}/${wordListDataFile}`;
  const exists = await RNFS.exists(path);

  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    const theTargetWords=jsonData[word];
    console.log(theTargetWords);
    return theTargetWords;
  }
    catch(error){
    console.log("Error reading solve and word data: "+error);
    return [];
    }
}
else return [];
}