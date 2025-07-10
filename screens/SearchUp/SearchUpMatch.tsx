import  {useState, useRef, useEffect, JSX} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import {View, ImageBackground, Animated as PreAnimated,/**/ Pressable, UIManager, findNodeHandle, ScrollView, Dimensions } from 'react-native';
import {styles} from '../../source/styles/search-up-match-styles';
import { buttons } from '../../source/styles/assets';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Searchup-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { readSearchUpDataFile, saveSearchUpDataToFile, updateAccessoryDataInPreviousSearchUpFile } from './SearchUp-Data-Files';
import  LottieView from 'lottie-react-native';
import { updateNumberofLevelsCleared } from './SearchUp-Data-Files';
import { NoOfLevels, Rewards as RewardsData } from '../Rewards';
import React from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import  { useSharedValue, useAnimatedStyle, } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

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

type SearchUpMatchRouteProp = RouteProp<RootStackParamList, 'SearchUpMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let _pressedLetters:string[]=[];
  let _pressedLettersIndex:number[]=[];
  let coins: number;
  let xp: number;
  let _triggeredIndices: number[]=[];
  let _theAllowedIndices: number[]=[];

  let boxWidth=40;

  /*const route={
    params:{
      gameMode: 1,
      level: 1,
      difficulty: 4,
    }
  }*/

  const App = () => {
  const route = useRoute<SearchUpMatchRouteProp>();

  const [rows, setRows]=useState();
  const [cols, setCols]=useState();

  const screenWidth = Dimensions.get('window').width;
  const [enableZoom, setEnableZoom]=useState(false);
  
  const  navigation = useNavigation<NavigationProp>();
  const [gridLetters, setGridLetters] = useState<string>("");
  

  const [fileRead, setFileRead]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [readTheGameFile, setReadGameFile]=useState(false);

  const [gameMode, setGameMode]=useState("");
  const [gameName, setGameName]=useState("");
  const [gameType, setGameType]=useState("");
  const [savedDataFileName, setSavedDataFileName]=useState("");
  const [profileDataRead, setProfileDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
  });

    const [_gameLoadingAnimationPrompt, setGameLoadingAnimationPrompt]=useState("");
    const [confettiAnimation, setConfettiAnimation]=useState(false);
    
    const [wordsInArray, setWordsInArray]=useState<string[]>([]);
    const [detectedWords, setDetectedWords]=useState<string[]>([]);

  let floatingBoxesPositions: number[][]=[];
  const _gameName='SearchUp';

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the SearchUp files and set the board


/*Get the Profile Data and Wordle Scores Data First */
useEffect(()=>{
  async function loadProfileData() {
  setGameLoadingAnimationPrompt("Getting Profile Data");
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
  setProfileDataRead(true);

  await saveProfileDataToFile(
    profileData.profileName,
    profileData.playerXP,
    profileData.playerCoins,
    profileData.playerLevel,
    profileData.lastMatch,
  );
}
}
  loadProfileData();
},[]);

