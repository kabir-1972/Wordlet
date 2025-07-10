import RNFS from "react-native-fs";

const fileName="wordlet-bucket.json";
const wordsFilePath=RNFS.DocumentDirectoryPath+'/'+fileName;

export const addWord = async (word: string, date: string) => {
  if (word.length === 0 || date.length === 0) return 0;

  const newEntry = {
    word,
    addDate: date,
  };

  let currentWords: any[] = [];
  const exists = await RNFS.exists(wordsFilePath);

  if (exists) {
    const fileContents = await RNFS.readFile(wordsFilePath, 'utf8');
    currentWords = JSON.parse(fileContents);
    const alreadyExists = currentWords.some(entry => entry.word === word);
    if (alreadyExists) return 0;
  }

  currentWords.push(newEntry);
  await RNFS.writeFile(wordsFilePath, JSON.stringify(currentWords, null, 2), 'utf8');
  return 1;
};

export const addWordQuicker = async (word: string) => {
  
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

const date = `${month} ${day}, ${year} ${weekday}`;

  if (word.length === 0 || date.length === 0) return 0;

  const newEntry = {
    word,
    addDate: date,
  };

  let currentWords: any[] = [];
  const exists = await RNFS.exists(wordsFilePath);

  if (exists) {
    const fileContents = await RNFS.readFile(wordsFilePath, 'utf8');
    currentWords = JSON.parse(fileContents);
    const alreadyExists = currentWords.some(entry => entry.word === word);
    if (alreadyExists) return 0;
  }

  currentWords.push(newEntry);
  await RNFS.writeFile(wordsFilePath, JSON.stringify(currentWords, null, 2), 'utf8');
  return 1;
};


export const countWords = async (): Promise<number> => {
  const exists = await RNFS.exists(wordsFilePath);
  if (!exists) return 0;
  const data = await RNFS.readFile(wordsFilePath, 'utf8');
  const words = JSON.parse(data);
  return words.length;
};