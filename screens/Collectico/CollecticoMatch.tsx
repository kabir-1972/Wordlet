/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect, useRef} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Image, Animated, Pressable,ScrollView } from 'react-native';
import {styles} from '../../source/styles/collectico-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Collectico-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';

import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor
} from 'react-native-reanimated';
import { startShake } from '../../source/styles/ingame-styles';
import { getTheNumberOfLevelsCleared, updateTheNumberOfLevelsCleared } from './Collectico-Data-Files';


type CollecticoMatchRouteProp = RouteProp<RootStackParamList, 'CollecticoMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  
  const App = () => {
  
  const [level, setLevel]=useState<number|undefined>(1);

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
    
    const _gameName='Collectico';

    const scale= useRef(new Animated.Value(1));
    const clearAllBtnScale = useRef (new Animated.Value(1));

    const [titularWords, setTitularWords]=useState<string[]>();
    const [wordsToStyle, setWordsToStyle]=useState<string[]>();

    const [selectedTitularWord, setSelectedTitularWord]=useState("");
    const [selectedWords, setSelectedWords]=useState<string[]>([]);

    const [titularWordAnswer, setTitularWordAnswer]=useState("");
    const [wordsToStyleAnswer, setWordsToStyleAnswer]=useState<string[]>([]);
    const [size, setSize]=useState({width: 0, height: 0});
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [error, setError]=useState("");

    const [gameMode, setGameMode]=useState("");


/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Collectico files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Collectico Size");
    
      coins=Rewards.Collectico.coins;
      xp=Rewards.Collectico.xp;
      const level=await getTheNumberOfLevelsCleared();
      setLevel(level);
      setGameMode("Level "+level);
      setReadRouteParameters(true);
};

  loadConfiguration();
}, [profileDataRead]);


useEffect(() => { if (error!="") {startShake(shakeAnim);}}, [error]);

//                                __\(--)/__    Remains uneffected by previously saved data


