/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Animated,ScrollView } from 'react-native';
import {styles} from '../../source/styles/boggle-match-styles';
import { buttons } from '../../source/styles/assets';
import RNFS from 'react-native-fs';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Boggle-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { addFoundWordsToFile, getThePreviousWordsForBoggle } from './Boggle-Data-Files';
import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import { runOnJS } from 'react-native-reanimated';
/*
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
*/

import { Gesture, GestureDetector } from 'react-native-gesture-handler';


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
  let lastCell = { row: -1, col: -1 };
  

type BoggleMatchRouteProp = RouteProp<RootStackParamList, 'BoggleMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let reward: Record<string, { xp: number; coins: number }>; 
  let _roughString: string[]=[];

  const App = () => {
  const route = useRoute<BoggleMatchRouteProp>();
  /* 
  const route={
    params:{
      level: 1
    }
  };
  */
  
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
    //const [confettiAnimation, setConfettiAnimation]=useState(false);
    const [keys, setKeys]=useState<string[]>([]);
    const [allWordsSet, setAllWordsSet]=useState(false);

    const [foundWords, setFoundWords]=useState<string[]>([]);

    const _gameName='Boggle';

    const rows = 4;
    const cols = 4

    const [roughString, setRoughString]=useState<string[]>([]);

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Boggle files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Boggle Size");
    if (route.params) {
    reward=Rewards.Boggle;
    setReadRouteParameters(true);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);


//                                __\(--)/__    Remains uneffected by previously saved data


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

  async function readTheGameFile() {
    try {
      const gameDataFileName = "boggle-levels.json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const theKeys=JSON.parse(_content)[route.params.level];
      setKeys(theKeys);
      setReadGameFile(true);

    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  async function getThePreviousWords() {
    const theWords=await getThePreviousWordsForBoggle(route.params.level);
    if(Array.isArray(theWords)&&theWords.length>0)  setFoundWords(theWords);
  }


  readTheGameFile();
  getThePreviousWords();
}, [readRouteParameters, route/**/]);


  const handleTheSubmissionAfterwards=(index: number, theString: string)=>{
      const listOfWordsConcerned:string[]=allwords[index];
      if(!listOfWordsConcerned?.length) return;
      
      const _foundWords=[...foundWords];
        if(listOfWordsConcerned.indexOf(theString)!=-1&&!_foundWords.includes(theString)){
          const rewardData=reward[theString.length];
          const _profileData=profileData;
          _profileData.playerCoins+=rewardData.coins;
          _profileData.playerXP+=rewardData.xp;
          setProfileData(_profileData);
          updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
          
          addFoundWordsToFile(theString, route.params.level);
          setFoundWords(prev => [...prev, theString]);
          _foundWords.push(theString);
  }
}

  const touchLimit = 15;
  const width=60;
  const height=60;

  const xs = Array.from({ length: rows+1 }, (_, i) => width * i);
  const ys = Array.from({ length: cols+1 }, (_, i) => height * i);

const handleThePanInteractionOnTheKeys=(x: number, y: number)=>{
      let row=-1;
      let col=-1;

      const _row=Math.floor(x/width);
      const _col=Math.floor(y/height);
        
      if(_row>rows||_col>cols||_row<0||_col<0) return;

        if(x-xs[_row]>touchLimit&&xs[_row+1]-x>touchLimit)
          col=_row;

        if(y-ys[_col]>touchLimit&&ys[_col+1]-y>touchLimit)
          row=_col;
      
      if(row>rows||col>cols||row<0||col<0) return;
    
      if(row==lastCell.row&&col==lastCell.col) return;
      lastCell={row: row, col: col};
      _roughString.push(keys[row * rows + col]);
      setRoughString(prev=>[...prev, keys[row * rows + col]]);
}

const afterThePanRelease=()=>{
        let theString=_roughString.join('');
        
        if(theString.length<3) return;
        else theString=theString.toLowerCase();
        
        const theFirstChar=theString[0];
        const alphabeticalIndex=theFirstChar.charCodeAt(0);
        handleTheSubmissionAfterwards(alphabeticalIndex-96, theString);

        setRoughString([]);
        _roughString=[];
        lastCell={row: -1, col: -1};

}

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      const { x, y } = event;
      runOnJS(handleThePanInteractionOnTheKeys)(x, y);
    })
    .onEnd(() => {
        runOnJS(afterThePanRelease)();
    });


  const tap = Gesture.Tap()
  .onStart((event) => {
    const { x, y } = event;
    runOnJS(handleThePanInteractionOnTheKeys)(x, y);
  })
  .onEnd(()=>{
    runOnJS(afterThePanRelease)();
  })

  const composedGesture = Gesture.Simultaneous(pan, tap);
/* *************************************** Coding the Component JSX here ****************************************** */


  if(!profileDataRead||!readRouteParameters||!readTheGameFile||!allWordsSet) {
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
      gameMode={""}
      />
      <ImageBackground
        source={buttons.blueButton}
        style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
      <WordleText style={{paddingVertical: 5, paddingHorizontal: 12, fontSize: 16}}>Level {route.params.level}</WordleText>
      </ImageBackground>

      
    <GestureDetector gesture={composedGesture}>
        <View style={{alignSelf: 'center', marginVertical: 10}}>
    {
        Array.from({ length: rows }).map((_, rowIndex)=>(
            <View key={rowIndex} style={{flexDirection: 'row', gap: 2}}>
            { Array.from({ length: cols }).map((_, colIndex)=>{
                    return (
                    <ImageBackground 
                        key={rowIndex*rows+colIndex}
                        source={buttons.whiteKey}
                        style={styles.theCells}
                        imageStyle={{resizeMode: 'contain', borderRadius: 4, borderWidth: 1}}
                    >    
                    <WordleText style={{fontSize: 23}}>{keys[rowIndex*rows+colIndex]}</WordleText>
                    </ImageBackground>
                    )
            })}
            </View>
        ))
    }
        </View>
    </GestureDetector>
      
    <View style={{alignSelf: 'center', flexDirection: 'row', height: 40}}>
        {
            roughString.map((item, index)=>(
                <View key={index} style={{backgroundColor: '#fceed2', width: 35, height: 35, borderRadius: 4, borderWidth: 1, borderColor: '#804d01', alignItems: 'center', justifyContent: 'center'}}>
                    <WordleText style={{ fontSize: 20, textAlign: 'center', textAlignVertical: 'center'}}>{item}</WordleText>
                </View>
            ))
        }
    </View>

    {foundWords.length>0&&<View style={styles.foundWordList}>
        {
          foundWords.map((item, index)=>(
            <WordleText key ={index} style={styles.foundWords}>{item}</WordleText>
          ))
        }
    </View>} 
</ScrollView>
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