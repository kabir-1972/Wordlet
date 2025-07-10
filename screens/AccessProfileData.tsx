import RNFS from 'react-native-fs';
const fileName='profile-data.json'

export type ProfileData={
    profileName: string,
    playerXP: number,
    playerCoins: number,
    playerLevel: number,
    lastMatch: string,
}

export type ScoreData={
    winStreak: number,
    score: number
}

export const saveProfileDataToFile=async(
    profileName: string,
    playerXP: number,
    playerCoins: number,
    playerLevel: number,
    lastMatch: string,
)=>{
    const path= `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const jsonData={
        profileName: profileName,
        playerXP: playerXP,
        playerCoins: playerCoins,
        playerLevel: playerLevel,
        lastMatch: lastMatch,
    };

    try{
        await RNFS.writeFile(path,JSON.stringify(jsonData, null, 2), 'utf8');
        console.log(JSON.stringify(jsonData, null, 2));
    }
    catch(err){
        return;
    }
}

export const readProfileDataFile = async () => {
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

export const getTheXpLevel = async ()=>{
  const profileContent = await readProfileDataFile();
  return profileContent.playerLevel;
}

export const updateCoinsInPreviousProfileFile=async (_coins:number)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.playerCoins = _coins;
  console.log(_coins);
  console.log(jsonData);
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file for setting coins:', err);
}
}

export const updateXpsInPreviousProfileFile=async (xp: number,)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent); 
  jsonData.playerXp = xp;
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file for setting xp:', err);
}
}

export const updateXpsAndCoinsInPreviousProfileFile=async (xp: number, _coins: number)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent); 
  jsonData.playerCoins = _coins;
  jsonData.playerXP = xp; 
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file for setting xp:', err);
}
}
/**/
export const updateXPLevelInPreviousProfileFile=async (playerLevel:number)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.playerLevel=playerLevel;
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file for setting xp level:', err);
}
}

export const setTheLastMatch=async (match:string)=>{
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
try {
  const fileContent = await RNFS.readFile(path, 'utf8');
  const jsonData = JSON.parse(fileContent);
  jsonData.lastMatch=match;
  await RNFS.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8');
} catch (err) {
  console.error('Error updating file for setting last match:', err);
}
}

export function getTheMaxXpForNextLevel(level: number){
  const xpsArray=[0, 300, 600, 1000, 1500, 2000, 2500, 3000, 4000, 5000,
     6000, 7000, 8000];
  return xpsArray[level%xpsArray.length];
}
