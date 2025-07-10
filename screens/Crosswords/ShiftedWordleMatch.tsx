/**
 * Final Window after Completing the Game
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import {View, Text, ImageBackground, Image, Animated, Pressable, UIManager, findNodeHandle, InteractionManager, ScrollView, BackHandler } from 'react-native';
import {styles} from '../../source/styles/wordle-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import {saveShiftedWordleDataToFile,
  readWordleDataFile,
  updateAccessoryDataInPreviousShiftedWordleFile,
  updateUserWordsInPreviousWordleFile,
  readWordleScoresData,
  createWordleScoresData
} from './Wordle-Data-Files';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { ShiftedAlphabetKeyboard} from '../alphabet-keyboard';
import { SkipGameModal, WordleText } from '../Skip-Game-Modal';

import { startShake } from '../../source/styles/ingame-styles';
import { StarAnimation, StarAnimationRef } from '../../source/styles/star-animation-styles';
import LightSweep from '../../source/styles/ingame-animations';
import { firstRowKeyMeasurements,secondRowKeyMeasurements,thirdRowKeyMeasurements, KeyMeasurements} from '../alphabet-keyboard';
import { HeaderInMatch } from './Crossword-Header-inmatch';
import { SmallerWhiteWordleText } from '../Skip-Game-Modal';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile } from '../AccessProfileData';
import { ScoreData } from '../accessProfileData';



/***
 * 
 * * * Checking the DocumentDirectoryPath Folder...
 * 
function readTheDir(){
  RNFS.readDir(RNFS.DocumentDirectoryPath)
  .then(files => {
    files.forEach(file => {
      console.log('Name:', file.name);
      /*console.log('Path:', file.path);
      console.log('Is file:', file.isFile());
    });
  })
  .catch(err => {
    console.log('Error reading directory:', err);
  });
}
*/ 

type WordleMatchRouteProp = RouteProp<RootStackParamList, 'ShiftedWordleMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let roughString="";
  let cols=4;
  let rows=5;

  let errorScreenTimeOut: ReturnType<typeof setTimeout>;

  let correctlyPlacedLetterSet:string[]=[];
  let prePlacedLetterset:string[]=[];
  let postPlacedLetterset:string[]=[];
  let notToBePlacedLetterSet:string[]=[];

  interface PositionalValues {
  x: number | undefined;
  y: number | undefined;
}

  const StarAnimationPosition:KeyMeasurements={
    width: 0,
    height: 0,
    positionX: 0,
    positionY: 0,
  };

  let wandedLettersTemplate:string[]=[];

  let userSetWords:string[]=Array(rows).fill("");
  let wordLength: number;

  const App = () => {

  const route = useRoute<WordleMatchRouteProp>();
  const [WordleSize, setWordleSize]=useState(1);

  const navigation = useNavigation<NavigationProp>();

  const [targetWord, setTargetWord] = React.useState<string | undefined>(undefined);
  const [wordNotFoundError, setWordNotFoundErrorStatement] =React.useState("");
  const [userWordLength, setUserWordLength] =React.useState(0);

  //Every letter here is lower case...
  const [correctlyPlacedLetters, setCorrectlyPlacedLetters]=React.useState<string[]>([]);
  const [prePlacedLetters, setprePlacedLetters]=React.useState<string[]>([]);
  const [postPlacedLetters, setpostPlacedLetters]=React.useState<string[]>([]);
  const [notToBePlacedLetters, setNotToBePlacedLetters]=React.useState<string[]>([]);
  
  const [mywords, setMywords] = useState<string[]>(Array(rows).fill(""));
  const [numberOfTries, setNumberOfTries]=useState(0);

  //The next three arrays for the star throwing animation
  const [positionOfNotPlacedLettersX, setPositionsForNotPlacedLettersX]=useState<number[]>([]);
  const [positionOfNotPlacedLettersY, setPositionsForNotPlacedLettersY]=useState<number[]>([]);
  const [untouchedLetters, setUntouchedLetters] = useState<string[]>([]);

  const [wandedLetters, setWandedLetters]=useState<string[]>(wandedLettersTemplate);
  const [skipGameModalVisiblity,setSkipGameModalVisiblity]=useState(false);
  const [previouslySavedData, setPreviouslySavedData]= useState(false);

  const [fileRead, setFileRead]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);

  const [gameMode, setGameMode]=useState("");
  const [gameName, setGameName]=useState("");
  const [savedDataFileName, setSavedDataFileName]=useState("");
  const [profileDataRead, setProfileDataRead]=useState(false);
  const [scoreDataRead, setScoreDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
  });

  const [scoreData, setScoreData]=useState<ScoreData>({
    winStreak: 0,
    score: 0
  });

  const [_gameLoadingAnimationPrompt, setGaneLoadingAnimationPrompt]=useState("");
  const _gameName='Shifted-Wordle';
  const scoreFileName=_gameName+'-score.json';
  let _gameMode="Easy 4x5";
  
  const hideSkipGameModal = ()=> {setSkipGameModalVisiblity(false)};

  let wandedLettersIndex=0;

  const starAnimationBtnRef=useRef<View>(null);
  
  let localUntouchedLetters: string[]=[];

  function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
  }
  
    let firstUntouchedCharactersPosition:PositionalValues|null=null;
    let secondUntouchedCharactersPosition:PositionalValues|null=null;
    let thirdUntouchedCharactersPosition:PositionalValues|null=null;

  /* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth fetch the new word if the file is newly made and set the word up there in the file...

/*Get the Profile Data and Wordle Scores Data First */
useEffect(()=>{
  async function loadProfileData() {
  setGaneLoadingAnimationPrompt("Getting Profile Data");
  const savedData = await readProfileDataFile();
  if(savedData){
    setProfileDataRead(true);
    const _profileData={
        profileName: savedData.profileName,
        playerXP: savedData.playerXP,
        playerCoins: savedData.playerCoins,
        playerLevel: savedData.playerLevel,
        lastMatch: savedData.lastMatch,
    }
    setProfileData(_profileData);
}
else{
  console.log("no profile file found");
  setProfileDataRead(true);

  await saveProfileDataToFile(
    profileData.profileName,
    profileData.playerXP,
    profileData.playerCoins,
    profileData.playerLevel,
    profileData.lastMatch,
  );

  const savedData = await readProfileDataFile();
  console.log("Saved Data to New Profile File: ");
  console.log(savedData);
}
}
  loadProfileData();
},[]);