//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  if(!profileDataRead) return;
  const loadConfiguration = async () => {    
  setGameLoadingAnimationPrompt("Setting the SearchUp Size");
    let difficulty, _level, _gameMode, _gameType;

    if (route.params) {
      difficulty=route.params.difficulty;
      _level=route.params.level;
    
    let gameAwardInfo;
      
    switch(route.params.gameType/*.toLowerCase().trim()*/){
            case /*"normal"*/1: gameAwardInfo=RewardsData.SearchUp.Normal; /*noOfLevelsInfo=NoOfLevels.SearchUp.Normal;*/ _gameType='normal'; break;
            case /*"reverse"*/2: gameAwardInfo=RewardsData.SearchUp.Reverse; /*noOfLevelsInfo=NoOfLevels.SearchUp.Reverse;*/ _gameType='reverse'; break;
            case /*"diagonal"*/3: gameAwardInfo=RewardsData.SearchUp.Diagonal;/* noOfLevelsInfo=NoOfLevels.SearchUp.Diagonal;*/ _gameType='diagonal'; break;
            case /*"labyrinth"*/4: gameAwardInfo=RewardsData.SearchUp.Labryinth; /*noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth;*/ _gameType='labyrinth'; break;
            default: gameAwardInfo=RewardsData.SearchUp.Normal; /*noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth;*/ _gameType='normal'; break;
    }

    //console.log(difficulty);
    switch(difficulty){
      case 1: coins=gameAwardInfo.easy.coin; xp=gameAwardInfo.easy.xp; _gameMode="Easy"; break;
      case 2: coins=gameAwardInfo.intermediate.coin; xp=gameAwardInfo.intermediate.xp; _gameMode="Intermediate"; break;
      case 3: coins=gameAwardInfo.hard.coin; xp=gameAwardInfo.hard.xp; _gameMode="Hard"; break;
      case 4: coins=gameAwardInfo.advanced.coin; xp=gameAwardInfo.advanced.xp; _gameMode="Advanced"; break;
      default: coins=gameAwardInfo.easy.coin; xp=gameAwardInfo.easy.xp; _gameMode="Easy"; break;
    }

    setGameMode(_gameMode);
    setGameName(_gameName);
    setGameType(_gameType);
    const _savedDataFileName=`_level${_level}-${_gameType}-${_gameMode}-${_gameName.replace(' ','-')}.json`;
    setSavedDataFileName(_savedDataFileName);
    setReadRouteParameters(true);
  }
};

  loadConfiguration();
}, [route.params,/**/ profileDataRead]);

const [minScaleLimit, setMinScaleLimit]=useState(1);
const searchUpRef=useRef(null);
const [positions, setPositions]= useState({x: 0, y: 0});
const [floatingBoxes, setFloatingBoxes]=useState<JSX.Element[]>([]);
const [previousFloatingBoxesPositions, setPreviousFloatingBoxesPositions]=useState<number[][]>([]);


//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  console.log(gameMode, gameType);
  if (!readRouteParameters&&gameMode!=""&&gameType!="") return;

  async function readTheGameFile() {
    if(gameType==""||gameMode=="") return;
    try {
      const gameDataFileName = "searchup-levels/"+gameType+"/"+gameMode.toLowerCase()+"/level-" + route.params.level + ".json";

      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content);
      const theWords=content.words;

      setWordsInArray(theWords);
      setRows(content.rows);
      setCols(content.cols);
      
      let _cols=content.cols;
      
      setEnableZoom(_cols*boxWidth>screenWidth);
      setMinScaleLimit(parseFloat((screenWidth/(_cols*boxWidth)).toFixed(1)));
      minScaleLimitShared.value=minScaleLimit;

      setGridLetters(content.letters);
      setReadGameFile(true);

    } catch (error) {
      console.log("File not found or error reading:", error);

    }
  }

  readTheGameFile();
}, [readRouteParameters, route/*.paramsroute*/, gameMode, gameType]);

/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist

  useEffect(()=>{
    if(!readTheGameFile)
       return;
  async function loadData() {
  //await RNFS.unlink(savedDataFileName);
  const savedData  =await readSearchUpDataFile(savedDataFileName);

  if(savedData){
    setGameLoadingAnimationPrompt("Recovering Previously Saved SearchUps");
    setFileRead(true);
    
    setDetectedWords(savedData.detectedWords);
    floatingBoxesPositions=savedData.floatingBoxesPositions;
    setPreviousFloatingBoxesPositions(floatingBoxesPositions);
    //console.log(floatingBoxesPositions);
}
else{
  console.log("no file found");
  setGameLoadingAnimationPrompt("Creating a new SearchUp");
  setFileRead(true);
  await saveSearchUpDataToFile(
    savedDataFileName,
    detectedWords,
    floatingBoxesPositions
  );
}
}
  loadData();
  },[readTheGameFile]);
  

useEffect(() => {
  if (rows && cols && fileRead) {
    setTimeout(() => {
      const handle = findNodeHandle(searchUpRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, w, h, pageX, pageY) => {
        setPositions({x: pageX, y: pageY});
        });
      }
    }, 0);
  }
}, [rows, cols, fileRead]);

