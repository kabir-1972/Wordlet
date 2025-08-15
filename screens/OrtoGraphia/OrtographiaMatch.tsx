/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect, useRef} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Animated, Pressable,ScrollView, Modal } from 'react-native';
import {styles} from '../../source/styles/ortographia-match-styles';
import { buttons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Ortographia-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';

import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { startShake } from '../../source/styles/ingame-styles';
import { getTheGameData, resetTheGameData, updateTheNumberOfLevelsCleared } from './Ortographia-Data-Files';

type GameInfoData = {
  [key: string]: {
    word: string;
    misspell: string[];
  };
};



type OrtographiaMatchRouteProp = RouteProp<RootStackParamList, 'OrtographiaMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  
  const App = () => {
  
  const [currentIndex, setCurrentIndex]=useState<number>(0);
  const [theGameArray, setTheGameArray]=useState([]);
  const [gameContent, setGameContent]=useState<GameInfoData>();

  /*const route={
    params: {
        type: 2
    }
  }
  */
  
  const route=useRoute<OrtographiaMatchRouteProp>();

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
    
    const _gameName='Ortographia';

    const returnToHomeBtnScale= useRef(new Animated.Value(1));
    const replayMatchBtnScale = useRef (new Animated.Value(1));

    const [size, setSize]=useState({width: 0, height: 0});
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [error, setError]=useState("");

    const [completedGameModal, setCompletedGameModal]=useState(false);

    const [options, setOptions]=useState<string[]>([]);
    const [pairOfOptions, setPairOfOptions]=useState<string[][]>([]);
    const [theAnswerInThePair, setTheAnswerInThePair]=useState(0);


/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Ortographia files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Ortographia Size");
    
      coins=Rewards.Ortographia.coins;
      xp=Rewards.Ortographia.xp;
      
      const theWholeSavedGameData=await getTheGameData();

      setCurrentIndex(theWholeSavedGameData.lastLevelCleared);
      setTheGameArray(theWholeSavedGameData.array);

      setReadRouteParameters(true);
};

  loadConfiguration();
}, [profileDataRead]);


useEffect(() => { if (error!="") {startShake(shakeAnim);}}, [error]);

//                                __\(--)/__    Remains uneffected by previously saved data


useEffect(() => {
  if(!readRouteParameters) return;
  
  async function readTheGameFile() {  
    const fileContent=await RNFS.readFileAssets('ortographia.json');
    const JSONContent=JSON.parse(fileContent);
    
    setGameContent(JSONContent);
    setTimeout(()=>setReadGameFile(true), 2000);
  }

  readTheGameFile();
}
, [readRouteParameters]);

useEffect(()=>{

  if(!readTheGameFile||!gameContent) return;

  async function workWithTheGameData(){
    if(!gameContent) return;
    if(route.params.type==1){
    let _options=gameContent[theGameArray[currentIndex]].misspell;
    _options.push(gameContent[theGameArray[currentIndex]].word);
    _options=shuffleArray(_options);
    setOptions(_options);
   }
    
    else{

      let totalIndices=[currentIndex];
      while(totalIndices.length<8){
        let aRandomNum=Math.floor(Math.random()*70);
      while(totalIndices.includes(aRandomNum))
          aRandomNum=Math.floor(Math.random()*70);
      totalIndices.push(aRandomNum);
      }
      
      totalIndices=shuffleArrayOfNumbers(totalIndices);
      const theRandomNum=Math.floor(Math.random()*(totalIndices.length/2-1));
      setTheAnswerInThePair(theRandomNum);
      
const thePairOfOptions: [string, string][] = [];

const usedPairs = new Set<string>();

while (thePairOfOptions.length < 4) {

  const i = Math.floor(Math.random() * (totalIndices.length - 1));
  const key = `${i}_${i + 1}`;

  if (i + 1 >= totalIndices.length || usedPairs.has(key)) continue;
  usedPairs.add(key);

  let _pairOfOptions: [string, string];

  if (thePairOfOptions.length === theRandomNum) {
    const word1 = gameContent[theGameArray[totalIndices[i]]].word;
    const word2 = gameContent[theGameArray[totalIndices[i + 1]]].word;
    _pairOfOptions = [word1, word2];
  } else {
    const mis1List = gameContent[theGameArray[totalIndices[i]]].misspell;
    const mis2List = gameContent[theGameArray[totalIndices[i + 1]]].misspell;

    const mis1 = mis1List[Math.floor(Math.random() * mis1List.length)];
    const mis2 = mis2List[Math.floor(Math.random() * mis2List.length)];

    _pairOfOptions = [mis1, mis2];
  }

  thePairOfOptions.push(_pairOfOptions);
}
    setPairOfOptions(thePairOfOptions);
    }
  }

  workWithTheGameData();
}, [readTheGameFile, currentIndex, /*gameContent, theGameArray*/])

