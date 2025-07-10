/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Image, Animated, Pressable, UIManager, findNodeHandle, ScrollView, PanResponder } from 'react-native';
import {styles} from '../../source/styles/cryptogram-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import { SmallerWhiteWordleText } from '../Skip-Game-Modal';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Cryptograms-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { readCryptogramDataFile, saveCryptogramDataToFile, updateAccessoryDataInPreviousCryptogramFile, updateNumberofLevelsCleared } from './Cryptograms-Data-Files';
import  LottieView from 'lottie-react-native';
import { Costs, Rewards } from '../Rewards';
import { WordLadderKeyBoard } from '../alphabet-keyboard';


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

type CryptogramMatchRouteProp = RouteProp<RootStackParamList, 'CryptogramMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;

  const App = () => {
  //const route = useRoute<CryptogramMatchRouteProp>();
  
  const route={
    params:{
      level: 1,
      heading: 1
    }
  };
  /**/
  const  navigation = useNavigation<NavigationProp>();
  
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [readTheGameFile, setReadGameFile]=useState(false);

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
    
    const [gameSentence, setGameSentence]=useState("");
    const [gameSentenceHints, setGameSetHints]=useState<string[]>([]);
    const [unShuffledGameSentence, setUnShuffledGameSentence]=useState("");
    const [gameSenteceToWork, setGameSentenceToWork]=useState<string[]>([]);

    let randomizationIndex: number;
    const _gameName='Cryptogram';

    const scale= new Animated.Value(1);
    const helpBtnScale = new Animated.Value(1);
    const hintedWords:string[]=[];
    const [temporaryDisableHelp, setTempDisableHelp]=useState(false);

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Cryptogram files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Cryptogram Size");
    let _level;

    if (route.params) {
      _level=route.params.level;
      coins=Rewards.Cryptogram.coins;
      xp=Rewards.Cryptogram.xp;
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
      const gameDataFileName = "cryptograms/cryptogram-"+route.params.heading+".json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content)[route.params.level];
      const _unShuffledGameSentence=content.sentence;
      const hintedCharacters=content.hintedCharactersIndex;
      randomizationIndex=content.randomizationIndex;

      let _gameSentence=setTheShuffling(_unShuffledGameSentence);
      
      while(_gameSentence.trim()==_unShuffledGameSentence.trim()){
        _gameSentence=setTheShuffling(_unShuffledGameSentence);
      }
      
      setGameSentence(_gameSentence);
      setReadGameFile(true);
      
      let __unshuffledString=Array(_unShuffledGameSentence.length).fill(" ");
      
      for(let i=0; i<hintedCharacters.length; i++)
        __unshuffledString[hintedCharacters[i]]=_unShuffledGameSentence[hintedCharacters[i]];
      
      //Player gets the Hints
      //But he updates the game sentence to work
      //and finally checks with the unshuffled game sentence...
      setGameSetHints(__unshuffledString);
      setUnShuffledGameSentence(_unShuffledGameSentence);
      setGameSentenceToWork(Array(_unShuffledGameSentence.length).fill(" "));
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  readTheGameFile();
}, [readRouteParameters,/* route*/]);

//Process all kind of shufflings that you like in here...
function setTheShuffling(str: string){
    let randomShift1= (Math.floor(Math.random() * 53) - 26);
    while(randomShift1==0||randomShift1==26)
        randomShift1=(Math.floor(Math.random() * 53) - 26);

    
    let randomShift2= (Math.floor(Math.random() * 53) - 26);
    while(randomShift2==0||randomShift2==26)
        randomShift2=(Math.floor(Math.random() * 53) - 26);

    switch(randomizationIndex){
        case 1: return shiftAll(str, randomShift1);
        case 2: return shiftBothTheHalves(str, randomShift1, randomShift2);
        case 3: return shiftTheAlternates(str, randomShift1);
        case 4: return shiftByAdditionalPositionalOffsets(str, randomShift1);
        case 5: return shiftTheConsonantsAndVowels(str, randomShift1, randomShift2);
        default: return shiftAll(str, randomShift1);
    }
}

function shiftAll(input: string, shiftValue: number, selectiveCharacters: string[]=[]): string {
  return input.replace(/[a-zA-Z]/g, (char) => {
    if(!selectiveCharacters.includes(char)){
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = (char.charCodeAt(0) - base - shiftValue + 26) % 26;
    return String.fromCharCode(base + offset);}
    else return char;
  });
}