useEffect(()=>{
  if(rows && cols && fileRead){
  for(let i=0;i<previousFloatingBoxesPositions.length;i++)
      designTheFloatingBoxes(previousFloatingBoxesPositions[i][0], previousFloatingBoxesPositions[i][1], rows, cols, i);
  }
},[positions, fileRead, previousFloatingBoxesPositions])


function findTheStringAndCheckIt(str: string){
      const thePositionsOfTheWord = wordsInArray.indexOf(str);
      _detectedWords=detectedWords;
      if(thePositionsOfTheWord!=-1){
        setDetectedWords(prev => (
        prev.includes(str) ? prev : [...prev, str]
        ));
    if (!_detectedWords.includes(str)) _detectedWords.push(str);
    return true;
    }
    return false;
}  

function checkIfTheSearchUpIsComplete(){
    if(haveSameElements(wordsInArray, detectedWords)){
      setConfettiAnimation(true);
      updateNumberofLevelsCleared(gameName, gameMode, route.params.level);
      if(coins&&xp){
      const _profileData=profileData; 
      _profileData.playerCoins+=coins;
      _profileData.playerXP+=xp;

      //updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
      //setProfileData(_profileData);
      setTimeout(()=>{
        setConfettiAnimation(false);
        let _maxLevel: number;
        let noOfLevelsInfo;

        switch(route.params.gameType/*.toLowerCase().trim()*/){
            case 1: noOfLevelsInfo=NoOfLevels.SearchUp.Normal; break;
            case 2: noOfLevelsInfo=NoOfLevels.SearchUp.Reverse; break;
            case 3: noOfLevelsInfo=NoOfLevels.SearchUp.Diagonal; break;
            case 4: noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth; break;
            default: noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth; break;
        }


        switch(route.params.difficulty){
         case 1: _maxLevel=noOfLevelsInfo.easy; break;
         case 2: _maxLevel=noOfLevelsInfo.intermediate; break;
         case 3: _maxLevel=noOfLevelsInfo.hard; break;
         case 4: _maxLevel=noOfLevelsInfo.advanced; break;   

         default: _maxLevel=noOfLevelsInfo.easy; break;
        }
        if(route.params.level==_maxLevel)
          navigation.navigate('SearchUpLevels', {difficulty: route.params.difficulty, gameType: route.params.gameType, /*gameType: _gameType*/});
        else navigation.navigate('SearchUpMatch', {difficulty: route.params.difficulty, level: route.params.level+1, gameType: route.params.gameType, /*gameType: _gameType*/});
      },2500);
    }}
}

function getTheAllowedIndices(triggeredIndex: number[], cols: number, previousAllowedIndices: number[]){

  if(triggeredIndex.length==1){
    const threeColumns=[triggeredIndex[0]-cols, triggeredIndex[0],triggeredIndex[0]+cols];
    return [threeColumns[0]-1, threeColumns[0], threeColumns[0]+1,
    threeColumns[1]-1, threeColumns[1], threeColumns[1]+1,
    threeColumns[2]-1, threeColumns[2], threeColumns[2]+1,
  ];
  }
  else{
    let difference=Math.abs(triggeredIndex[1]-triggeredIndex[0]);
    if(difference==1)
      return [triggeredIndex[triggeredIndex.length-1]+1, triggeredIndex[triggeredIndex.length-1], triggeredIndex[triggeredIndex.length-1]-1];
    else if(difference==cols){
      return [triggeredIndex[triggeredIndex.length-1]+8, triggeredIndex[triggeredIndex.length-1], triggeredIndex[triggeredIndex.length-1]-8];
    }
    else if(difference==cols+1){
      return [triggeredIndex[triggeredIndex.length-1]+cols+1, triggeredIndex[triggeredIndex.length-1], triggeredIndex[triggeredIndex.length-1]-cols-1];
    }
    else return previousAllowedIndices;
  }
}

const wordsList=[];
const [triggeredIndex, setTriggeredIndex]=useState<number[]>([]);


let _detectedWords: string[]=[];

function distanceBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}


