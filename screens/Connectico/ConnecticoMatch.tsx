/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect, cloneElement} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { startShake } from '../../source/styles/ingame-styles';
import {View, Text, ImageBackground, TextProps, Image, Animated, Pressable, ImageSourcePropType, UIManager, findNodeHandle, InteractionManager, ScrollView, BackHandler, PanResponder } from 'react-native';
import {styles} from '../../source/styles/connectico-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText, SmallerWhiteWordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Connectico-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { readConnecticoDataFile, saveConnecticoDataToFile, updateAccessoryDataInPreviousConnecticoFile } from './Connectico-Data-Files';
import  LottieView from 'lottie-react-native';
import { updateNumberofLevelsCleared } from './Connectico-Data-Files';
import { NoOfLevels, Rewards } from '../Rewards';


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

type ConnecticoMatchRouteProp = RouteProp<RootStackParamList, 'ConnecticoMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let cols: number;
  let rows: number;
  let allLetters:string[]=[];
  let _pressedLetters:string[]=[];
  let roughString="";
  let coins: number;
  let xp: number;


  const App = () => {
  const route = useRoute<ConnecticoMatchRouteProp>();
  /*
  const route={
    params:{
      difficulty: 1,
      level: 1
    }
  };
  */
  const  navigation = useNavigation<NavigationProp>();
  const [userLetters, setUserLetters] = useState<string[]>([""]);
  

  const [fileRead, setFileRead]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [readTheGameFile, setReadGameFile]=useState(false);
  const [allowedGrids, setAllowedGrids]=useState<number[]>([]);

  const [gameMode, setGameMode]=useState("");
  const [gameName, setGameName]=useState("");
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
    const [keys, setKeys]=useState<string[]>([""]);
    const [pressedLetters, setPressedLetters]=useState<string[]>([]);
    const [wordsInArray, setWordsInArray]=useState<Record<string, number[]>>({});
    const [sentence, setTheSentence]=useState("");
    const [animationIndex, setAnimationIndex]=useState<number[]>([]);


  const _gameName='Connectico';
  let _gameMode="Easy";

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Connectico files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Connectico Size");
    let size, _level;

    if (route.params) {
      size=route.params.difficulty;
      _level=route.params.level;
    
    switch(size){
      case 1: coins=Rewards.Connectico.easy.coin; xp=Rewards.Connectico.easy.xp; _gameMode='Easy'; break;
      case 2: coins=Rewards.Connectico.intermediate.coin; xp=Rewards.Connectico.intermediate.xp; _gameMode='Intermediate'; break;
      case 3: coins=Rewards.Connectico.hard.coin; xp=Rewards.Connectico.hard.xp; _gameMode='Hard'; break;
      case 4: coins=Rewards.Connectico.advanced.coin; xp=Rewards.Connectico.advanced.xp; _gameMode='Advanced'; break;
      default: coins=Rewards.Connectico.easy.coin; xp=Rewards.Connectico.easy.xp; _gameMode='Easy'; break;
    }
    const _savedDataFileName=`_level${_level}-${_gameMode.toLowerCase()}-${_gameName.replace(' ','-')}.json`;
    //setLevel(route.params.level);
    setSavedDataFileName(_savedDataFileName);
    setReadRouteParameters(true);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);


//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  if (!readRouteParameters) return;

  async function readTheGameFile() {
    try {
      const gameDataFileName = "connectico-levels/"+_gameMode.toLowerCase()+"/level-" + route.params.level + ".json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content);
      const theWords=content.words;
      const _allowedGrids=content.allowedGrids;
      const allowedGridsArr=_allowedGrids.split(',');
      const updatedAllowedGridsArr = allowedGridsArr
            .map((value:string) => parseInt(value))
            .filter((num:number) => !isNaN(num));

      setWordsInArray(theWords);
      setTheSentence(content.sentence);
      setAllowedGrids(updatedAllowedGridsArr);
      rows=content.rows;
      cols=content.cols;
      setUserLetters(Array(rows*cols).fill(""));
      allLetters=Array(rows*cols).fill("");

      const keys=shuffleArray(content.keys);
      setKeys(keys);
      setReadGameFile(true);
      setPressedLetters([]);
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  readTheGameFile();
}, [readRouteParameters, route/**/]);


/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist

  useEffect(()=>{
    if(!readRouteParameters)
       return;
  async function loadData() {
  const savedData  =await readConnecticoDataFile(savedDataFileName);
  if(savedData){
    
  setGameLoadingAnimationPrompt("Recovering Previously Saved Connecticos");
    setFileRead(true);
    setGameMode(_gameMode);
    setGameName(_gameName);
    //setUserLetters(savedData.userLetters);
}
else{
  console.log("no file found");
  setGameLoadingAnimationPrompt("Creating a new Connectico");
  setFileRead(true);
  setGameMode(_gameMode);
  setGameName(_gameName);
  await saveConnecticoDataToFile(
    savedDataFileName,
    userLetters
  );
}
}
  loadData();
  },[readRouteParameters]);
  
function findTheStringAndCheckIt(str: string){
      const thePositionsOfTheWord = wordsInArray[str];
      //console.log(thePositionsOfTheWord);
      if(thePositionsOfTheWord){
        console.log(thePositionsOfTheWord, str);
        setUserLetters(prevUserLetters => {
          const newLetters = [...prevUserLetters];
        for(let i = 0; i < thePositionsOfTheWord.length; i++) 
        newLetters[thePositionsOfTheWord[i] - 1] = str[i];
        console.log(newLetters);
        return newLetters;
        });

      setAnimationIndex(() => [...thePositionsOfTheWord]);
      for(let i = 0; i < thePositionsOfTheWord.length; i++)
      allLetters[thePositionsOfTheWord[i] - 1] = str[i];
      }
}  

function checkIfTheConneticoIsComplete(str:string){
    if(str==sentence){
      setConfettiAnimation(true);
      updateNumberofLevelsCleared(gameMode, route.params.level);
      if(coins&&xp){
      const _profileData=profileData; 
      _profileData.playerCoins+=coins;
      _profileData.playerXP+=xp;
      //updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
      //setProfileData(_profileData);

      setTimeout(()=>{
        setConfettiAnimation(false);
        let _maxLevel: number;
        switch(route.params.difficulty){
         case 1: _maxLevel=NoOfLevels.Connectico.easy; break;
         case 2: _maxLevel=NoOfLevels.Connectico.intermediate; break;
         case 3: _maxLevel=NoOfLevels.Connectico.hard; break;
         case 4: _maxLevel=NoOfLevels.Connectico.advanced; break;   

         default: _maxLevel=NoOfLevels.Connectico.easy; break;
        }

        if(route.params.level==_maxLevel)
          navigation.navigate('ConnecticoLevels', {size: route.params.difficulty});
        else navigation.navigate('ConnecticoMatch', {difficulty: route.params.difficulty, level: route.params.level+1});
      },2500);
    }}
}


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

      <View style={[styles.wordleContainer, {marginVertical: 5}]}>{
        Array.from({ length: rows }).map((_, index) => (
        <ConnecticoRow 
        key={index}
        numberOfRow={index}
        characters={userLetters}
        allowedGrids={allowedGrids}
        animationIndex={animationIndex}
        />
      ))}
      </View>
<View style={styles.pressedKeysContainer}>
{
      pressedLetters.map((letter, i) => (
    <View key={i} style={styles.pressedKey}>
      <WordleText style={{fontSize: 30, color: '#003b33'}}>{letter}</WordleText>
    </View>
    ))
}
</View>

      <DesignTheKeys keys={keys} setPressedLetters={setPressedLetters} findTheStringAndCheckIt={findTheStringAndCheckIt} checkIfTheConneticoIsComplete={checkIfTheConneticoIsComplete}/>
      {/* <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }, styles.errorTextContainer]}>
      <View style={[styles.error,
        wordNotFoundError == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><Text style={[styles.errorText]}>{wordNotFoundError}</Text>
      </View>
      </Animated.View> */}

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


type ConnecticoRowProps={
  characters: string[];
  numberOfRow: number;
  allowedGrids: number[];
  animationIndex: number[];
}


 const ConnecticoRow=(props:ConnecticoRowProps)=>{
  const allowedBoxes=findTheAllowedBoxesInTheRow(props.numberOfRow, props.allowedGrids);
  //const allowedBoxes=[0,1,2,3,4,5];
  if(rows&&cols)
  return (
    <View style={[styles.wordleRow, {gap: 0.5, marginVertical: 0.5}]}>
      {Array.from({ length: cols }).map((_, i) => {    
    const cellIndex = props.numberOfRow * cols + i;
    const animationScale = useRef(new Animated.Value(0)).current;
    const hasAnimated = useRef(false);

      useEffect(() => {
        if (props.animationIndex.includes(cellIndex+1) && !hasAnimated.current) {
          hasAnimated.current = true;
          Animated.timing(animationScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, [cellIndex, props.animationIndex]);
      return (
        <View
          key={i}
          style={[styles.wordleBox,
            {
              backgroundColor: !allowedBoxes.includes(i)? 'transparent' :'#e0d9cc',
              borderWidth: !allowedBoxes.includes(i)? 0 : 1,
              borderRadius: 3,
            },
          ]}>
          <Animated.Text
            style={[
              styles.wordleText,
              {color: '#3b1601'},
              {transform:[{scale: animationScale}]}
            ]}>
            {
              /**
               * [0, 1, 2]
               * [2]
               * [0, 2, 3, 4]
               * [0, 3]
               */
            allowedBoxes.includes(i)?
            getTheAppropriateLetter(props.characters, props.numberOfRow, i):''
            }
          </Animated.Text>
        </View>
      )}
      
      
      )}
    </View>
  );
};

export default App;

function findTheAllowedBoxesInTheRow(row: number, allowedGrids: number[]){
    const columnsToConsider=[];
    for(let i=1; i<=cols; i++){
      if(allowedGrids.includes(i+(row)*cols))
        columnsToConsider.push(i-1);
    }
    //console.log(columnsToConsider); 
    return columnsToConsider;
}

function getTheAppropriateLetter(characters: string[], row: number, col: number){
  let index = row*cols+col;
  console.log(col, index , characters[index]);
  //console.log(cols);
  //return 'Q';
  return characters[index];
}

function shuffleArray(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface DesignTheKeyProps {
  keys: string[],
  setPressedLetters: React.Dispatch<React.SetStateAction<string[]>>;
  findTheStringAndCheckIt: (str: string)=>void,
  checkIfTheConneticoIsComplete: (str: string)=>void
}

const DesignTheKeys:React.FC<DesignTheKeyProps>= ({keys, setPressedLetters, findTheStringAndCheckIt, checkIfTheConneticoIsComplete})=>{
  const animatedScales = useRef(keys.map(() => new Animated.Value(1))).current;
  const buttonRefs=useRef([]);
  const triggered =useRef(new Set());

  const panResponder=useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: ()=>true,
      onPanResponderMove: (_, gestureState)=>{
        buttonRefs.current.forEach((ref, index) => {
          if (!ref || triggered.current.has(index)) return;
          const node = findNodeHandle(ref);
          if (node != null)
          UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
            const inside =
              gestureState.moveX > pageX &&
              gestureState.moveX < pageX + width &&
              gestureState.moveY > pageY &&
              gestureState.moveY < pageY + height;
            if (inside) {
              triggered.current.add(index);
              buttonPressIn(animatedScales[index]);
              setPressedLetters(prev => {
              if (!prev.includes(keys[index])) 
                return [...prev, keys[index]];
                return prev;
              });
              _pressedLetters.push(keys[index]);
              //console.log(_pressedLetters);
             }
          });
      })
    }, 
      onPanResponderRelease: () => {
      (triggered.current as Set<number>).forEach((index: number) => {
      buttonPressOut(animatedScales[index]);
      });
      triggered.current.clear();
      setPressedLetters([]);
      roughString=_pressedLetters.join('');
      findTheStringAndCheckIt(roughString);
      _pressedLetters=[];
      const finalSentence=allLetters.filter(item=>item!='').join('');
      checkIfTheConneticoIsComplete(finalSentence);
      }
  }
  )
)
  const pairedViews = [];

  for (let i = 1; i < keys.length; i += 2) {
  pairedViews.push(
      <View key={i} style={styles.keyBtnRows}>
          <TheKeys _key={keys[i]} animatedScaleValue={animatedScales[i]} index={i} buttonRefs={buttonRefs}/>
          {keys[i + 1] && (
          <TheKeys _key={keys[i+1]} animatedScaleValue={animatedScales[i+1]} index={i+1} buttonRefs={buttonRefs}/>
          )}
      </View>
  );}
  if(keys.length%2==1){
    return(
      <View style={{alignSelf: 'center', alignItems: 'center'}} {...panResponder.current.panHandlers}>
        <View> 
          <TheKeys _key={keys[0]} animatedScaleValue={animatedScales[0]} index={0} buttonRefs={buttonRefs}/>
        </View>
        { pairedViews }
        <View>
        </View>
      </View>
    )
  }
}

interface TheKeyProps {
  _key: string,
  animatedScaleValue: Animated.Value,
  index: number,
  buttonRefs: any,
}

const TheKeys: React.FC<TheKeyProps>=({_key, animatedScaleValue, index, buttonRefs})=>{
    return(
      <Animated.View style={{transform: [{scale: animatedScaleValue}]}}>
            <ImageBackground
            source={buttons.goldenButton}
            ref={ref => { if (ref) buttonRefs.current[index] = ref;}}
            style={styles.keyBtn}
            imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1,}}
            >
              <WordleText style={{fontSize: 35, color: '#5e0e10',}}>{_key}</WordleText>
            </ImageBackground>
      </Animated.View>  
    )
}