function shuffleArrayOfNumbers(array: number[]): number[] {
    const arr = [...new Set(array)];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;

}

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


function submit(input:string){
  if(!gameContent) return;

  if(input==gameContent[theGameArray[currentIndex]].word){
    if(currentIndex<70){
      const _profileData=profileData;
      _profileData.playerXP+=xp;
      _profileData.playerCoins+=coins;
      setProfileData(profileData);
      updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
      updateTheNumberOfLevelsCleared(currentIndex);
      setTimeout(()=>setCurrentIndex(currentIndex+1), 500);
    }
    else {
      resetTheGameData();
      setCompletedGameModal(true);
    }
  }
  else {
    setError("Answer is Wrong");
    setTimeout(()=>setError(""), 1000);
  }   
}

function submitPair(input: number){
  
  if(input==theAnswerInThePair){
    if(currentIndex<70){
      const _profileData=profileData;
      _profileData.playerXP+=xp;
      _profileData.playerCoins+=coins;
      setProfileData(profileData);
      updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
      updateTheNumberOfLevelsCleared(currentIndex);
      scale.value=1;
      updateTheNumberOfLevelsCleared(currentIndex);
      setTimeout(()=>scale.value=0, 1500);
      setTimeout(()=>setCurrentIndex(currentIndex+1), 2000);

    }
    else {
      resetTheGameData();
      setCompletedGameModal(true);
    }
  }
  else {
    setError("Answer is Wrong");
    setTimeout(()=>setError(""), 1000);
  }   
}

const scale = useSharedValue(0); 
const animatedScale = useAnimatedStyle(() => {
  return {
    transform: [
      {
        scale: withTiming(scale.value, {
          duration: 300,
        }),
      },
    ],
  };
});


  if(!profileDataRead||!readRouteParameters||!readTheGameFile||!gameContent) {
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
    {
      route.params.type==1&&<View>
        <View style={styles.titularWordBox}><WordleText style={{fontSize: 18}}>Correct Spelling</WordleText></View>
        <View style={{width: 200, alignSelf: 'center', marginTop: 10}}>
        {
          options.map((item, index)=>(
            <Pressable key={index} onPress={()=>submit(item)}>
              <View style={styles.optionsText}><WordleText style={{textAlign: 'center'}}>{item}</WordleText></View>
            </Pressable>
          ))
        }
        </View>

      </View>
    }
    {
      route.params.type==2&&<View>
        <View style={styles.titularWordBox}><WordleText style={{fontSize: 18}}>Correct Pair Of Spelling</WordleText></View>
        <View style={{width: 220, alignSelf: 'center', marginTop: 10}}>
        {
          pairOfOptions.map((item, index)=>(
            <Pressable key={index} onPress={()=>submitPair(index)}>
              <View style={styles.pairOptionsText}>
                <WordleText style={{textAlign: 'center'}}>{item[0]}</WordleText>
                <WordleText style={{textAlign: 'center'}}>{item[1]}</WordleText>
                </View>
            </Pressable>
          ))
        }
        </View>

        {pairOfOptions[theAnswerInThePair]&&<Reanimated.View style={[styles.theAnswer, animatedScale]}>
        <WordleText>{pairOfOptions[theAnswerInThePair][0]}</WordleText>
        <WordleText>{pairOfOptions[theAnswerInThePair][1]}</WordleText>
        </Reanimated.View>}
      </View>
    }  

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

      <Modal
                  transparent
                  visible={completedGameModal}
                  onRequestClose={() => setCompletedGameModal(false)}
                >
                  <View style={styles.container}>
                    <ImageBackground 
                    source={modalBackgrounds.whiteModalBackgroundImg}
                    style={styles.backgroundImage}
                    imageStyle={{resizeMode: 'stretch'}}
                    >
                  <View style={styles.modalBackground}>
                      <WordleText style={{textAlign: 'center', lineHeight: 25}}>You have completed All The Levels, Chief!</WordleText>
                      
                        <View style={{flexDirection: 'row', gap: 20, marginTop: 10}}>
                          <Animated.View style={{transform: [{scale: returnToHomeBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(returnToHomeBtnScale.current)}
                            onPressOut={()=>buttonPressOut(returnToHomeBtnScale.current)}
                            onPress={()=>{navigation.navigate("VocabularyGames")}}
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
                          <Animated.View style={{transform: [{scale: replayMatchBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(replayMatchBtnScale.current)}
                            onPressOut={()=>buttonPressOut(replayMatchBtnScale.current)}
                            onPress={()=>{navigation.replace("OrtographiaMatch", {type: route.params.type})   
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