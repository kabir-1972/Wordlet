import RNFS from 'react-native-fs';

export const saveWordleDataToFile=async(
    fileName: string,
    targetWord: string,
    numberOfTries: number,
    wandedLetters: string[],
    untouchedLetters: string[],
    correctlyPlacedLetters: string[],
    misPlacedLetters: string[],
    notToBePlacedLetters: string[],
    userWords: string[]
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={
    targetWord: targetWord,
    numberOfTries: numberOfTries,
    wandedLetters: wandedLetters,
    untouchedLetters: untouchedLetters,
    correctlyPlacedLetters: correctlyPlacedLetters,
    misPlacedLetters: misPlacedLetters,
    notToBePlacedLetters: notToBePlacedLetters,
    userWord: userWords
    };

    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
    catch(err){
        return;
    }
}

export const readWordleDataFile = async (fileName:string) => {
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

export const updateAccessoryDataInPreviousWordleFile=async (fileName:string,
    numberOfTries: number,
    wandedLetters: string[],
    untouchedLetters: string[],
    correctlyPlacedLetters: string[],
    misPlacedLetters: string[],
    notToBePlacedLetters: string[],
    userWords: string[]
)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);

    jsonData.numberOfTries= numberOfTries;
    jsonData.wandedLetters= wandedLetters;
    jsonData.untouchedLetters= untouchedLetters;
    jsonData.correctlyPlacedLetters= correctlyPlacedLetters;
    jsonData.misPlacedLetters= misPlacedLetters;
    jsonData.notToBePlacedLetters= notToBePlacedLetters;
    jsonData.userWord= userWords;

  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

export const updateUserWordsInPreviousWordleFile=async (fileName:string, _userWords:string[])=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.userWord=_userWords;
  //console.log(jsonData);
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

export const updateUntouchedLettersInPreviousWordleFile=async (fileName:string, untouchedLetters:string[])=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.untouchedLetters=untouchedLetters;
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

export const saveShiftedWordleDataToFile=async(
    fileName: string,
    targetWord: string,
    numberOfTries: number,
    wandedLetters: string[],
    untouchedLetters: string[],
    correctlyPlacedLetters: string[],
    prePlacedLetters: string[],
    postPlacedLetters: string[],
    notToBePlacedLetters: string[],
    userWords: string[]
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={
    targetWord: targetWord,
    numberOfTries: numberOfTries,
    wandedLetters: wandedLetters,
    untouchedLetters: untouchedLetters,
    correctlyPlacedLetters: correctlyPlacedLetters,
    prePlacedLetters: prePlacedLetters,
    postPlacedLetters: postPlacedLetters,
    notToBePlacedLetters: notToBePlacedLetters,
    userWord: userWords
    };

    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
    catch(err){
        return;
    }
}

export const updateAccessoryDataInPreviousShiftedWordleFile=async (fileName:string,
    numberOfTries: number,
    wandedLetters: string[],
    untouchedLetters: string[],
    correctlyPlacedLetters: string[],
    prePlacedLetters: string[],
    postPlacedLetters: string[],
    notToBePlacedLetters: string[],
    userWords: string[]
)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);

    jsonData.numberOfTries= numberOfTries;
    jsonData.wandedLetters= wandedLetters;
    jsonData.untouchedLetters= untouchedLetters;
    jsonData.correctlyPlacedLetters= correctlyPlacedLetters;
    jsonData.prePlacedLetters= prePlacedLetters;
    jsonData.postPlacedLetters= postPlacedLetters;
    jsonData.notToBePlacedLetters= notToBePlacedLetters;
    jsonData.userWord= userWords;

  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file:', err);
}
}

//Files for Wordle Score....

