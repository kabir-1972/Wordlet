/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import {View, ImageBackground, Animated, Image, StyleSheet, Dimensions, Modal, UIManager, findNodeHandle, ScrollView, Pressable, TextInput, Keyboard } from 'react-native';
import {styles} from '../../source/styles/wordchains-match-styles';
import { buttons, icons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './WordChains-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import { Rewards as RewardsComponent } from '../../source/styles/wordle-modals-styles';
import { addWordQuicker } from '../Wordlet-Bucket';
import { DictionaryModal } from '../Components-For-End-Match';
import { startShake } from '../../source/styles/ingame-styles';

type WordChainsMatchRouteProp = RouteProp<RootStackParamList, 'WordChainsMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  
  const allwords: {[key: number]: string[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
    24: [],
    25: [],
    26: []
  };
  
  let numberOfWords = 0;


  const App = () => {
  const route = useRoute<WordChainsMatchRouteProp>();

  /*
  const route={
    params:{
      type: 1
    }
  }
  */
  const  navigation = useNavigation<NavigationProp>();
  const [usedWords, setUsedWords]=useState<string[]>([]);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
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
    const [roughString, setRoughString]=useState("");
    
    const [gameEndModalVisibility, setGameEndModalVisibility]=useState(false);
    const [allWordsSet, setAllWordsSet]=useState(false);

  const gameName='WordChains';
  
  const [gameMode, setGameMode]=useState("");
  const [currentTarget, setCurrentTarget]=useState<number|undefined>();
  const [targetWord, setTargetWord]=useState("");

  const [livesForPlayer1, setLivesForPlayer1]=useState(3);
  const [livesForPlayer2, setLivesForPlayer2]=useState(3);

  const scrollRef = useRef<ScrollView>(null);
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ y: 999999, animated: true });
  };
  const [dictionaryModalVisibiltiy,setDictionaryModalVisibiltiy]=useState(false);
  const [resultString, setResultString]=useState("");
  const [resultSetter, setResultSetter]=useState<number|undefined>();
  const [targetForWin, setTargetForWin]=useState<number|undefined>();

  const [size, setSize] =useState({width: 0, height: 0});

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
  if(route.params.type==3||route.params.type==4) return;
  if(!profileDataRead) return;
  const loadConfiguration = async () => {    
  setGameLoadingAnimationPrompt("Setting the WordChains Size");
};

  loadConfiguration();
}, [route.params, profileDataRead]);
/**/

//                                __\(--)/__    Remains uneffected by previously saved data

useEffect(()=>{
  console.log(route.params.type);
  switch(route.params.type){
    case 1: setGameMode("Offline Computer"); xp=Rewards.WordChains[1].xp; coins=Rewards.WordChains[1].coins; break;
    case 2: setGameMode("Offline Two Players"); xp=Rewards.WordChains[2].xp; coins=Rewards.WordChains[2].coins; break;
    case 3: case 4: setGameMode("Multiplayer");xp=Rewards.WordChains[3].xp; coins=Rewards.WordChains[3].coins; break;
    default: setGameMode("Offline Computer");xp=Rewards.WordChains[1].xp; coins=Rewards.WordChains[1].coins; break;
  }

  setReadRouteParameters(true);
}, [route /* */])


useEffect(() => {
  if (!readRouteParameters) return;

  async function preListAllTheWordsFromTheDictionary() {
  setGameLoadingAnimationPrompt("Collecting Words from the Dictionary");
    for(let i=97; i<=122; i++){
      if(allwords[i-96].length!=0) continue;
      let theAlphabet=String.fromCharCode(i);
      const theWords=RNFS.readFileAssets("dictionary/"+theAlphabet+"-words.txt");
      const theWordsArr=(await theWords).split(', ');
      allwords[i-96]=theWordsArr as string[];
    }
    if(allwords[26].length!=0)
      setAllWordsSet(true);
  }


  preListAllTheWordsFromTheDictionary();
}, [readRouteParameters]);