function designTheFloatingBoxes(start: number, end: number, rows: number, cols: number, index: number){
    console.log(start, end, index, rows, cols);
    console.log(positions);
    if(positions.x==0||positions.y==0||!rows||!cols) return;
    const difference=Math.abs(start-end);
    const startRowCol=getTheColumnAndRowFromIndex(start);
    const endRowCol=getTheColumnAndRowFromIndex(end);

    //console.log(startRowCol, endRowCol);

    const distance=boxWidth*distanceBetweenPoints(startRowCol.row, startRowCol.column, endRowCol.row, endRowCol. column);
    //console.log(startRowCol, endRowCol, distance);
    //const startingCol=startRowCol.column>endRowCol.column?endRowCol.column:startRowCol.column;

    let angle;
    if(difference<cols) {
      angle=Math.PI/2;
      if(startRowCol.column<endRowCol.column) angle=-1*angle;
    }
    else if(difference%cols==0) angle=0;
    else {
      angle=Math.atan(cols/rows);
      if(startRowCol.column<endRowCol.column) angle=-1*angle;
    }

const bgColors = [
  "#FF3B3033", "#FF980033", "#FFEB3B33", "#00E67633", "#00B0FF33",
  "#7C4DFF33", "#E040FB33", "#F5005733", "#FF6D0033", "#64DD1733",
  "#2979FF33", "#D500F933", "#00C85333", "#FF408133", "#18FFFF33",
  "#AA00FF33", "#FDD83533", "#C5116233", "#00BFA533", "#FF174433",
  "#651FFF33", "#1DE9B633", "#FFC40033", "#6200EA33", "#76FF0333",
  "#FF572233", "#C6FF0033", "#0091EA33", "#FF174433", "#FFD60033",
  "#304FFE33", "#FF910033", "#00C85333", "#D500F933", "#E6510033"
];

const borderColors = [
  "#FF3B30", "#FF9800", "#FFEB3B", "#00E676", "#00B0FF",
  "#7C4DFF", "#E040FB", "#F50057", "#FF6D00", "#64DD17",
  "#2979FF", "#D500F9", "#00C853", "#FF4081", "#18FFFF",
  "#AA00FF", "#FDD835", "#C51162", "#00BFA5", "#FF1744",
  "#651FFF", "#1DE9B6", "#FFC400", "#6200EA", "#76FF03",
  "#FF5722", "#C6FF00", "#0091EA", "#FF1744", "#FFD600",
  "#304FFE", "#FF9100", "#00C853", "#D500F9", "#E65100"
];

    const width = 25;
    const extraHeight=(difference<8||difference%8==0)?boxWidth:(boxWidth*1.5)*Math.sin(Math.abs(angle));
    const height = extraHeight+distance-12;
    let left=(difference<8||difference%8==0)?positions.x+7.5:positions.x+3;
    left=left+startRowCol.column*boxWidth;
    let top=(angle==0)?12:(angle==Math.PI/2||angle==-Math.PI/2)?37:23;
    top=top+startRowCol.row*boxWidth;

    const component=(
    <View
    style={{position: 'absolute',
      width: width,
      backgroundColor: bgColors[index],
      borderColor: borderColors[index],
      height: height,
      left: left,
      top: top,
      borderRadius: 12,
      borderWidth: 0.8,
      transform: [
  { translateX: -width / 2 },
  { translateY: -height / 2 },
  { rotate: `${angle}rad` },
  { translateX: width / 2 },
  { translateY: height / 2 },
],
    }}
    key={index}
    >
    </View>);

    setFloatingBoxes(prev=>
      prev.includes(component)?
      prev:
      [...prev, component]);
    console.log(floatingBoxes);  
}

function getTheColumnAndRowFromIndex(cellIndex: number){
  //cols=11; rows=11;
  if(cols&&rows){
  let column=cellIndex%cols;
  let row=Math.floor(cellIndex/rows);

  return {column: column, row: row};
  }
  else return {column: 0, row: 0} 
}

  const scale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const minScaleLimitShared = useSharedValue(minScaleLimit);

  const translateX = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);

  const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = lastScale.value * e.scale;
      scale.value = clamp(newScale, minScaleLimitShared.value, 1);
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if(cols){
      const newTranslateX = lastTranslateX.value + e.translationX;
      const margin=5+Math.abs(lastScale.value*40*cols-screenWidth)/2;
      translateX.value = clamp(newTranslateX, -margin, margin);
    }
    })
    .onEnd((e) => {
      lastTranslateX.value = translateX.value;
    });
  /**/
  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture/**/);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));


