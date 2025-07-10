import RNFS from 'react-native-fs';

export const saveCrosswordDataToFile=async(
    fileName: string,
    wandedLetters: string[],
    userLetters: string[],
    freeGridCheck: number
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={
    wandedLetters: wandedLetters,
    userLetters: userLetters,
    freeGridCheck: freeGridCheck
    };

    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
    catch(err){
        return;
    }
}

export const readCrosswordDataFile = async (fileName:string) => {
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

export const updateAccessoryDataInPreviousCrosswordFile=async (fileName:string,
    wandedLetters: string[],
    userLetters: string[], 
    freeGridCheck: number
)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);

    jsonData.wandedLetters= wandedLetters;
    jsonData.userLetters= userLetters;
    jsonData.freeGridCheck= freeGridCheck

  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

export const crosswordScoreRecordedData=async(level: number, size: number, gameName: string)=>{
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

export const playerCrosswordData=async(level: number, size: number, gameName: string)=>{
  const fileName = gameName+'-crossword-records.json';
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

export const getTheWordAndFirstSolveData=async(rows: number, cols: number, gameName: string, level: number)=>{
  const gameDataFileName = "crossword-levels/"+gameName+"/"+rows+"x"+cols+"/level-" + level + ".json";
  try{
  const fileContent =await RNFS.readFileAssets(gameDataFileName);
  const jsonData =JSON.parse(fileContent);
  return {words: jsonData.words, firstSolve: jsonData.firstSolved};  
}
catch(error){
    console.log("Error reading solve and word data: "+error);
}


}