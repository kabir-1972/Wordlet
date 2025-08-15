/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect, JSX} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import {View, ImageBackground, Animated, Dimensions, Modal, UIManager, findNodeHandle, ScrollView, Pressable } from 'react-native';
import {styles} from '../../source/styles/anagrammist-match-styles';
import { buttons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Anagrammist-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import { addWordQuicker } from '../Wordlet-Bucket';

type AnagrammistMatchRouteProp = RouteProp<RootStackParamList, 'AnagrammistMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  let _pressedIndices: number[]=[];
  let theLetters:string[]=[];
  const bgColors=["#fceb9d", "#ffdab9", "#b0e0e6", "#fff0f5", "#f5fffa", "#f0fff0", "#f08080", "#fbceb1", "#c0e8f9", "#fff5b7", "#fceb9d"]
  let seconds: number;

  const App = () => {
  const route = useRoute<AnagrammistMatchRouteProp>();
  const wordListLength=100;
  /*const route={
    params:{
      wordSize: 4
    }
  };*/
  const  navigation = useNavigation<NavigationProp>();
  
  const [wordsPrepared, setWordsPrepared]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [colorIndex, setColorIndex]=useState(0);

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
    const [roughString, setRoughString]=useState<string[]>([]);
    
    const [wordSize, setTheWordSize]=useState<number|undefined>(undefined);
    const [levelFailureModal, setLevelFailureModal]=useState(false);

  const gameName='Anagrammist';
  let _gameMode: string;
  const [gameMode, setGameMode]=useState("");
  const [theChosenWords, setTheChosenWords]=useState<string[]>([]);
  const [currentLevel, setCurrentLevel]=useState(1);
  const [currentWord, setTheCurrentWord]=useState("");

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
  setGameLoadingAnimationPrompt("Setting the Anagrammist Size");
    let wordSize;

    if (route.params) {
      wordSize=route.params.wordSize;
      setTheWordSize(wordSize);
    
    switch(wordSize){
      case 4: coins=Rewards.Anagrammist[4].coin; xp=Rewards.Anagrammist[4].xp; _gameMode='Easy'; break;
      case 5: coins=Rewards.Anagrammist[5].coin; xp=Rewards.Anagrammist[5].xp; _gameMode='Intermediate'; break;
      case 6: coins=Rewards.Anagrammist[6].coin; xp=Rewards.Anagrammist[6].xp; _gameMode='Hard'; break;
      case 7: coins=Rewards.Anagrammist[7].coin; xp=Rewards.Anagrammist[7].xp; _gameMode='Advanced'; break;
      case 8: coins=Rewards.Anagrammist[8].coin; xp=Rewards.Anagrammist[8].xp; _gameMode='Extreme'; break;
      case 9: coins=Rewards.Anagrammist[9].coin; xp=Rewards.Anagrammist[9].xp; _gameMode='Insane'; break;

      default: coins=Rewards.Anagrammist[4].coin; xp=Rewards.Anagrammist[4].xp; _gameMode='Easy'; break;
    }

    setReadRouteParameters(true);
    setGameMode(_gameMode);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);
/**/

//                                __\(--)/__    Remains uneffected by previously saved data


useEffect(() => {
  if (!readRouteParameters||!wordSize) return;

  async function preListTheWords() {
    try {
        let chosenWords:string[]=[];
        let wordSizeInWords:string;

        switch(wordSize){
          case 4: wordSizeInWords="four"; seconds=15; break;
          case 5: wordSizeInWords="five"; seconds=20; break;
          case 6: wordSizeInWords="six"; seconds=25; break;
          case 7: wordSizeInWords="seven"; seconds=30; break;
          case 8: wordSizeInWords="eight"; seconds=40; break;
          case 9: wordSizeInWords="nine"; seconds=45; break;
          default: wordSizeInWords="four"; seconds=15; break;
        }

        const randomFileNumber: number = Math.floor(Math.random() * 5) + 1;
        let path='anagrammist-words/'+wordSizeInWords+'-letter-words-'+randomFileNumber+'.txt';
        const contents = await RNFS.readFileAssets(path, 'utf8');
        const targettedWordList=contents.split(',\r\n');


        let indices=[];

        for(let i=0;i<wordListLength;i++) indices.push(i);
        indices=shuffleArrayOfNumbers(indices);

        if (targettedWordList.length >= wordListLength) {
          for(let i=0;i<wordListLength; i++){
              let currentWord = targettedWordList[indices[i]];
              if(!chosenWords.includes(currentWord)) chosenWords.push(currentWord);
            }
        }
        setTheChosenWords(chosenWords);
        setWordsPrepared(true);
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }


  preListTheWords();
}, [readRouteParameters, wordSize]);

  const [theCharacters, setTheCharacters]=useState<string[]>([]);
  const [theUnshuffledCharacters, setUnshuffledTheCharacters]=useState<string[]>([]);
  
  const [pressedIndices, setPressedIndices]=useState<number[]>([]);

  let _currentWord: string;
  const screenWidth = Dimensions.get('window').width;

  const keyButtonScale = useRef<Animated.Value[]>([]);
  const [timerWidth, setTimerWidth]=useState<number>(0);
  const [cutTimerWidthRate, setCutTimerWidthRate]=useState(0);


useEffect(()=>{
  if(!wordsPrepared||theChosenWords.length==0) return;
  console.log(theChosenWords[currentLevel]);
  setTheCurrentWord(theChosenWords[currentLevel]);
  _currentWord=theChosenWords[currentLevel];

  switch(wordSize){
          case 4: seconds=15; break;
          case 5: seconds=20; break;
          case 6: seconds=25; break;
          case 7: seconds=30; break;
          case 8: seconds=40; break;
          case 9: seconds=45; break;
          default: seconds=15; break;
  }

  setSecondsLeft(seconds);
  
  setTimerWidth(screenWidth*0.6);
  setCutTimerWidthRate(parseFloat(((screenWidth*0.6)/seconds).toFixed(0)));
  startTimer();

  let _theCharacters=_currentWord.split('');
  let unShuffledCharacters=[..._theCharacters];
  setUnshuffledTheCharacters(unShuffledCharacters);

  for(let i=0;i<_theCharacters.length; i++)
    keyButtonScale.current.push(new Animated.Value(1));
  
  _theCharacters=shuffleArray(_theCharacters);
  setTheCharacters(_theCharacters);
},
[wordsPrepared, currentLevel, theChosenWords])
/**/


/* *************************************** Coding the Component JSX here ****************************************** */
 
function findTheStringAndCheckIt(){
  if(currentWord=="") return;
  const theWord=theLetters.join('');
  if(theWord==currentWord){
    _pressedIndices=[];
    theLetters=[];
    let _profileData=profileData;
    _profileData.playerXP+=xp;
    _profileData.playerCoins+=coins;
    updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
    setProfileData(_profileData);
    if(currentLevel<wordListLength){
      restartTimer();
      setTimerWidth(screenWidth*0.6);
      setCurrentLevel(currentLevel+1);
      setTimeout(()=>{
      setPressedIndices([]);
      setRoughString([]);
      setColorIndex(Math.floor(Math.random() * bgColors.length));
      },500);
  }
    else{
      setConfettiAnimation(true);
      navigation.navigate('MoreGames');
    }
  }
  else{
    setRoughString([]);
    setPressedIndices([]);
    _pressedIndices=[];
    theLetters=[];
  }

}  

  const [secondsLeft, setSecondsLeft] = useState<number>(0); // Set initial time
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if(secondsLeft==0) return;
    
    let timer: NodeJS.Timeout;

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);

  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const restartTimer = () => {
    setIsRunning(false);
    setSecondsLeft(seconds);
    setIsRunning(true);
  };

useEffect(()=>{
  let _timerWidth=timerWidth;
  _timerWidth=_timerWidth-cutTimerWidthRate;
  setTimerWidth(_timerWidth);
  if(secondsLeft==0&&isRunning) {
    stopTimer();
    setLevelFailureModal(true);
  }


},[secondsLeft])

const returnToHomeBtnScale = new Animated.Value(1);
const replayMatchBtnScale = new Animated.Value(1);
const clearWordBtnScale = new Animated.Value(1);
const addToWordletBucket = new Animated.Value(1);


//                                __\(--)/__    Changes by previously saved data

  if(!profileDataRead||!readRouteParameters||currentWord=="") {
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
<ScrollView style={{ flex: 1}} contentContainerStyle={{flexGrow: 1}}>

      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode+" ["+route.params.wordSize+" Letters]"}
      />

      <ImageBackground
      style={{alignSelf: 'center', marginBottom: 10, aspectRatio: 2.08, alignItems: 'center'}}
      source={modalBackgrounds.blueModalBackgroundImg}
      imageStyle={{resizeMode: 'stretch',  borderRadius: 4, borderWidth: 1}}
      >
        <WordleText style={{paddingVertical: 6, color: '#222222', fontSize: 16}}>{currentLevel} / 100</WordleText>  
      </ImageBackground>

  <View style={styles.timer}>
    <WordleText>{secondsLeft}</WordleText>
  </View>

<View style={[styles.timerBar, {width: timerWidth}]}></View>
<View style={{height: 100}}></View>

<View style={styles.roughStringContainer}>
  {roughString.map((item, index)=>(
    <WordleText key={index} style={[styles.roughStringLetter, {backgroundColor: bgColors[colorIndex]}]}>{item.toUpperCase()}</WordleText>
  ))
  }
</View>

<View style={styles.pressedKeysContainer}>
  {theCharacters.map((item, index) => (
    !pressedIndices.includes(index) ? (
      <Animated.View
        key={index}
        style={{ transform: [{ scale: keyButtonScale.current[index] }] }}
      >
        <Pressable
          style={styles.theButton}
          onPressIn={() => {buttonPressIn(keyButtonScale.current[index]);
            setTimeout(()=>{buttonPressOut(keyButtonScale.current[index])}, 200);
          }}
          onPress={() => {
            setPressedIndices(prev =>
              prev.includes(index) ? prev : [...prev, index]
            );
            if(!_pressedIndices.includes(index)){
              _pressedIndices.push(index);
              theLetters.push(item);
              setRoughString(theLetters);
              if(theLetters.length==wordSize)
                findTheStringAndCheckIt();
            }
          }}
        >
          <WordleText style={styles.theLetter}>
            {item.toUpperCase()}
          </WordleText>
        </Pressable>
      </Animated.View>
    ) : null
  ))}
</View>

<Animated.View style={{alignSelf: 'center', marginVertical: 8, transform: [{scale: clearWordBtnScale}]}}>
<Pressable
onPressIn={()=>buttonPressIn(clearWordBtnScale)}
onPressOut={()=>buttonPressOut(clearWordBtnScale)}
onPress={()=>{
  setPressedIndices([]);
  setRoughString([]);
  _pressedIndices=[];
  theLetters=[];
}}
>
  <ImageBackground
    source={buttons.goldenButton}
    style={{width: 100, aspectRatio: 3, alignItems: 'center', justifyContent: 'center'}}
    imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 0.8}}
  >
    <WordleText style={{color: '#402001'}}>Clear Word</WordleText>
  </ImageBackground>