//get the AllowedIndixes from the triggeredIndex...

for(let i=0;i<wordsInArray.length;i++)
  wordsList.push(<WordleText key={i} style={[styles.clueWord, 
    detectedWords.includes(wordsInArray[i])?{backgroundColor: '#a1d1a8', borderWidth: 1, paddingHorizontal: 3, borderRadius: 3}: undefined]}>{wordsInArray[i]}</WordleText>);

const checkingTimeout = useRef<NodeJS.Timeout | null>(null);
       
//                                __\(--)/__    Changes by previously saved data

  if(!fileRead||!profileDataRead||!readRouteParameters||!readTheGameFile||!(rows&&cols)) {
   return(
   <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
          <GameLoadingAnimation gameLoadingAnimationPrompt={_gameLoadingAnimationPrompt}/>  
    </ImageBackground>

   )   
  }
  return(
<View style={{ flex: 1 }}>
    <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
<ScrollView style={{ flex: 1 }}>
      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode}
      />
      <ImageBackground
        source={buttons.blueButton}
        style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
      <WordleText style={{paddingVertical: 5, paddingHorizontal: 12, fontSize: 16}}>Level {route.params.level}</WordleText>   

      </ImageBackground>
      {
  rows && cols ? (
    enableZoom? (
    <GestureDetector gesture={composedGesture}>
        {<Animated.View style={animatedStyle}>
<View style={styles.wordleContainer}>
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={styles.wordleRow}>
          {Array.from({ length: cols }).map((_, i) => {
            const cellIndex = index * cols + i;
            const probableRef=cellIndex==0? {ref: searchUpRef}: {};
            return (
              <Pressable
                key={i}
                {...probableRef}
                onPress={() => {
                  if (checkingTimeout.current) 
                    clearTimeout(checkingTimeout.current);
                  
                  if(_theAllowedIndices.length==0){
                   if(!_triggeredIndices.includes(cellIndex))
                    _triggeredIndices.push(cellIndex);
                  }
                  
                  else if(_theAllowedIndices.includes(cellIndex)){
                    if(!_triggeredIndices.includes(cellIndex))
                      _triggeredIndices.push(cellIndex);
                  }

                  _theAllowedIndices=getTheAllowedIndices(_triggeredIndices, cols, _theAllowedIndices);
                  //console.log(cellIndex, _theAllowedIndices);
                  if(_theAllowedIndices.length==0||_theAllowedIndices.includes(cellIndex)){
                  
                  setTriggeredIndex(prev => prev.includes(cellIndex) ? prev : [...prev, cellIndex]);                  
                  //console.log(triggeredIndex);

                  if(!_pressedLettersIndex.includes(cellIndex)){
                      _pressedLetters.push(gridLetters[cellIndex]);
                      _pressedLettersIndex.push(cellIndex);
                  }
                  
                  checkingTimeout. current= setTimeout(()=>{
                  const checking=findTheStringAndCheckIt(_pressedLetters.join(''));
                  checkIfTheSearchUpIsComplete();
                  _pressedLetters=[];
                  _pressedLettersIndex=[];
                  setTriggeredIndex([]);
                
                  if(checking){
                  const subFloatingBoxes=[_triggeredIndices[0], _triggeredIndices[_triggeredIndices.length-1]];
                  if(!floatingBoxesPositions.includes(subFloatingBoxes))
                  {
                      floatingBoxesPositions.push(subFloatingBoxes);
                      designTheFloatingBoxes(_triggeredIndices[0], _triggeredIndices[_triggeredIndices.length-1], rows, cols, floatingBoxesPositions.length);
                  }
                  updateAccessoryDataInPreviousSearchUpFile(savedDataFileName, _detectedWords, floatingBoxesPositions); 
                  }
                  _triggeredIndices=[];
                  _theAllowedIndices=[];
                  },2500)
                  }
                }}
              >
                <View
                  style={[
                    styles.wordleBox,
                    triggeredIndex.includes(cellIndex)
                      ? { backgroundColor: '#f0ffff' }
                      : { backgroundColor: '#e0d9cc' },
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.wordleText,
                      { color: '#3b1601', marginTop: 3 },
                    ]}
                  >
                    {getTheAppropriateLetter(gridLetters, index, i, cols)}
                  </Animated.Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>{floatingBoxes.map(elem=>elem)}
        </Animated.View>}
    </GestureDetector>

    ):(
    <View>
      <View style={styles.wordleContainer}>
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={styles.wordleRow}>
          {Array.from({ length: cols }).map((_, i) => {
            const cellIndex = index * cols + i;
            const probableRef=cellIndex==0? {ref: searchUpRef}: {};
            return (
              <Pressable
                key={i}
                {...probableRef}
                onPress={() => {
                  if (checkingTimeout.current) 
                    clearTimeout(checkingTimeout.current);
                  
                  if(_theAllowedIndices.length==0){
                   if(!_triggeredIndices.includes(cellIndex))
                    _triggeredIndices.push(cellIndex);
                  }
                  
                  else if(_theAllowedIndices.includes(cellIndex)){
                    if(!_triggeredIndices.includes(cellIndex))
                      _triggeredIndices.push(cellIndex);
                  }

                  _theAllowedIndices=getTheAllowedIndices(_triggeredIndices, cols, _theAllowedIndices);
                  //console.log(cellIndex, _theAllowedIndices);
                  if(_theAllowedIndices.length==0||_theAllowedIndices.includes(cellIndex)){
                  
                  setTriggeredIndex(prev => prev.includes(cellIndex) ? prev : [...prev, cellIndex]);                  
                  //console.log(triggeredIndex);

                  _pressedLetters.push(gridLetters[cellIndex]);
                  
                  checkingTimeout. current= setTimeout(()=>{
                  const checking=findTheStringAndCheckIt(_pressedLetters.join(''));
                  checkIfTheSearchUpIsComplete();
                  _pressedLetters=[];
                  setTriggeredIndex([]);
                  if(checking){
                  const subFloatingBoxes=[_triggeredIndices[0], _triggeredIndices[_triggeredIndices.length-1]];
                  floatingBoxesPositions.push(subFloatingBoxes);
                  designTheFloatingBoxes(_triggeredIndices[0], _triggeredIndices[_triggeredIndices.length-1], rows, cols, floatingBoxesPositions.length);
                  updateAccessoryDataInPreviousSearchUpFile(savedDataFileName, _detectedWords, floatingBoxesPositions);  
                  }
                  _triggeredIndices=[];
                  _theAllowedIndices=[];
                  },2500)
                  }
                }}
              >
                <View
                  style={[
                    styles.wordleBox,
                    triggeredIndex.includes(cellIndex)
                      ? { backgroundColor: '#f0ffff' }
                      : { backgroundColor: '#e0d9cc' },
                  ]}
                >
                  <PreAnimated.Text
                    style={[
                      styles.wordleText,
                      { color: '#3b1601', marginTop: 3 },
                    ]}
                  >
                    {getTheAppropriateLetter(gridLetters, index, i, cols)}
                  </PreAnimated.Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>{floatingBoxes.map(elem=>elem)}
    </View>
  )) : null
}

<View style={styles.clueContainer}>
        <View style={styles.childClueContainer}>
          <View style={styles.cluesText}>{wordsList}</View>
        </View>
</View>
</ScrollView>
    {
    confettiAnimation&&
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position:'absolute', top: 0, left: 0, right:0, bottom: 0, zIndex: 999 }}>
    <LottieView
        source={require('./../../assets/animations/confetti.json')} 
        autoPlay
        style={{ width: '100%', height: '100%' }}/>
    </View>
    }
    </ImageBackground>
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

export default App;

function getTheAppropriateLetter(_characters: string, row: number, col: number, cols: number){
  let characters=_characters.split('');
  let index = row*cols+col;
  //console.log(col, index , characters[index]);
  //console.log(cols);
  //return 'Q';
  return characters[index];
}

function haveSameElements<T>(a: T[], b: T[]): boolean {
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size !== setB.size) return false;

  for (const item of setA) {
    if (!setB.has(item)) return false;
  }

  return true;
}