function shiftBothTheHalves(input: string, shiftValueUpperHalf: number, shiftValueLowerHalf: number, selectiveCharacters: string[]=[]){
  return input.replace(/[a-zA-Z]/g, (char) => {
    
    if(!selectiveCharacters.includes(char)){
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = (char.charCodeAt(0)-base>13)?(char.charCodeAt(0) - base - shiftValueUpperHalf + 26) % 26:(char.charCodeAt(0) - base - shiftValueLowerHalf + 26) % 26;
    return String.fromCharCode(base + offset);}
    else return char;
  });  
}

function shiftTheAlternates(input: string, shiftValue: number, selectiveCharacters: string[]=[]){
  return input.replace(/[a-zA-Z]/g, (char) => {
    if(!selectiveCharacters.includes(char)){
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = (char.charCodeAt(0)-base%2==0)?(char.charCodeAt(0)-base+shiftValue+26):(char.charCodeAt(0) - base - shiftValue + 26) % 26;
    return String.fromCharCode(base + offset);}
    else return char;
  });  
}

function shiftByAdditionalPositionalOffsets(input: string, shiftValue: number, selectiveCharacters: string[]=[]){
  return input.replace(/[a-zA-Z]/g, (char) => {
    if(!selectiveCharacters.includes(char)){
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = (char.charCodeAt(0) - base - shiftValue + 26) % 26;
    const secondOffset = (offset+ char.charCodeAt(0) - base + 1) %26;
    return String.fromCharCode(base + secondOffset);}
    else return char;
  });  
}

function shiftTheConsonantsAndVowels(input: string, shiftValueCons: number, shiftValueVowel: number, selectiveCharacters: string[]=[]){
    const vowels=['a','e','i','o','u'];
  return input.replace(/[a-zA-Z]/g, (char) => {
    if(!selectiveCharacters.includes(char)){
    const isUpper = char >= 'A' && char <= 'Z';
    const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
    const offset = (vowels.includes(char.toLowerCase()))?(char.charCodeAt(0) - base - shiftValueVowel + 26) % 26:(char.charCodeAt(0) - base - shiftValueCons + 26) % 26;
    return String.fromCharCode(base + offset);}
    else return char;
  });  
}



/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist

  
function submit(){
  const _workSentence:string[]=[...gameSenteceToWork];
  const _hintSentence=[...gameSentenceHints];

  for(let i=0; i<_workSentence.length; i++){
    if(_hintSentence[i]!=" ")
      _workSentence[i]=_hintSentence[i];
  }
  
  const finalSentence=_workSentence.join('').toLowerCase();
  if(finalSentence.trim()==unShuffledGameSentence.trim()){
    setConfettiAnimation(true);
    const _profileData=profileData;
    _profileData.playerXP+=xp;
    _profileData.playerCoins+=coins;
    setProfileData(_profileData);
    updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
    setTimeout(()=>{
    const maxLevels=100;
    if(route.params.level==maxLevels){
      if(route.params.heading==5)
        navigation.navigate("CryptogramLevels");
      else navigation.replace("CryptogramMatch", {
        level: 1, heading: route.params.heading+1
      });
    }
    else
      navigation.replace("CryptogramMatch", {level: route.params.level+1, heading: route.params.heading});
  }, 2500)};
}  



function keyPressed(key: string){
  let _workSentence:string[]=[...gameSenteceToWork];
  const _hintSentence=[...gameSentenceHints];
  const theUnShuffledString=unShuffledGameSentence;
  
  if(key!='0'){
    for(let i=0; i<theUnShuffledString.length; i++){
      if(theUnShuffledString[i]!=' '&&_hintSentence[i]==' '&&_workSentence[i]==" "){
        _workSentence[i]=key.toUpperCase();
          break;
      }
    }
    setGameSentenceToWork(_workSentence);
  }
  else{
    for(let i=theUnShuffledString.length-1; i>=0; i--){
      if(theUnShuffledString[i]!=' '&&_hintSentence[i]==' '&&_workSentence[i]!=" "){
        _workSentence[i]=" ";
          break;
      }
    }
    setGameSentenceToWork(_workSentence);

  }
}


