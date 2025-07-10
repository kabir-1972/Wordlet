import RNFS from 'react-native-fs';

export const saveCryptogramDataToFile=async(
    fileName: string,
    userLetters: string[],
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={userLetters: userLetters};
    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
    catch(err){
        return;
    }
}

export const readCryptogramDataFile = async (fileName:string) => {
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

export const updateAccessoryDataInPreviousCryptogramFile=async (fileName:string,
    userLetters: string[], 
)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.userLetters= userLetters;

  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

/*
export const cryptogramScoreRecordedData=async(level: number, size: number, gameName: string)=>{
  const fileNameForScores='_'+size+'_'+level+'_'+gameName+'-Score-Record.txt'; 
  const path = `${RNFS.DocumentDirectoryPath}/${fileNameForScores}`;
  const exists = await RNFS.exists(path);
  if(exists) return false;
  else{
    const jsonData='';
    await RNFS.writeFile(path,jsonData);
  }
}

const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  weekday: 'short',
};


const today = new Date();
const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(today);

const month = parts.find(p => p.type === 'month')?.value ?? '';
const day = parts.find(p => p.type === 'day')?.value ?? '';
const year = parts.find(p => p.type === 'year')?.value ?? '';
const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';

const finalDate = `${month} ${day}, ${year} ${weekday}`;


export const playerCryptogramData=async(level: number, size: number, gameName: string)=>{
  const fileName = gameName+'-cryptogram-records.json';
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  const exists = await RNFS.exists(path);
  if(exists){
    const jsonData={
      level: level,
      size: size,
      solveDate: finalDate,
    }
    await RNFS.appendFile(path, JSON.stringify(jsonData));
  }

}
*/

export const getTheListofLevelsCleared=async(level: number, heading: number)=>{
  const gameDataFileName = "cryptogram-"+ level +"-"+heading+"-"+ ".json";
  const path=`${RNFS.DocumentDirectoryPath}/${gameDataFileName}`;
  const exists = await RNFS.exists(path);
  
  if(exists){
  try{
    const fileContent =await RNFS.readFile(path);
    const jsonData =JSON.parse(fileContent);
    console.log('JSON Data for List of Levels Cleared: ');
    console.log(jsonData);
    return jsonData.clearedLevels;
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

export const updateNumberofLevelsCleared=async(level: number, heading: number)=>{
  const gameDataFileName = "cryptogram-"+ level +"-"+heading+"-"+ ".json";
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
 