//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  if(!profileDataRead) return;
  const loadConfiguration = async () => {    
  setGaneLoadingAnimationPrompt("Setting the Wordle Size");
    let size;
    if (route.params) {
      size=route.params.size;
      setWordleSize(size);
    }      
    
    switch(size){
        case 1: cols=4; rows=5; break;
        case 2: cols=5; rows=5; break;
        case 3: cols=6; rows=5; break;
        case 4: cols=7; rows=6; break;
        default: cols=4; rows=5; break;
    }
    const _savedDataFileName=`_${cols}x${rows}${_gameName.replace(' ','-')}.json`;
    setSavedDataFileName(_savedDataFileName);
    wordLength=cols;
    setReadRouteParameters(true);
  };

  loadConfiguration();
}, [route.params, profileDataRead]);


useEffect(()=>{
  const backAction=()=>{
    //setSkipGameModalVisiblity(true);
    /*if(targetWord&&targetWord.length!=0)
    return true;
    else*/
    //RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${savedDataFileName}`);  
    return false;
  }

  const backHandler =BackHandler.addEventListener(
  "hardwareBackPress", backAction);
   return ()=>  backHandler.remove();
}, []);

//                                __\(--)/__    Remains uneffected by the previously saved data
useEffect(() => {
      if (starAnimationBtnRef.current) {
        const nodeHandle = findNodeHandle(starAnimationBtnRef.current);
        if (nodeHandle != null) {
          InteractionManager.runAfterInteractions(() => {
            UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
              StarAnimationPosition.width=width;
              StarAnimationPosition.height=height;
              StarAnimationPosition.positionX=pageX;
              StarAnimationPosition.positionY=pageY;
            });
          });
        }
      }
  }, []);


//                                __\(--)/__   Remains uneffected by the previously saved data
//Call setPositionsForNotPlacedLettersX and setPositionsForNotPlacedLettersY as soon as the array untouchedLetters gets changed