useEffect(() => {
  if(!readRouteParameters) return;

  async function readTheGameFile() {
    
    if(!level) return;

    try {
      const fileData=await RNFS.readFileAssets(`collectico.json`);
      const fileDataJSON=JSON.parse(fileData);
        
      const numbersToPick: number[]=[level];
      
      const _titularWords=[fileDataJSON[1].word];
      setTitularWordAnswer(_titularWords[0]);
      const _wordsToStyleFor:string[]=[];

      for(let i=0;i<4; i++){
        
        let aRandomNumber=1+Math.floor(Math.random()*190);
        while(numbersToPick.includes(aRandomNumber))
            aRandomNumber=1+Math.floor(Math.random()*190);
        numbersToPick.push(aRandomNumber);
        _titularWords.push(fileDataJSON[aRandomNumber].word);
      }

      const synonymOrAntonym=Math.floor(Math.random()*2);
      
      if(synonymOrAntonym==0){
        for(let i=0; i<numbersToPick.length; i++){
            if(i==0){
            _wordsToStyleFor.push(...fileDataJSON[numbersToPick[i]].synonyms);
            setWordsToStyle(fileDataJSON[numbersToPick[i]].synonyms);
          }
            else{
                const wordsOfChoice=fileDataJSON[numbersToPick[i]].synonyms;
                const pairOfRandomNumbers:number[]=[];

                for(let i=0;i<2;i++){
                  let aRando=Math.floor(Math.random()*wordsOfChoice.length);
                while(pairOfRandomNumbers.includes(aRando))
                  aRando=Math.floor(Math.random()*wordsOfChoice.length);
                  pairOfRandomNumbers.push(aRando);
                }

               _wordsToStyleFor.push(wordsOfChoice[pairOfRandomNumbers[0], pairOfRandomNumbers[1]]);
            }
        }
      }
      else{
        for(let i=0; i<numbersToPick.length; i++){
            if(i==0){
            _wordsToStyleFor.push(...fileDataJSON[numbersToPick[i]].antonyms);
            setWordsToStyle(fileDataJSON[numbersToPick[i]].antonyms);
          }
            else{
                const wordsOfChoice=fileDataJSON[numbersToPick[i]].antonyms;
                const pairOfRandomNumbers:number[]=[];

                for(let i=0;i<2;i++){
                  let aRando=Math.floor(Math.random()*wordsOfChoice.length);
                while(pairOfRandomNumbers.includes(aRando))
                  aRando=Math.floor(Math.random()*wordsOfChoice.length);
                  pairOfRandomNumbers.push(aRando);
                }

                _wordsToStyleFor.push(wordsOfChoice[pairOfRandomNumbers[0], pairOfRandomNumbers[1]]);
            }
        }
      }
      
      setTitularWords(shuffleArray(_titularWords));
      setWordsToStyle(shuffleArray(_wordsToStyleFor));
      setReadGameFile(true);

    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  readTheGameFile();
}
, [readRouteParameters, level]);

function shuffleArray(array: string[]): string[] {
    const arr = [...new Set(array)];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist


function submit(){
  if(selectedTitularWord!=titularWordAnswer){
    setError("Titular Word is Wrong");
    setTimeout(()=>setError(""), 1000);
  }

  if(wordsToStyleAnswer.length!=selectedWords.length){
    setError("Not all words are selected");
    setTimeout(()=>setError(""), 1000);
  }

  const selectionIsOkay = wordsToStyleAnswer.every(item => selectedWords.includes(item)) && selectedWords.every(item => wordsToStyleAnswer.includes(item));
  if(selectionIsOkay){
    setConfettiAnimation(true);
    const _profileData=profileData;
    _profileData.playerCoins+=coins;
    _profileData.playerXP+=xp;
    setProfileData(_profileData);
    updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
    if(level) updateTheNumberOfLevelsCleared(level);
    setTimeout(()=>navigation.navigate("CollecticoMatch"), 2500);
  }
  else{
    setError("Not all words are selected. Only select the answers");
    setTimeout(()=>setError(""), 1000);
  }
}
/**/
 const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(2, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

const colors = ['#c4ffe9', '#c4fcff', '#ebffc4', '#ffc4f2', '#ffddc4'];
const loopColors = [...colors, ...colors.slice(1, -1).reverse()];

  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      loopColors
    );
    return { color };
  });


  if(!profileDataRead||!readRouteParameters||!readTheGameFile) {
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
      gameMode={gameMode}
      />
      

      <View style={styles.titularWordsBox}>
      {
        titularWords?.map((item, index)=>(
          <Pressable style={[styles.titleWords, 
            {transform:[{scale: item==selectedTitularWord?0.9: 1}]}]}
          onPress={()=>setSelectedTitularWord(item)} key={index}
          ><View><WordleText style={{fontSize: 18}}>{item}</WordleText></View>
          {item==selectedTitularWord&&<View style={styles.disabledButton}/>}
          </Pressable>
        ))
      }  
      </View>

<View style={{width: '60%', alignSelf: 'center', flexDirection: 'row', gap: 3, marginVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
  <View style={{paddingHorizontal: 10, paddingVertical: 4}}>
    <Reanimated.Text style={[{fontFamily: 'Wordlet-Regular', fontSize: 18}, animatedStyle]}>{selectedTitularWord}</Reanimated.Text>
  </View>
  {selectedWords.length>0&&<View style={styles.choiceSecondColumn}>{
    selectedWords.map((item, index)=>(
      <View key={index} style={{borderBottomWidth: 1, borderStyle: 'dashed'}}><WordleText>{item}</WordleText></View>
    ))
    }
  </View>}
</View>
      <View style={styles.allWordsBox}>
      {
        wordsToStyle?.map((item, index)=>(
          <Pressable style={[styles.styleWords, 
            {transform:[{scale: selectedWords.includes(item)?0.9: 1}]}]}
          onPress={()=>setSelectedWords(prev=>[...prev, item])} key={index} 
          ><View><WordleText style={{fontSize: 18}}>{item}</WordleText></View>
          {selectedWords.includes(item)&&<View style={styles.disabledButton}/>}
          </Pressable>
        ))
      }        
      </View>
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
        setSelectedTitularWord("");
        setSelectedWords([]);
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
        style={[{ transform: [{ translateX: Animated.add(shakeAnim, new Animated.Value(-size.width/2))}] }, styles.errorTextContainer]}>
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