useEffect(()=>{
    const _resultSetter=(Math.floor(Math.random()*4));
    let _resultSetString="";
    setResultSetter(_resultSetter);

    if(route.params.type==1){
    switch(_resultSetter){
      case 0: _resultSetString = "Player 1 must create 250 words to win before losing all the lives."; setTargetForWin(250); setCurrentTarget(0); break;
      case 1: _resultSetString = "Player 1 must create words of 400 letters to win before losing all the lives."; setTargetForWin(400); setCurrentTarget(0);  break;
      case 2: _resultSetString = "Player 1 must create words that in total has 500 more letters than Computer"; setTargetForWin(500); setCurrentTarget(0);  break;
      case 3: _resultSetString = "Player 1 must create words that in total has 500 less letters than Computer"; setTargetForWin(500); setCurrentTarget(0);  break;
      default: _resultSetString = "Player 1 must create 250 words to win before losing all the lives."; break;
    }}
    else if(route.params.type==2) _resultSetString = "The First Player to lose all three lives loses the game.";
    setResultString(_resultSetString);

}, [])

useEffect(()=>{
  if(roughString.length==0) return;
  function findTheStringAndCheckIt(){
    
    if(usedWords.includes(roughString)){
      setWordNotFoundErrorStatement("The word has already been used once.");
      if(roughString.length%2==0){
      const _lives=livesForPlayer1;
      setLivesForPlayer1(livesForPlayer1-1);
      if(_lives==1) setGameEndModalVisibility(true);
      }
      else {
        if(route.params.type==2){
      const _lives=livesForPlayer2;
      setLivesForPlayer2(livesForPlayer2-1);
      if(_lives==1) setGameEndModalVisibility(true);
      }
      }
      setTimeout(()=>setWordNotFoundErrorStatement(""), 1000);
      return;
    }
    /**/
    const theFirstChar=roughString[0].toLowerCase();
    if(usedWords.length>1){
    const theLastWord=usedWords[usedWords.length-1];
    const lastCharOfTheLastWord=theLastWord[theLastWord.length-1];
    if(theFirstChar.toLowerCase()!=lastCharOfTheLastWord.toLowerCase()){
      setWordNotFoundErrorStatement("You just broke the chain");
      const _lives=livesForPlayer1;
      setLivesForPlayer1(livesForPlayer1-1);
      if(_lives==1) {setGameEndModalVisibility(true);}
      setTimeout(()=>setWordNotFoundErrorStatement(""), 1000);
      return;
    }  
  }

    if(route.params.type==2) return;
    const alphabeticalIndex=theFirstChar.charCodeAt(0);
    const listOfWordsConcerned:string[]=allwords[alphabeticalIndex-96];
    const _roughString=roughString.toLowerCase();
    const _usedWords=[...usedWords];
    if(listOfWordsConcerned.indexOf(_roughString)!=-1){
      setUsedWords(prev => [...prev, roughString]);
      _usedWords.push(roughString);
      const theLastChar=roughString[roughString.length-1].toLowerCase();
      const _alphabeticalIndex=theLastChar.charCodeAt(0);
      const _listOfWordsConcernedFurther:string[]=allwords[_alphabeticalIndex-96];
      let aRandomWord=_listOfWordsConcernedFurther[Math.floor(Math.random()*_listOfWordsConcernedFurther.length)];
      let count=0;
      while(usedWords.includes(aRandomWord)){
        aRandomWord=_listOfWordsConcernedFurther[Math.floor(Math.random()*_listOfWordsConcernedFurther.length)];
        count++;
        if(count==15000) break;
      }
      if(count==15000){
        setWordNotFoundErrorStatement("There are simply no more words left. Checkmate!!!");
        setConfettiAnimation(true);
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
        setProfileData(_profileData);
        setTimeout(()=>navigation.navigate("MoreGames"), 2500); 
      }
      else {
        setUsedWords(prev => [...prev, aRandomWord]);
        _usedWords.push(aRandomWord);

        const player1strings = _usedWords.filter((_, index) => index % 2 == 0);
        const player2strings = _usedWords.filter((_, index) => index % 2 != 0);

        const player1lettersNumber=player1strings.join('').length;
        const player2lettersNumber=player2strings.join('').length;

        console.log(player1strings, player2strings, _usedWords, aRandomWord, roughString);
        scrollToBottom();
        numberOfWords++;
        switch(resultSetter){
          case 0: setCurrentTarget(numberOfWords); break;
          case 1: setCurrentTarget(player1lettersNumber); break;
          case 2: setCurrentTarget(player1lettersNumber-player2lettersNumber); break;
          case 3: setCurrentTarget(player2lettersNumber-player1lettersNumber); break;
          default: setCurrentTarget(numberOfWords); break;
        }

        if(resultSetter==0&&numberOfWords==249){
          setConfettiAnimation(true);
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
        setProfileData(_profileData);
          setTimeout(()=>navigation.navigate("MoreGames"), 2500);
        }
        if(resultSetter==1&&player1lettersNumber>=400){
          setConfettiAnimation(true);
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
        setProfileData(_profileData);
          setTimeout(()=>navigation.navigate("MoreGames"), 2500);
        }

        if(resultSetter==2&&player1lettersNumber-player2lettersNumber>=500){
          setConfettiAnimation(true);
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
        setProfileData(_profileData);
          setTimeout(()=>navigation.navigate("MoreGames"), 2500);
        }
        
        if(resultSetter==3&&player2lettersNumber-player1lettersNumber>=500){
          setConfettiAnimation(true);
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
        setProfileData(_profileData);
          setTimeout(()=>navigation.navigate("MoreGames"), 2500);
        }
      }
    }
    else {
      setWordNotFoundErrorStatement("Not a Valid Word.");
      setTimeout(()=>setWordNotFoundErrorStatement(""), 1000);
    }
  }

  findTheStringAndCheckIt();
},
[roughString])
/**/