useEffect(()=>{
  if(!fileRead) return;
    if(untouchedLetters.length==0) return;

    firstUntouchedCharactersPosition=getThePositionOfTheKey(untouchedLetters[0]);
    secondUntouchedCharactersPosition=getThePositionOfTheKey(untouchedLetters[1]);
    thirdUntouchedCharactersPosition=getThePositionOfTheKey(untouchedLetters[2]);

    if(firstUntouchedCharactersPosition?.x
      &&secondUntouchedCharactersPosition?.x
      &&thirdUntouchedCharactersPosition?.x
      &&firstUntouchedCharactersPosition?.y
      &&secondUntouchedCharactersPosition?.y
      &&thirdUntouchedCharactersPosition?.y
    ){
      setPositionsForNotPlacedLettersX([firstUntouchedCharactersPosition.x,secondUntouchedCharactersPosition.x,thirdUntouchedCharactersPosition.x]);
      setPositionsForNotPlacedLettersY([firstUntouchedCharactersPosition.y,secondUntouchedCharactersPosition.y,thirdUntouchedCharactersPosition.y]);
      console.log(untouchedLetters);  
    }
},
[untouchedLetters,fileRead]
)

  const updateWord = (listOfWords: string[]) => {
    setMywords(listOfWords);
  };

  function keyPressed(key:string){
    if(key=='0'){
      roughString=roughString.slice(0,-1);
      setUserWordLength(roughString.length);
      userSetWords[numberOfTries]=roughString;
      updateWord(userSetWords);
      console.log('Update set of Words:');
      console.log(userSetWords);
      updateUserWordsInPreviousWordleFile(savedDataFileName,userSetWords);
    }
    else if(roughString.length<wordLength) {
      roughString+=key;
      setUserWordLength(roughString.length);
      userSetWords[numberOfTries]=roughString;
      updateWord(userSetWords);
      console.log('Update set of Words:');
      console.log(userSetWords);
      updateUserWordsInPreviousWordleFile(savedDataFileName,userSetWords);
    }
  }
  
  async function submit(){
    let userString=mywords[numberOfTries];
    if(targetWord!=undefined)
    await searchForWordInFiles(userString);
    else console.log("targetWord is undefined..."); 
  }

  const scale = useRef(new Animated.Value(1)).current;
  const scaleWandRotateButton = useRef(new Animated.Value(1)).current;
  const scaleStarThrowButton = useRef(new Animated.Value(1)).current;
  const skipButton = useRef(new Animated.Value(1)).current;

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  if (wordNotFoundError) {startShake(shakeAnim);}
  }, [wordNotFoundError]);

  /*
  * Final Verification for word submission
  */

  //                                __\(--)/__   Remains uneffected by the previously saved data

  const searchForWordInFiles=async(word_:string,)=>{
    let word:string=word_;

  setWordNotFoundErrorStatement("");

  clearTimeout(errorScreenTimeOut);
  const firstLetter=word[0]?.toLowerCase();
  word=word.toLowerCase();
  
  if(firstLetter==null) return;
  const path='dictionary/'+firstLetter+'-words.txt';
  try {
    const contents = await RNFS.readFileAssets(path);
    const wordlist = contents.split(', ');
    if (!wordlist.includes(word)) {
      setWordNotFoundErrorStatement("Not a valid word!!!");
      errorScreenTimeOut=setTimeout(()=>{
      setWordNotFoundErrorStatement("");
      },1000);
    }
    else{
      setWordNotFoundErrorStatement("");
      wandedLettersTemplate=[];
      let untouchedLettersTemplate=untouchedLetters;

      setWandedLetters(wandedLettersTemplate);
      if(targetWord!=undefined){
        for(let i=0;i<word.length;i++){
          if(targetWord[i]==word[i]){
            correctlyPlacedLetterSet.push(word[i]);
            if (untouchedLettersTemplate.indexOf(word[i]) !== -1) 
            untouchedLettersTemplate.splice(untouchedLettersTemplate.indexOf(word[i]), 1);
          }
          else if(targetWord.includes(word[i])&&!correctlyPlacedLetterSet.includes(word[i])){
            if(targetWord.indexOf(word[i])<i)
            prePlacedLetterset.push(word[i]);
            else postPlacedLetterset.push(word[i]);
            if (untouchedLettersTemplate.indexOf(word[i]) !== -1) 
            untouchedLettersTemplate.splice(untouchedLettersTemplate.indexOf(word[i]), 1);
          }
          else if(!correctlyPlacedLetterSet.includes(word[i])&&!prePlacedLetterset.includes(word[i])&&!postPlacedLetterset.includes(word[i])){
            notToBePlacedLetterSet.push(word[i]);
            if (untouchedLettersTemplate.indexOf(word[i]) !== -1) 
            untouchedLettersTemplate.splice(untouchedLettersTemplate.indexOf(word[i]), 1);
          }
      }
    const correctlyPlacedLetterSetTemplate=[... new Set(correctlyPlacedLetterSet)];
    const prePlacedLettersetTemplate=[... new Set(prePlacedLetterset)];
    const postPlacedLettersetTemplate=[... new Set(postPlacedLetterset)];
    const notToBePlacedLetterSetTemplate=[... new Set(notToBePlacedLetterSet)];

    setTimeout(()=>{
    //clear setWordFromTheWand as soon as submit button is pressed...
    //even before the correctlyplacedletters and others have been chosen...  

    setCorrectlyPlacedLetters(correctlyPlacedLetterSetTemplate);
    setprePlacedLetters(prePlacedLettersetTemplate);
    setpostPlacedLetters(postPlacedLettersetTemplate);
    setNotToBePlacedLetters(notToBePlacedLetterSetTemplate);
    setUntouchedLetters(untouchedLettersTemplate);

      if(numberOfTries==rows-1||word==targetWord){
      RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${savedDataFileName}`);
      console.log("Game Over. File Deleted...");
      navigation.navigate('Wordle');
      }

    }, 800*cols);

    let _numberOfTries=numberOfTries;
    _numberOfTries++;
    setNumberOfTries(_numberOfTries);
    wandedLettersIndex=_numberOfTries;

    updateAccessoryDataInPreviousShiftedWordleFile(
      savedDataFileName,
      _numberOfTries,
      wandedLettersTemplate,
      untouchedLettersTemplate,
      correctlyPlacedLetterSetTemplate,
      prePlacedLettersetTemplate,
      postPlacedLettersetTemplate,
      notToBePlacedLetterSetTemplate,
      userSetWords
    );
    roughString="";
    }
    }
  } catch (err) {
    console.error('Failed to read asset:', err);
  }
 }

/*    The buttons and their animations [LightWand and Starthrow]    */

    const StarAnimRef= useRef<StarAnimationRef>(null); 
    const [triggerLightSweep, setTriggerLightSweep] = useState(false);
    const [starThrowingAnimationToRun, setStarThrowingAnimationToRun]=useState(true);
 
     const runStarThrowingAnimation=()=>{
      if(starThrowingAnimationToRun&&untouchedLetters.length>=3&&profileData.playerCoins>=120){
         
        //Reduce player coins by 120 for using this animation
        let profileDataTemplate=profileData;
        profileDataTemplate.playerCoins=profileDataTemplate.playerCoins-120;
        setProfileData(profileDataTemplate);
        updateCoinsInPreviousProfileFile(profileDataTemplate.playerCoins);

         StarAnimRef.current?.startAnimation(1);
         setStarThrowingAnimationToRun(false);
         setTimeout(()=>{setStarThrowingAnimationToRun(true)},1000);
         const notToBePlacedLettersSubSet=[untouchedLetters[0],untouchedLetters[1],untouchedLetters[2]];
         
         notToBePlacedLetterSet=notToBePlacedLetterSet.concat(notToBePlacedLettersSubSet);
         setTimeout(()=>{
          setNotToBePlacedLetters(prev => [...prev, ...notToBePlacedLettersSubSet]);},500);
          setUntouchedLetters(prev => prev.slice(3));
     }
     }
 
     const runLightSweep = () => {
     if(!triggerLightSweep
      &&correctlyPlacedLetters.length!=cols
      &&targetWord
      &&wandedLetters.length<=cols-1
      &&mywords[numberOfTries].length<=cols-1
      &&profileData.playerCoins>=50
    ){
     setTriggerLightSweep(true);

     setTimeout(() => setTriggerLightSweep(false), 900);
      let index=0; let character="";
      //Change wandedLetters to be made from the number of cols
      let wandedLettersTemplate=Array(cols).fill('');
      let trialWord=mywords[numberOfTries];
      //Reduce player coins by 50 for using this animation
      let profileDataTemplate=profileData;
      profileDataTemplate.playerCoins=profileDataTemplate.playerCoins-50;
      setProfileData(profileDataTemplate);
      updateCoinsInPreviousProfileFile(profileDataTemplate.playerCoins);

        for(let i=trialWord.length;i<targetWord?.length;i++){
          //Find a character
          //that is not avaiable in
          //either correctlyPlacedLetters
          //or in wandedLetters [array of previous created wordFromWand]
          if(!correctlyPlacedLetters.includes(targetWord[i])&&!wandedLetters.includes(targetWord[i])){
            index=i;  character=targetWord[i]; break;
          }
        }
        console.log(index,character);

        if(character=="")
          setWordNotFoundErrorStatement("No empty positions found to use the wand");         
          //Catch the character and set it to the array lettersCreatedFromWand
          //If you see the user is in the same row
          //add the new character to the wandedLetters
          //and develop a new wordFromTheWand that re-renders our wordle boxes
          if(wandedLettersIndex==numberOfTries){
           wandedLettersTemplate[index]=character;
           setWandedLetters(wandedLettersTemplate);
          }
          else {
            setWandedLetters([]);
            wandedLettersTemplate[index]=character;
            setWandedLetters(wandedLettersTemplate);
          }
          wandedLettersIndex=numberOfTries;
     }
     };

  /* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist


  useEffect(()=>{
    if(!readRouteParameters)
       return;
  async function loadData() {
  const savedData = await readWordleDataFile(savedDataFileName);
  if(savedData){
    
  setGaneLoadingAnimationPrompt("Recovering Previously Saved Wordle");
    setPreviouslySavedData(true);
    setFileRead(true);
    setTargetWord(savedData.targetWord);
  let _size=savedData.size;
  switch(_size){
    case 1: _gameMode="Easy 4x5";
    case 2: _gameMode="Intermediate 5x5";
    case 3: _gameMode="Hard 6x5";
    case 4: _gameMode="Advanced 7x6";
    default: _gameMode="Easy 4x5";
  }

  setGameMode(_gameMode);
  setGameName(_gameName);
        
  setNumberOfTries(savedData.numberOfTries);
  setWandedLetters(savedData.wandedLetters);
  setUntouchedLetters(savedData.untouchedLetters);
  setCorrectlyPlacedLetters(savedData.correctlyPlacedLetters);
  setprePlacedLetters(savedData.prePlacedLetters);
  setpostPlacedLetters(savedData.postPlacedLetters);
  setNotToBePlacedLetters(savedData.notToBePlacedLetters);
  setMywords(savedData.userWord);
  setWordleSize( _size);
  
  console.log('Previously Found Data: ');
  console.log(savedData);
}
else{
  console.log("no file found");
  setGaneLoadingAnimationPrompt("Creating a new Wordle");
  setPreviouslySavedData(false);
  setFileRead(true);
  setGameMode(_gameMode);
  setGameName(_gameName);

  async function fetchWord() {
      const word = await pickARandomWord(wordLength);
      if (!word) return "";
      setTargetWord(word);

      //await updateTargetWordInPreviousWordleFile(savedDataFileName, word);
      //set The array positionOfNotPlacedLettersX and positionOfNotPlacedLettersY
      
      let theChar; 

      for (let i = 97; i <= 122; i++) {
        theChar=String.fromCharCode(i);
        if(!word?.includes(theChar)
          &&!correctlyPlacedLetters.includes(theChar)
          &&!prePlacedLetters.includes(theChar)
          &&!postPlacedLetters.includes(theChar)
          &&!notToBePlacedLetters.includes(theChar))
          localUntouchedLetters.push(theChar);
        }
        localUntouchedLetters=shuffleArray(localUntouchedLetters);
        setUntouchedLetters(localUntouchedLetters);
        return word;
    }
  let _targetWord= await fetchWord();  

  await saveShiftedWordleDataToFile(
    savedDataFileName,
    _targetWord,
    numberOfTries,
    wandedLetters,
    untouchedLetters,
    correctlyPlacedLetters,
    prePlacedLetters,
    postPlacedLetters,
    notToBePlacedLetters,
    mywords
  );
  const savedData = await readWordleDataFile(savedDataFileName);
  console.log('Newly Saved Data: ');
  console.log(savedData);
}
}
  loadData();
  },[readRouteParameters]);

useEffect(()=>{
  if(!fileRead) return;
  async function loadScoreData() {
  setGaneLoadingAnimationPrompt("Reading the Previous Score Data");
  const scoreData = await readWordleScoresData(scoreFileName, WordleSize);
  if(scoreData){    
    setScoreDataRead(true);
    let scoreDataTemplate={
      score: scoreData.score,
      winStreak: scoreData.winStreak
    };
    setScoreData(scoreDataTemplate);
}
else{
    console.log("no score data file found");
    setGaneLoadingAnimationPrompt("Creating a New Score Data File");
    await createWordleScoresData(scoreFileName);
    setScoreDataRead(true);
}
}
  loadScoreData();
},[fileRead]);

  if(!fileRead||!targetWord||targetWord.length==0||!scoreDataRead) {
   return(
   <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
          <GameLoadingAnimation gameLoadingAnimationPrompt={_gameLoadingAnimationPrompt}/>  
    </ImageBackground>
   )   
  }

  console.log(mywords);
  console.log(untouchedLetters.length);
  console.log(profileData.playerCoins);
  console.log(untouchedLetters.length < 3||profileData.playerCoins<120);

  return(
    <View style={{ flex: 1 }}>
<ScrollView style={{ flex: 1 }}>
    <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode}
      winStreak={scoreData.winStreak.toString()}
      score={scoreData.score.toString()}
      />

      {/* 
      <View>
      <Pressable  onPress={() => {readTheDir();}}>
        <Text style={{fontFamily: 'Wordlet-Regular', padding: 20}}>Read The Folder</Text>
      </Pressable>

      <Pressable  onPress={() => {
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${savedDataFileName}`);  
        console.log('File Deleted on being Clicked: '+savedDataFileName);
      }}>
        <Text style={{fontFamily: 'Wordlet-Regular', padding: 20}}>Delete The File</Text>
      </Pressable>
      </View>*/
      }

      <View style={styles.wordleContainer}>{
        Array.from({ length: rows }).map((_, index) => (
        <WordleRow 
        applyAnimation={(previouslySavedData&&index<numberOfTries)||index==numberOfTries-1}
        applyColors={index<numberOfTries}
        key={index}
        allowWandedLettersToBeWritten={index==numberOfTries}
        word={mywords[index]}
        targetWord={targetWord?targetWord:""}
        wandedLetters={wandedLetters}
        />
      ))}
      </View>
      <ShiftedAlphabetKeyboard
      onKeyPress={keyPressed}
      correctlyPlacedLetters={correctlyPlacedLetters}
      prePlacedLetters={prePlacedLetters}
      postPlacedLetters={postPlacedLetters}
      notToBePlacedLetters={notToBePlacedLetters}
      ></ShiftedAlphabetKeyboard>
      
      <View style={styles.helpButtonRow}>
      <View>  
      <Animated.View style={{transform: [{ scale:scaleWandRotateButton }] }} >
      <Pressable 
        onPressIn={()=>{if(!triggerLightSweep)buttonPressIn(scaleWandRotateButton)}}
        onPressOut={()=>{buttonPressOut(scaleWandRotateButton)}}
        onPress={runLightSweep}
        disabled={
          (correctlyPlacedLetters.length!=cols
          &&wandedLetters.length<=cols-1
          &&mywords[numberOfTries].length<=cols-1
          &&profileData.playerCoins>=50)||profileData.playerCoins<50}>
            <ImageBackground
                source={buttons.wandRotate}
                style={styles.wandRotate}
                imageStyle={styles.wandRotateImage}
            >       
            <LightSweep trigger={triggerLightSweep} sweepHorizontal={50} startingPoint={30} />
            </ImageBackground>
      </Pressable>
      </Animated.View>
      <View style={styles.wandPriceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, ...profileData.playerCoins>50?{color: 'white'}:{color: 'red'}}}>50</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
      </View>

      <View>
      <Animated.View style={{transform: [{scale: scaleStarThrowButton}] }}>
      <Pressable 
      onPressIn={()=>{if(starThrowingAnimationToRun)buttonPressIn(scaleStarThrowButton)}}
      onPressOut={()=>{buttonPressOut(scaleStarThrowButton)}}
      onPress={runStarThrowingAnimation}
      disabled={untouchedLetters.length < 3||profileData.playerCoins<120}
      >
          <ImageBackground
            source={buttons.starsThrowButton}
            style={[styles.stars]}
            imageStyle={styles.starsThrowImage}
            ref={starAnimationBtnRef}
          >
            <StarAnimation
              ref={StarAnimRef}
              animationStart1={{ x: 0, y: 0 }}
              animationStart2={{ x: 0, y: 0 }}
              animationStart3={{ x: 0, y: 0 }}
              animationEnd1={{ 
                x: positionOfNotPlacedLettersX[0]?positionOfNotPlacedLettersX[0]:0,
                y: positionOfNotPlacedLettersY[0]?positionOfNotPlacedLettersY[0]:0 }}
              animationEnd2={{ 
                x: positionOfNotPlacedLettersX[1]?positionOfNotPlacedLettersX[1]:0,
                y: positionOfNotPlacedLettersY[1]?positionOfNotPlacedLettersY[1]:0 }}
              animationEnd3={{
                x: positionOfNotPlacedLettersX[2]?positionOfNotPlacedLettersX[2]:0,
                y: positionOfNotPlacedLettersY[2]?positionOfNotPlacedLettersY[2]:0 }}
            />
          </ImageBackground>
          {(untouchedLetters.length<3||profileData.playerCoins<120) && (
          <View style={styles.disabledIconButton} pointerEvents="none"/>
          )}
      </Pressable>
      </Animated.View>
      <View style={styles.starPriceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, 
        ...profileData.playerCoins>120?{color: 'white'}:{color: 'red'}}}>120</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
      </View>
      <View style={{marginLeft: 'auto'}}>    
      <Animated.View style={{transform: [{ scale:skipButton }] }} >
      <Pressable 
        onPressIn={()=>{buttonPressIn(skipButton)}}
        onPressOut={()=>{buttonPressOut(skipButton)}}
        onPress={()=>{setSkipGameModalVisiblity(true)}}>
            <ImageBackground
                source={buttons.skipButton}
                style={styles.skipButton}
                imageStyle={styles.skipButtonImg}
            /> 
      </Pressable>
      </Animated.View>
      </View>

      </View>
      <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }, styles.errorTextContainer]}>
      <View style={[styles.error,
        wordNotFoundError == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><Text style={[styles.errorText]}>{wordNotFoundError}</Text>
      </View>
      </Animated.View>

      <Animated.View style={{transform: [{ scale }] }} >  
              <Pressable
              onPressIn={()=>{buttonPressIn(scale);}}
              onPressOut={() => {buttonPressOut(scale);}}
              onPress={() => submit()}
              disabled={userWordLength!==cols}
              style={{alignSelf:'center'}}
              >
              <ImageBackground
                source={buttons.submitButton}
                style={styles.submitBtnStyle}
                imageStyle={styles.submitBtnImage} 
              >
              </ImageBackground>
              {userWordLength!==cols && (
              <View style={styles.disabledButton} pointerEvents="none"/>
              )}
              </Pressable>
      </Animated.View>

      <SkipGameModal
                skippingCost={150}
                playerCoins={profileData.playerCoins}
                visible={skipGameModalVisiblity}
                onclose={hideSkipGameModal}
      />
    </ImageBackground>
    </ScrollView>
        <View
    style={{
      height: 60,
      backgroundColor: '#7cbbc2',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
    <WordleText>Google Banner Ads Here!!!</WordleText>
  </View>
    </View>
);}


type WordleRowProps={
  word: string;
  targetWord: string;
  applyAnimation: boolean;
  applyColors: boolean;
  wandedLetters: string[];
  allowWandedLettersToBeWritten: boolean;
}


 const WordleRow=(props:WordleRowProps)=>{
  //console.log(props.word);

  const word=props.word?props.word.toLowerCase():"";
  const target=props.targetWord;
  const wandedLetters=props.wandedLetters;

  const scales = useRef(Array.from({ length: cols }, () => new Animated.Value(1))).current;
  
  const colorArray = word !== "" ? computeColors() : [];

  function computeColors() {
    if (word.length !== target.length || !props.applyColors) return Array(target.length).fill("white");
    const result: ("green" | "red" | "gray" | "blue")[] = Array(word.length).fill("gray");
    const usedTargetIndexes: boolean[] = Array(word.length).fill(false);

    for (let i = 0; i < word.length; i++) {
      if (word[i] === target[i]) {
        result[i] = "green";
        usedTargetIndexes[i] = true;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (result[i] === "green") continue;
      for (let j = 0; j < target.length; j++) {
        if (!usedTargetIndexes[j] && word[i] === target[j]) {
          if(i<j)
          result[i] = "red";
          else result[i] = "blue";
          usedTargetIndexes[j] = true;
          break;
        }
      }
    }

    return result;
  }
  
const [colorFlags, setColorFlags] = useState<boolean[]>(Array(cols).fill(false));
const animationsCompleted=useRef(false);

useEffect(()=>{
if(props.applyAnimation&&!animationsCompleted.current){
  animationsCompleted.current=true;

const animations = scales.map((scale, i) =>{
  return ()=>{
  Animated.sequence([
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start(() => {
    setColorFlags(prev => {
      const updated = [...prev];
      updated[i] = true;
      return updated;
    });

    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });
 };
});

animations.reduce((prev, anim) => {
  return prev.then(() => new Promise(res => {
      anim();
    setTimeout(() => {res();}, 600);
  }));
}, Promise.resolve());
}})

  const getBoxColor = (index: number) => {
    if (word === "") return "#ccc";
    if (!colorFlags[index]) return "#ccc";
    
    if (colorArray[index] === "green") return "#66ce63";
    if (colorArray[index] === "red")  return "#fe5747";
    if (colorArray[index] === "blue") return "#61b1ba";
    if (colorArray[index] === "gray") return "#3e3e3e";
    return "#ccc";
  };

  return (
    <View style={styles.wordleRow}>
      {Array.from({ length: cols }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.wordleBox,
            {
              backgroundColor: getBoxColor(i),
            },
              props.applyAnimation && {transform: [{ scale: scales[i] }]},
              !props.word[i]&&wandedLetters[i]&&props.allowWandedLettersToBeWritten?/*wandedLetters[i]==props.word[i].toLowerCase() &&*/ {backgroundColor: '#d68796'}:undefined
          ]}
        >
          <Text
            style={[
              styles.wordleText,
              { color: ((!props.word[i]&&wandedLetters[i]&&props.allowWandedLettersToBeWritten)/*&&wandedLetters[i]==props.word[i].toLowerCase()*/)? '#4f4f4f':
              ((colorFlags[i]&&colorArray[i] === "gray") ? "white" : "black") },
            ]}
          >
            {props.allowWandedLettersToBeWritten&&!props.word[i]&&wandedLetters[i]?wandedLetters[i]?.toUpperCase():(props.word[i] || "")
            }
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};
  
async function pickARandomWord(wordLength: number): Promise<string | undefined> {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let index = Math.floor(Math.random() * alphabet.length);
  let path='dictionary/'+alphabet[index]+'-words.txt';

  for(let trials=0; trials<100; trials++){
    try{
    const contents = await RNFS.readFileAssets(path, 'utf8');
    const wordlist=contents.split(', ');
    const targettedWordList=wordlist.filter(word=>word.length==wordLength);
    
    if (targettedWordList.length > 0) {
        const secondIndex = Math.floor(Math.random() * targettedWordList.length);
        return targettedWordList[secondIndex];
    }
    else{
      index = Math.floor(Math.random() * alphabet.length);
      path='dictionary/'+alphabet[index]+'-words.txt';
    }
  }
  catch(err){
    console.log("Error while reading file: ", (err as Error).message);
    return undefined;
  }}
}

function getThePositionOfTheKey(theKey:string){
  
    //The positions of the star throw animation button
    const initialX=StarAnimationPosition.positionX;
    const initialY=StarAnimationPosition.positionY;

    const arrayOfTheKeys='qwertyuiopasdfghjklzxcvbnm';
    const index=arrayOfTheKeys.indexOf(theKey);

    if(index<0) return null;
    if(index<=9)
      return {
        x: firstRowKeyMeasurements.positionX+(firstRowKeyMeasurements.width+1)*index-initialX,
        y: firstRowKeyMeasurements.positionY-initialY
      };
    else if(index>9&&index<=18)
      return {
        x: secondRowKeyMeasurements.positionX+(secondRowKeyMeasurements.width+1)*(index-10)-initialX,
        y: secondRowKeyMeasurements.positionY-initialY
      };
    
    else if(index>18)
      return {
        x: thirdRowKeyMeasurements.positionX+(thirdRowKeyMeasurements.width+1)*(index-19)-initialX,
        y: thirdRowKeyMeasurements.positionY-initialY
      };
    
    else 
    return {
      x: firstRowKeyMeasurements.positionX + (firstRowKeyMeasurements.width+1) * (index - 19)-initialX,
      y: firstRowKeyMeasurements.positionY -initialY
    };
}


export default App;