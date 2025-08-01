/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect, useRef} from 'react';
import {View, ImageBackground, Animated, Pressable,ScrollView} from 'react-native';
import {styles} from '../../source/styles/satietas-match-styles';
import { buttons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import { WicWacWoeKeyboard } from '../alphabet-keyboard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Satietas-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';

import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import { startShake } from '../../source/styles/ingame-styles';

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  
  const App = () => {
  
  const [currentIndex, setCurrentIndex]=useState(1);
  const [gameContent, setGameContent]=useState<string[]>([]);
  
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [theGapsForGame, setTheGapsForGame]=useState<number[]>([]);
  


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
    
    const _gameName='Satietas';

    const [size, setSize]=useState({width: 0, height: 0});
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [error, setError]=useState("");
    const [gapsAtCharacters, setGapsAtCharacters]=useState<string[]>([]);

    const scale=useRef(new Animated.Value(1));
    const clearAllBtnScale=useRef(new Animated.Value(1));

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Satietas files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Satietas Size");
    
      coins=Rewards.Satietas.coins;
      xp=Rewards.Satietas.xp;
      
      let aRandomNumber=20+Math.floor(Math.random()*40);
      let anotherRandomNumber=30+Math.floor(Math.random()*80);
      let secondRandomNumber=30+Math.floor(Math.random()*60);
      let thirdRandomNumber=100+50+80-aRandomNumber-anotherRandomNumber-secondRandomNumber;
      
      const _4letterWords=await RNFS.readFileAssets('letter-based-words/four-letter-words.txt');
      const _5letterWords=await RNFS.readFileAssets('letter-based-words/five-letter-words.txt');
      const _6letterWords=await RNFS.readFileAssets('letter-based-words/six-letter-words.txt');
      const _7letterWords=await RNFS.readFileAssets('letter-based-words/seven-letter-words.txt');


      let _4letterWordsArr=shuffleArray(_4letterWords.split(/,\s*\r?\n/));
      let _5letterWordsArr=shuffleArray(_5letterWords.split(/,\s*\r?\n/));
      let _6letterWordsArr=shuffleArray(_6letterWords.split(/,\s*\r?\n/));
      let _7letterWordsArr=shuffleArray(_7letterWords.split(/,\s*\r?\n/));

      
      let totalWords:string[]=[];

            for(let i=0;i<aRandomNumber; i++)
        totalWords.push(_4letterWordsArr[i]);

            for(let i=0;i<anotherRandomNumber; i++)
        totalWords.push(_5letterWordsArr[i]);

            for(let i=0;i<secondRandomNumber; i++)
        totalWords.push(_6letterWordsArr[i]);

            for(let i=0;i<thirdRandomNumber; i++)
        totalWords.push(_7letterWordsArr[i]);

        totalWords=shuffleArray(totalWords);  
        setGameContent(totalWords);

      setReadRouteParameters(true);
};

  loadConfiguration();
}, [profileDataRead]);


useEffect(() => { if (error!="") {startShake(shakeAnim);}}, [error]);

//                                __\(--)/__    Remains uneffected by previously saved data

function shuffleArray(array: string[]): string[] {
    const arr = [...new Set(array)];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

useEffect(()=>{

    const currentWord=gameContent[currentIndex];
    if(!currentWord) return;
    let theGaps: number[]=[];

    while(theGaps.length<Math.floor(currentWord.length/2)){
        let aRandomNum=Math.floor(Math.random()*currentWord.length);
        if(!theGaps.includes(aRandomNum))theGaps.push(aRandomNum);
    }
    theGaps=theGaps.sort((a, b) => a - b);
    
    setTheGapsForGame(theGaps);
    setGapsAtCharacters(Array(currentWord.length).fill(""));
}, [currentIndex, gameContent])


/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist


function submit(){
    const gapLetters: string[]=Array(gameContent[currentIndex].length).fill("");
    console.log(6);
    for(let i=0; i<gapsAtCharacters.length; i++){
      if(gapsAtCharacters[theGapsForGame[i]]==''){
        setError("Wrong word. Try again");
        setTimeout(()=>setError(""), 1000);
        return;}
    }

    for(let i=0; i<gameContent[currentIndex].length; i++){
        if(!theGapsForGame.includes(i)) gapLetters[i]=gameContent[currentIndex][i];
        else gapLetters[i]=gapsAtCharacters[i];
    }

    const roughString=gapLetters.join('').toLowerCase();
    
    if(roughString==gameContent[currentIndex]){
        const _profileData=profileData;
        _profileData.playerCoins+=coins;
        _profileData.playerXP+=xp;
        setProfileData(_profileData);
        updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);   
    }
    else {
        setError("Wrong word. Try again");
        setTimeout(()=>setError(""), 1000);
    }
}