</Pressable>
</Animated.View>

<Animated.View style={{alignSelf: 'center', marginVertical: 8, transform: [{scale: addToWordletBucket}]}}>
<Pressable
onPressIn={()=>buttonPressIn(addToWordletBucket)}
onPressOut={()=>buttonPressOut(addToWordletBucket)}
onPress={()=>addWordQuicker(currentWord)}
>
  <ImageBackground
    source={buttons.violetButton}
    style={{width: 120, aspectRatio: 2.5, alignItems: 'center', justifyContent: 'center'}}
    imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 0.8}}
  >
    <WordleText style={{textAlign: 'center', lineHeight: 21, paddingVertical: 5, color: '#f0e1f7', fontSize: 15}}>{"Add to\nWordlet Bucket"}</WordleText>
  </ImageBackground>
</Pressable>
</Animated.View>


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

    <Modal
        transparent
        visible={levelFailureModal}
        onRequestClose={() => setLevelFailureModal(false)} // Android back button
      >
        <View style={styles.container}>
          <ImageBackground 
          source={modalBackgrounds.whiteModalBackgroundImg}
          style={styles.backgroundImage}
          imageStyle={{resizeMode: 'stretch'}}
          >
        <View style={styles.modalBackground}>
            <WordleText style={{ marginBottom: 12}}>You could not finish the game, Chief!</WordleText>
            <WordleText style={{ backgroundColor: 'lightpink', padding: 8, borderRadius: 3, color: 'maroon'}}>You could have guessed the word</WordleText>
              <View style={[styles.pressedKeysContainer, {marginTop: 5}]}>
                {theUnshuffledCharacters.map((item, index)=>(
                  <View style={[styles.theButton, {borderWidth: 0.8, backgroundColor: '#dcf5fc'}]} key={index}><WordleText key={index} style={styles.theLetter}>{item.toUpperCase()}</WordleText></View>
                ))
                }
              </View>

              <View style={{flexDirection: 'row', gap: 20}}>
                <Animated.View style={{transform: [{scale: returnToHomeBtnScale}]}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(returnToHomeBtnScale)}
                  onPressOut={()=>buttonPressOut(returnToHomeBtnScale)}
                  onPress={()=>{navigation.navigate("MoreGames")}}
                  >
                   <ImageBackground
                    source={buttons.yellowButton}
                    style={{width: 100, aspectRatio: 3, alignItems: 'center', justifyContent: 'center'}}
                    imageStyle={{resizeMode: 'stretch'}}
                   >
                    <WordleText>Return Home</WordleText>
                    </ImageBackground> 
                  </Pressable>

                </Animated.View>
                <Animated.View style={{transform: [{scale: replayMatchBtnScale}]}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(replayMatchBtnScale)}
                  onPressOut={()=>buttonPressOut(replayMatchBtnScale)}
                  onPress={()=>{
                    setCurrentLevel(0);
                    _pressedIndices=[];
                    theLetters=[];
                    setTimeout(()=>{
                    setPressedIndices([]);
                    setRoughString([]);
                    setColorIndex(Math.floor(Math.random() * bgColors.length));
                    setLevelFailureModal(false);
                    setSecondsLeft(seconds);
                    restartTimer();
                    },500);
                  }}
                  >
                   <ImageBackground
                    source={buttons.blueButton}
                    style={{width: 100, aspectRatio: 3, alignItems: 'center', justifyContent: 'center'}}
                    imageStyle={{resizeMode: 'stretch'}}
                   >
                    <WordleText>Play Again</WordleText>
                    </ImageBackground> 
                  </Pressable>
                </Animated.View>
              </View>
        </View>
          </ImageBackground>
        </View>
    </Modal>

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


function shuffleArray(arr: string[]): string[] {
  const original = [...arr];
  let shuffled = [...arr];

  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.join('') === original.join(''));

  return shuffled;
}


function shuffleArrayOfNumbers(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