/* *************************************** Coding the Component JSX here ****************************************** */
 
  

const shakeAnim = useRef(new Animated.Value(0)).current;
const returnToHomeBtnScale = new Animated.Value(1);
const replayMatchBtnScale = new Animated.Value(1);
const addWordToBucket = useRef(new Animated.Value(1)).current;
const cancelWordBucket = useRef(new Animated.Value(1)).current;
const [wordNotFoundError, setWordNotFoundErrorStatement] =React.useState("");

  useEffect(() => {
  if (wordNotFoundError) {startShake(shakeAnim);}
  }, [wordNotFoundError]);
//                                __\(--)/__    Changes by previously saved data

  if(!profileDataRead||!readRouteParameters||!allWordsSet) {
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

      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode}
      />

      {route.params.type==1&&<ImageBackground
      style={{alignSelf: 'center', marginBottom: 10, aspectRatio: 1.5, alignItems: 'center'}}
      source={modalBackgrounds.blueModalBackgroundImg}
      imageStyle={{resizeMode: 'stretch',  borderRadius: 4, borderWidth: 1}}
      >
        <WordleText style={{paddingVertical: 6, color: '#222222', fontSize: 16}}>{currentTarget}</WordleText>
        <View style={[StyleSheet.absoluteFill, { width: ((currentTarget&&targetForWin)&&(currentTarget/targetForWin)>=0?(currentTarget/targetForWin): 0), backgroundColor: '#11111180'}]} />
      </ImageBackground>}setOfCharacters[i] = [];
    <View style={{backgroundColor: '#faf0ff', borderRadius: 4, borderWidth: 0.6, width: 250, alignSelf: 'center'}}>
        <WordleText style={{lineHeight: 20, fontSize: 16, textAlign: 'center', paddingVertical: 4}}>{resultString}</WordleText>
    </View>

  <View style={{flexDirection: 'row', marginVertical: 5}}>
      {
        route.params.type==2&&<View style={{flexDirection: 'row', gap: 1, marginLeft: 20}}>
        {
          Array.from({length:livesForPlayer2}).map((_, i)=>(
            <Image key={i} source={icons.heart} style={{width: 25, height: 25}}></Image>
          ))
        }
      </View>
      }
      <View style={{flex: 1}}></View>    
      <View style={{flexDirection: 'row', gap: 1, marginRight: 20}}>
        {
          Array.from({length:livesForPlayer1}).map((_, i)=>(
            <Image key={i} source={icons.heart} style={{width: 25, height: 25}}></Image>
          ))
        }
      </View>
    </View>
<ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow: 1}} ref={scrollRef}>
{
  usedWords.map((item, index)=>(
    <View key={index} style={[{marginVertical: 5, borderWidth: 0.8, borderRadius: 4}, index%2==0?{ alignSelf: 'flex-end', marginRight: 20, backgroundColor: '#d9faf9'}:{ alignSelf: 'flex-start', marginLeft: 20, backgroundColor: '#a5e6b6'}]}>
    <Pressable 
    onPress={()=>{
      console.log(item);
      setTargetWord(item);
      setTimeout(()=>{
        setDictionaryModalVisibiltiy(true);
      }, 500)
    
    }}
    style={styles.wordsAsMessages}
    ><WordleText>{item.toLowerCase()}</WordleText>
    </Pressable>
    </View>
  )

  )
}
</ScrollView>

      <Animated.View 
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
      }}
      style={[{ transform: [{ translateX: Animated.add(shakeAnim, new Animated.Value(-size.width/2))}, {translateY: -size.height/2 }] }, styles.errorTextContainer]}>
      <View style={[styles.error,
        wordNotFoundError == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><WordleText style={[styles.errorText]}>{wordNotFoundError}</WordleText>
      </View>
      </Animated.View>
      <GameInput send={setRoughString}/>
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
        visible={gameEndModalVisibility}
        onRequestClose={() => setGameEndModalVisibility(false)}
      >
        <View style={styles.container}>
          <ImageBackground 
          source={modalBackgrounds.whiteModalBackgroundImg}
          style={styles.backgroundImage}
          imageStyle={{resizeMode: 'stretch'}}
          >
        <View style={styles.modalBackground}>
            <WordleText>You could not finish the game, Chief!</WordleText>
            <Image
            source={require("../../source/images/broken-chain.png")}
            style={{width: 150, height: 150, alignSelf: 'center', marginVertical: 10}}
            ></Image>

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
                  onPress={()=>{navigation.replace("WordChainsMatch", {type: route.params.type})   
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

        <DictionaryModal
              showDictionaryModal={dictionaryModalVisibiltiy}
              setShowDictionaryModal={setDictionaryModalVisibiltiy}
              targetWord={targetWord}
              cancelWordBucket={cancelWordBucket}
              addWordToBucket={addWordToBucket}
        />

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

type GameInputProps={
  send:React.Dispatch<React.SetStateAction<string>>;
}

const GameInput = (props:GameInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');

  const [keyboardStatus, setKeyboardStatus] = useState("none");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardStatus("display")
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardStatus("none")
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const checkKeyboards = () => {
    if (keyboardStatus === "none") {
      inputRef.current?.blur(); // optional — but not strictly needed
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
    
  const [showCaret, setShowCaret] = useState(true);
  const submitBtnScale=new Animated.Value(1);

  useEffect(() => {
  const interval = setInterval(() => {
    setShowCaret(prev => !prev);
  }, 500);

  return () => clearInterval(interval);
  }, []);


  return (
    <View style={styles.gameInputContainer}>
      <View style={{flex: 1}}></View>
    <Pressable
      style={styles.fakeInput}
      onPress={() => {inputRef.current?.focus(); checkKeyboards();}}
    >
      <View style={styles.fakeInputBox}>
      <WordleText style={styles.text}>
        {text}
      </WordleText>
      {showCaret && (
      <View style={styles.caret}></View>
      )}</View>
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        style={styles.hiddenInput}
        autoFocus={false}
        autoCapitalize='none'
      />
    </Pressable>

    <Animated.View style={{transform: [{scale: submitBtnScale}]}}> 
    <Pressable
    onPressIn={()=>buttonPressIn(submitBtnScale)}
    onPressOut={()=>buttonPressOut(submitBtnScale)}
    onPress={()=>{props.send(text); setText("");}}
    >
      <Image
      source={buttons.whiteSendButton}
      style={{width: 34, height: 34}}
      >
      </Image>
    </Pressable>
    </Animated.View> 
    </View>
  );
};

