/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { startShake } from '../../source/styles/ingame-styles';
import {View, ImageBackground, Animated, ScrollView, Pressable, Image } from 'react-native';
import {styles} from '../../source/styles/wordladder-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { SmallerWhiteWordleText, WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './WordLadder-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import  LottieView from 'lottie-react-native';
import { Costs, noOfWords, Rewards } from '../Rewards';
import { getTheNumberofLevelsCleared, updateNumberofLevelsCleared, getTheCorrespondingsOfWord } from './WordLadder-Data-Files';
import { WordLadderKeyBoard } from '../alphabet-keyboard';
import { Rewards as RewardsComponent } from '../../source/styles/gapfill-modal-styles';

type WordLadderMatchRouteProp = RouteProp<RootStackParamList, 'WordLadderMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  let maximumLimitOfWords: number;
  let theSetOfWords: string[];
  const bgColors=["#fcf5d4", "#ffdab9", "#d9fbff", "#ffdbe7", "#f5fffa", "#f0fff0", "#fccccc", "#fbceb1", "#e1f4fc", "#fce2c7", "#f5d4fc"]

  const App = () => {
  const route = useRoute<WordLadderMatchRouteProp>();
  /*const route={
    params:{
      wordSize: 4
    }
  };*/
  const  navigation = useNavigation<NavigationProp>();
  
  const [wordsPrepared, setWordsPrepared]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [colorIndex, setColorIndex]=useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    
    const [wordSize, setTheWordSize]=useState<number|undefined>(undefined);

  const gameName='Word Ladder';
  let _gameMode: string;
  const [gameMode, setGameMode]=useState("");
  const [currentLevel, setCurrentLevel]=useState<number|undefined>();
  const [firstWord, setTheFirstWord]=useState("");
  const [secondWord, setTheSecondWord]=useState("");

  const [roughString, setRoughString]=useState("");
  const [listOfWords, setListOfWords]=useState<string[]>([]);
  const [gameError, setGameErrorStatement] =useState("");

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

// First load the Profile Data
// Second read the route.params
// Third set the board


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
  setGameLoadingAnimationPrompt("Setting the Word Ladder");
    let wordSize;

    if (route.params) {
      wordSize=route.params.wordSize;
      setTheWordSize(wordSize);
    const getTheNumberOfLevelsCleared=await getTheNumberofLevelsCleared(route.params.wordSize);
    setCurrentLevel(getTheNumberOfLevelsCleared+1);  
    
    switch(wordSize){
      case 3: coins=Rewards.WordLadder[3].coin; xp=Rewards.WordLadder[3].xp; _gameMode='Easy'; maximumLimitOfWords=noOfWords.WordLadder[3]; break;
      case 4: coins=Rewards.WordLadder[4].coin; xp=Rewards.WordLadder[4].xp; _gameMode='Intermediate'; maximumLimitOfWords=noOfWords.WordLadder[4]; break;
      case 5: coins=Rewards.WordLadder[5].coin; xp=Rewards.WordLadder[5].xp; _gameMode='Hard'; maximumLimitOfWords=noOfWords.WordLadder[5]; break;
      case 6: coins=Rewards.WordLadder[6].coin; xp=Rewards.WordLadder[6].xp; _gameMode='Advanced'; maximumLimitOfWords=noOfWords.WordLadder[6]; break;
      default: coins=Rewards.WordLadder[3].coin; xp=Rewards.WordLadder[3].xp; _gameMode='Easy'; maximumLimitOfWords=noOfWords.WordLadder[3]; break;
    }

    setReadRouteParameters(true);
    setGameMode(_gameMode);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);
/**/

//                                __\(--)/__    Remains uneffected by previously saved data

const [jsonObject, setJSONObject] = useState<Record<number, string[]>>({});

useEffect(() => {
  if (!readRouteParameters||!wordSize) return;

  async function preListTheWords() {
    try {
        let wordSizeInWords:string;

        switch(wordSize){
          case 3: wordSizeInWords="three"; break;
          case 4: wordSizeInWords="four"; break;
          case 5: wordSizeInWords="five"; break;
          case 6: wordSizeInWords="six"; break;
          default: wordSizeInWords="three"; break;
        }

        let path='word-ladder/'+wordSizeInWords+'-letter-word-ladder'+'.json';
        const contents = await RNFS.readFileAssets(path, 'utf8');
        const _jsonObject =JSON.parse(contents);

        setJSONObject(_jsonObject);
        setWordsPrepared(true);
        
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  preListTheWords();
}, [readRouteParameters, wordSize]);
  
useEffect(()=>{
  if(!jsonObject||!wordSize||!currentLevel||!wordsPrepared) return;
  theSetOfWords=(jsonObject[currentLevel]);
  //console.log(theSetOfWords);

  setTheFirstWord(theSetOfWords[0]);
  setTheSecondWord(theSetOfWords[theSetOfWords.length-1]);
  setColorIndex(Math.floor(Math.random()*bgColors.length));

},
[jsonObject, currentLevel, wordsPrepared])

/* *************************************** Coding the Component JSX here ****************************************** */
 
async function findTheStringAndCheckIt(){
  let lastEnteredWord: string;
  if(roughString.length!=wordSize) return;
  if(listOfWords.length==0)
    lastEnteredWord=firstWord;
  else lastEnteredWord=listOfWords[listOfWords.length-1];
  
  
  let changedCharacters=0;
  console.log(changedCharacters);
  for(let i=0;i<lastEnteredWord.length; i++)
    if(lastEnteredWord[i].toLowerCase()!=roughString[i].toLowerCase()) changedCharacters++;
  
  if(changedCharacters>1)
  {
    setGameErrorStatement("The word cannot be placed in the ladder. It does not meet the rules.");
    setTimeout(()=>{setGameErrorStatement("")}, 1000);
  }
  else if(listOfWords.includes(roughString))
  {
    setGameErrorStatement("The word cannot be placed in the ladder since it has been already placed.");
    setTimeout(()=>{setGameErrorStatement("")}, 1000);
  }
  else{
    const correspondingsOfLastEnteredWord=await getTheCorrespondingsOfWord(wordSize, lastEnteredWord);
    console.log(correspondingsOfLastEnteredWord);
    if(correspondingsOfLastEnteredWord.length==0){
    setGameErrorStatement("The word is not a valid English Word.");
    setTimeout(()=>{setGameErrorStatement("")}, 1000);
    return;
    }

    if(listOfWords.length<=maximumLimitOfWords){
    const _listOfWords=[...listOfWords];
    _listOfWords.push(roughString);
    setListOfWords(prev => [...prev, roughString]);
    setRoughString("");
    if(_listOfWords[_listOfWords.length-1]==secondWord.toUpperCase()){
      setConfettiAnimation(true);
      updateNumberofLevelsCleared(wordSize, currentLevel as number);
      setTimeout(()=>{
      navigation.replace("WordLadderMatch", {wordSize: wordSize});
    }, 2500);
  }
  }
  }
}  

const clearAllBtnScale = new Animated.Value(1);
const checkBtnScale = new Animated.Value(1);
const helpBtnScale = new Animated.Value(1);

function keyPressed(key: string){
  if(wordSize){
    if(key!='0'){
  let _roughString=roughString;
  if(_roughString.length<wordSize)
    _roughString+=key;
  setRoughString(_roughString);
  }
  else{
  let _roughString=roughString;
  if(_roughString.length>0)
    _roughString=_roughString.slice(0, -1);
  setRoughString(_roughString);

  }
}
}

useEffect(() => {
  if (gameError!="") {startShake(shakeAnim);}
  }, [gameError]);


//                                __\(--)/__    Changes by previously saved data

  if(!profileDataRead||!readRouteParameters||firstWord==""||secondWord==""||!xp||!coins) {
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
<ScrollView style={{ flex: 1}} contentContainerStyle={{flexGrow: 1}}  nestedScrollEnabled={true}>

      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode+" ["+route.params.wordSize+" Letters]"}
      />
      <View style={{backgroundColor: '#ffffff80', alignSelf: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4}}>
<RewardsComponent xp={xp.toString()} coins={coins.toString()}></RewardsComponent>
      </View>
<View style={styles.roughStringContainer}>
  {firstWord.split('').map((item, index)=>(
    <WordleText key={index} style={[styles.roughStringLetter, {backgroundColor: bgColors[colorIndex]}]}>{item.toUpperCase()}</WordleText>
  ))
  }
</View>

<ScrollView style={{maxHeight: 100, minHeight: 100}} nestedScrollEnabled={true}>
  {
listOfWords.map((item, index)=>(
  <View key={index} style={styles.listOfWords}>
  {item.split('').map((_item, _index)=>(
      <WordleText key={_index} style={styles.lettersInListOfWords}>{_item.toUpperCase()}</WordleText>
  ))}
  </View>
))
  }
</ScrollView>

<View style={styles.roughStringContainer}>
  {secondWord.split('').map((item, index)=>(
    <WordleText key={index} style={[styles.roughStringLetter, {backgroundColor: bgColors[colorIndex]}]}>{item.toUpperCase()}</WordleText>
  ))
  }
</View>

<View style={styles.theRoughString}>
  {roughString.split('').map((item, index)=>(
    <WordleText key={index} style={styles.lettersInListOfWords}>{item.toUpperCase()}</WordleText>
  ))
  }
</View>

{gameError!=""&&<Animated.View style={{transform: [{ translateX: shakeAnim }], marginHorizontal: 20, backgroundColor: '#24242470', marginVertical: 10, borderRadius: 3}} >
  <WordleText style={styles.errorText}>{gameError}</WordleText>
</Animated.View>}
<View style={{alignSelf: 'flex-end', marginRight: 30, marginBottom: 20}}>
<Animated.View style={{transform: [{scale: helpBtnScale}]}}>
  <Pressable
  onPressIn={()=>buttonPressIn(helpBtnScale)}
  onPressOut={()=>buttonPressOut(helpBtnScale)}
  onPress={()=>{
    const lastWord = listOfWords[listOfWords.length - 1] || '';
    if(lastWord=='')
      setListOfWords(prev => [...prev, theSetOfWords[1]]);
    else
      setListOfWords(prev => [...prev, theSetOfWords[listOfWords.length-1]]);
  }}
  disabled={profileData.playerCoins<Costs.WordLadderHelp[wordSize as 3|4|5|6]}
  >
    <ImageBackground
        source={buttons.blueButton}
        style={{width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
    >
    <Image
        source={icons.yellowBulb} 
        style={{width: '100%', height: '100%', transform:[{scaleY: 0.85},{scaleX: 0.9}]}}/>
    </ImageBackground>
    {profileData.playerCoins<Costs.WordLadderHelp[wordSize as 3|4|5|6]&&(
      <View style={styles.disabledButton} pointerEvents="none"/>
                    
    )}
  </Pressable>
</Animated.View>
      <View style={styles.priceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, 
        ...profileData.playerCoins>Costs.WordLadderHelp[wordSize as 3|4|5|6]?{color: 'white'}:{color: 'red'}}}>{Costs.WordLadderHelp[wordSize as 3|4|5|6]}</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
</View>


<WordLadderKeyBoard onKeyPress={keyPressed}/>

<View style={{flexDirection: 'row', gap: 10, alignSelf: 'center'}}>
                <Animated.View style={{transform: [{scale: clearAllBtnScale}]}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(clearAllBtnScale)}
                  onPressOut={()=>buttonPressOut(clearAllBtnScale)}
                  onPress={()=>{setListOfWords([]);}}
                  >
                   <ImageBackground
                    source={buttons.redButton}
                    style={{width: 90, aspectRatio: 2.3, alignItems: 'center', justifyContent: 'center'}}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                   >
                    <WordleText>Clear All</WordleText>
                    </ImageBackground> 
                  </Pressable>
                </Animated.View>

                <Animated.View style={{transform: [{scale: checkBtnScale}]}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(checkBtnScale)}
                  onPressOut={()=>buttonPressOut(checkBtnScale)}
                  onPress={()=>{ findTheStringAndCheckIt();}}
                  >
                   <ImageBackground
                    source={buttons.blueButton}
                    style={{width: 80, aspectRatio: 2.1, alignItems: 'center', justifyContent: 'center'}}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                   >
                    <WordleText>Check</WordleText>
                    </ImageBackground> 
                  </Pressable>

                </Animated.View>
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