//                                __\(--)/__    Changes by previously saved data

  if(!profileDataRead||!readRouteParameters||!readTheGameFile||unShuffledGameSentence.length!=gameSentence.length) {
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
      gameName={_gameName}
      gameMode={"Portion "+route.params.heading}
      />
      <ImageBackground
        source={buttons.blueButton}
        style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
      <WordleText style={{paddingVertical: 5, paddingHorizontal: 12, fontSize: 16}}>Level {route.params.level}</WordleText>
      </ImageBackground>

<View style={styles.theSentenceContainer}>
{
      gameSentence.split('').map((letter, i) => (
    <View key={i}>    
    <View style={[styles.gameSentenceCharacters, letter!=' '?{backgroundColor: '#ebfff8'}:{}]}>
      <WordleText style={{fontSize: 22, color: '#003b33'}}>{letter.toUpperCase()}</WordleText>
    </View>
    <View style={[styles.hintsKey, letter!=' '?{backgroundColor: '#fffeeb', borderWidth: 0.8}:{}]}>
      <WordleText style={{fontSize: 22, color: '#003b33'}}>{gameSenteceToWork[i]==" "?gameSentenceHints[i].toUpperCase():gameSenteceToWork[i].toUpperCase()}</WordleText>
    </View>
    </View>
    ))
}
</View>

<Animated.View style={{transform: [{ scale }] }} >  
              <Pressable
              onPressIn={()=>{buttonPressIn(scale);}}
              onPressOut={() => {buttonPressOut(scale);}}
              onPress={() => submit()}
              style={{alignSelf:'center'}}
              >
              <ImageBackground
                source={buttons.submitButton}
                style={styles.submitBtnStyle}
                imageStyle={styles.submitBtnImage} 
              >
              </ImageBackground>
              </Pressable>
      </Animated.View>
<View style={{alignSelf: 'flex-end', marginRight: 30, marginBottom: 20}}>
<Animated.View style={{transform: [{scale: helpBtnScale}]}}>
  <Pressable
  onPressIn={()=>buttonPressIn(helpBtnScale)}
  onPressOut={()=>buttonPressOut(helpBtnScale)}
  disabled={(hintedWords.length==unShuffledGameSentence.split(' ').length)||profileData.playerCoins<Costs.Cryptogram||temporaryDisableHelp}
  onPress={()=>{
    const unshuffled=unShuffledGameSentence;
    const theWords=unshuffled.split(' ');

    if(hintedWords.length==theWords.length) return;
    let appropriateGapFound=false;

    let indicesOfTheWord=[];
    let aRandomWord:string="";

    while(!appropriateGapFound){
    indicesOfTheWord=[];  
    aRandomWord=theWords[Math.floor(Math.random()*theWords.length)];
    let firstIndexOfTheWord=unshuffled.indexOf(aRandomWord);
     
    for(let i=0;i<aRandomWord.length; i++)
      indicesOfTheWord.push(firstIndexOfTheWord+i);

    for(let i=0; i<indicesOfTheWord.length-1; i++){
      if(gameSentenceHints[indicesOfTheWord[i]]==' '){
        appropriateGapFound=true
        break;
      }
    }
    }
    
    if(appropriateGapFound&&aRandomWord!=""){
      hintedWords.push(aRandomWord);
      const _gameSentenceForHint=[...gameSentenceHints];
      for(let i=0; i<indicesOfTheWord.length; i++)
        _gameSentenceForHint[indicesOfTheWord[i]]=aRandomWord[i];
      setGameSetHints(_gameSentenceForHint);
      let _profileData=profileData;
      _profileData.playerCoins-=Costs.Cryptogram;
      setProfileData(_profileData);
      updateCoinsInPreviousProfileFile(_profileData.playerCoins);
      setTempDisableHelp(true);
      setTimeout(()=>{setTempDisableHelp(false)}, 1000);
    }
    
  }}
  >
    <ImageBackground
        source={buttons.pinkButton}
        style={{width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
    >
    <Image
        source={icons.yellowBulb} 
        style={{width: '100%', height: '100%', transform:[{scaleY: 0.85},{scaleX: 0.9}]}}/>
    </ImageBackground>
    {(temporaryDisableHelp||hintedWords.length==unShuffledGameSentence.split(' ').length||profileData.playerCoins<Costs.Cryptogram)&&(
      <View style={styles.disabledButton} pointerEvents="none"/>                   
    )}
  </Pressable>
</Animated.View>
      <View style={styles.priceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, 
        ...profileData.playerCoins>Costs.Cryptogram?{color: 'white'}:{color: 'red'}}}>{Costs.Cryptogram}</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
</View>
<WordLadderKeyBoard onKeyPress={keyPressed}/>

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

/*
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
*/
export default App;
/*
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
    */