export const updateWordleScoresData=async (fileNameForScores:string, size: number, score: number, winStreak: number)=>{
  const path = `${RNFS.DocumentDirectoryPath}/${fileNameForScores}`;
  const exists = await RNFS.exists(path);

  if(exists){
  try{
    const fileContent= await RNFS.readFile(path, 'utf8');
    const jsonData = JSON.parse(fileContent);
    if(winStreak==1){
    switch(size){
            case 1:{
        jsonData.easyScore+=score;
        jsonData.easyWinStreak+=1;
      }; break;

            case 2:{
        jsonData.intermediateScore+=score;
        jsonData.intermediateWinStreak+=1;
      }; break;

            case 3:{
        jsonData.hardScore+=score;
        jsonData.hardWinStreak+=1;
      }; break;

            case 4:{
        jsonData.advancedScore+=score;
        jsonData.advancedWinStreak+=1;
      }; break;
    }}
    else{
    switch(size){
            case 1:{
        jsonData.easyScore=0;
        jsonData.easyWinStreak=0;
      }; break;

            case 2:{
        jsonData.intermediateScore=0;
        jsonData.intermediateWinStreak=0;
      }; break;

            case 3:{
        jsonData.hardScore=0;
        jsonData.hardWinStreak=0;
      }; break;

            case 4:{
        jsonData.advancedScore=0;
        jsonData.advancedWinStreak=0;
      }; break;
    }

    }
  }
  catch (err){
      console.error('Error setting wordle score file:', err);
  }}
  else await createWordleScoresData(fileNameForScores);
}

export const createWordleScoresData=async(fileNameForScores: string)=>{
  const path = `${RNFS.DocumentDirectoryPath}/${fileNameForScores}`;

  try{
    const jsonData = {
        easyScore: 0,
        easyWinStreak: 0,
        easyHighestScore: 0,
        easyHighestWinStreak: 0,

        intermediateScore: 0,
        intermediateWinStreak: 0,
        intermediateHighestScore: 0,
        intermediateHighestWinStreak: 0,

        hardScore: 0,
        hardWinStreak: 0,
        hardHighestScore: 0,
        hardHighestWinStreak: 0,

        advancedScore: 0,
        advancedWinStreak: 0,
        advancedHighestScore: 0,
        advancedHighestWinStreak: 0
    };
        
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
    }
  catch (err){
      console.error('Error setting wordle score file:', err);
  }
}

export const readWordleScoresData=async(fileNameForScores:string, size: number)=>{
  const path = `${RNFS.DocumentDirectoryPath}/${fileNameForScores}`;
  const exists=await RNFS.exists(path);

  if(exists)
  try{
    const fileContent= await RNFS.readFile(path, 'utf8');
    const jsonData= JSON.parse(fileContent);
    let returnJSONData: {
      score:number,
      winStreak: number,
      highestScore: number,
      highestWinStreak: number    
    }={score: 0, winStreak: 0, highestScore: 0, highestWinStreak: 0};
    switch(size){
            case 1:{
        returnJSONData.score=jsonData.easyScore;
        returnJSONData.winStreak=jsonData.easyWinStreak;
        returnJSONData.highestScore=jsonData.easyHighestScore;
        returnJSONData.highestWinStreak=jsonData.easyHighestWinStreak;
      }; break;

            case 2:{
        returnJSONData.score=jsonData.intermediateScore;
        returnJSONData.winStreak=jsonData.intermediateWinStreak;
        returnJSONData.highestScore=jsonData.intermediateHighestScore;
        returnJSONData.highestWinStreak=jsonData.intermediateHighestWinStreak;
      }; break;

            case 3:{
        returnJSONData.score=jsonData.hardScore;
        returnJSONData.winStreak=jsonData.hardWinStreak;
        returnJSONData.highestScore=jsonData.hardHighestScore;
        returnJSONData.highestWinStreak=jsonData.hardHighestWinStreak;
      }; break;

            case 4:{
        returnJSONData.score=jsonData.advancedScore;
        returnJSONData.winStreak=jsonData.advancedWinStreak;
        returnJSONData.highestScore=jsonData.advancedHighestScore;
        returnJSONData.highestWinStreak=jsonData.advancedHighestWinStreak;
      }; break;

            default:{
        returnJSONData.score=jsonData.easyScore;
        returnJSONData.winStreak=jsonData.easyWinStreak;
        returnJSONData.highestScore=jsonData.easyHighestScore;
        returnJSONData.highestWinStreak=jsonData.easyHighestWinStreak;
      }; break;
    }
    return returnJSONData;
  }
  catch (err){
      console.error('Error setting wordle score file:', err);
      return undefined;
  }
  else return undefined;
}

//A record to keep that the last wordle has been scored
//And xps and coins has been shared to the wordleteer

export const WordleScoreRecordedData=async(size: number)=>{
  const fileNameForScores='_'+size+'-Wordle-Score-Record.txt'; 
  const path = `${RNFS.DocumentDirectoryPath}/${fileNameForScores}`;
  const exists = await RNFS.exists(path);
  if(exists) return false;
  else{
    const jsonData='';
    await RNFS.writeFile(path,jsonData);
  }
}