function keypressed(key: string){
    const _gapsAtCharacters=[...gapsAtCharacters];
    
    if(key!='0'){
    if(_gapsAtCharacters.indexOf('')==-1) return;
    let roughString=_gapsAtCharacters.join('');
    roughString+=key;
    
    let j=0; 
    for(let i=0; i<gameContent[currentIndex].length; i++){
        if(theGapsForGame.includes(i)){
            _gapsAtCharacters[i]=roughString[j] || '';
            j++;
        }
        else _gapsAtCharacters[i]='';
    }
    setGapsAtCharacters(_gapsAtCharacters);
}

else{     
    if(_gapsAtCharacters.join('').length==0) return;
    let roughString=_gapsAtCharacters.join('');
    roughString=roughString.slice(0,-1);
        
    let j=0; 
    for(let i=0; i<gameContent[currentIndex].length; i++){
        if(theGapsForGame.includes(i)){
            _gapsAtCharacters[i]=roughString[j] || '';
            j++;
        }
        else _gapsAtCharacters[i]='';
    }
    setGapsAtCharacters(_gapsAtCharacters);
}
}

  if(!profileDataRead||!readRouteParameters||!gameContent) {
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
      gameMode={"Level "+currentIndex}
      />

<View style={{height: 100}}/>
      <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
{
    gameContent[currentIndex].split('').map((item, index)=>(
        <WordleText key={index} style={styles.lettersInTheWord}>
            {!theGapsForGame.includes(index)?item.toUpperCase():gapsAtCharacters[index]}</WordleText>
    ))
}
    </View>
<View style={{height: 100}}/>
<WicWacWoeKeyboard onKeyPress={keypressed}/>

<View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
  <Animated.View style={{transform: [{scale: scale.current}]}}>
  <Pressable
  onPressIn={()=>buttonPressIn(scale.current)}
  onPressOut={()=>buttonPressOut(scale.current)}
  onPress={submit}
  >
    <ImageBackground
    source={buttons.goldenButton}
    style={{width: 90, aspectRatio: 2.4, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 10}}
    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
    >
      <WordleText>Submit</WordleText>
    </ImageBackground>
  </Pressable>
  </Animated.View>

  <Animated.View style={{transform: [{scale: clearAllBtnScale.current}]}}>
  <Pressable
      onPressIn={()=>buttonPressIn(clearAllBtnScale.current)}
      onPressOut={()=>buttonPressOut(clearAllBtnScale.current)}
      onPress={()=>{
        setGapsAtCharacters(Array(gameContent[currentIndex].length).fill(""));;  
      }}
  >
    <ImageBackground
    source={buttons.redButton}
    style={{width: 90, aspectRatio: 2.4, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 10}}
    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
    >
      <WordleText style={{color: 'white'}}>Clear All</WordleText>
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

    <Animated.View 
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSize({ width, height });
          }}
        style={[{ transform: [{ translateX: shakeAnim}] }, styles.errorTextContainer]}>
    <View style={[styles.error,
        error == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><WordleText style={[styles.errorText]}>{error}</WordleText>
      </View>
    </Animated.View>

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