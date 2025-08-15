/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Image, Animated, Pressable,ScrollView } from 'react-native';
import {styles} from '../../source/styles/matching-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './Matching-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { updateNumberofLevelsCleared } from './Matching-Data-Files';
import  LottieView from 'lottie-react-native';
import { Rewards } from '../Rewards';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';



type MatchingMatchRouteProp = RouteProp<RootStackParamList, 'MatchingMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  let fileContent: {column1: string[], column2: string[]};
  let currentCol=1;

  const App = () => {
  const route = useRoute<MatchingMatchRouteProp>();
  /*
  const route={
    params:{
      level: 1,
      heading: 1
    }
  };
  */
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
    
    const _gameName='Matching';

    const scale= new Animated.Value(1);
    const clearAllBtnScale = new Animated.Value(1);
   
/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Matching files and set the board


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
  setGameLoadingAnimationPrompt("Setting the Matching Size");
    if (route.params) {
      coins=Rewards.Matching.coins;
      xp=Rewards.Matching.xp;
    setReadRouteParameters(true);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);


//                                __\(--)/__    Remains uneffected by previously saved data

const [firstColumn, setFirstColumn]=useState<string[]>([]);
const [secondColumn, setSecondColumn]=useState<string[]>([]);

const [selectedArr, setSelectedArr]=useState<number[][]>([]);
const [selectedPairOfCells, setSelectedPairofCells]=useState<number[]>([]);
const [selectedCols, setSelectedCols]=useState<number[]>([]);

const [checks, setChecks]=useState<number[]>([]);

useEffect(() => {
  if (!readRouteParameters) return;
  
  async function readTheGameFile() {
    try {
      const gameDataFileName = "matching-levels/matching-level-"+route.params.heading+".json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content)[route.params.level];
      fileContent=content;

      const _firstColumn=shuffleArray(content.column1);
      const _secondColumn=shuffleArray(content.column2);

      setFirstColumn(_firstColumn);
      setSecondColumn(_secondColumn);

      setReadGameFile(true);

    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  readTheGameFile();
}, [readRouteParameters, route/**/]);

function shuffleArray(array: string[]): string[] {
    const arr = [...array];
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
  const _checks=[];
  let errorFound = false;

  for(let i=0; i<selectedArr.length; i++){
    let firstWordIndex=(selectedArr[i][0]-10);
    let secondWordIndex=(selectedArr[i][1]-20);

    const firstWord=firstColumn[firstWordIndex];
    const requiredSecondWord=fileContent.column2[fileContent.column1.indexOf(firstWord)];
   
    const requiredSecondWordIndex=secondColumn.indexOf(requiredSecondWord);
    
    if(requiredSecondWordIndex!=secondWordIndex){
      _checks.push(-1);
      errorFound=true;
    }
    else _checks.push(1);

    setChecks(_checks);

    if(!errorFound){
      setConfettiAnimation(true);
      const _profileData=profileData;
      _profileData.playerXP+=xp;
      _profileData.playerCoins+=coins;
      setProfileData(_profileData);
      updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
      updateNumberofLevelsCleared(route.params.heading, route.params.level);
      setTimeout(()=>{
    const maxLevels=100;
    if(route.params.level==maxLevels){
      if(route.params.heading==5)
        navigation.navigate("MatchingLevels");
      else navigation.replace("MatchingMatch", {
        level: 1, heading: route.params.heading+1
      });
    }
    else
      navigation.replace("MatchingMatch", {level: route.params.level+1, heading: route.params.heading});
  }, 2500)};
  }
}  


function rowPressed(index: number){

    if(Math.floor(index/10)==1&&currentCol!=1) return;
    if(Math.floor(index/10)==2&&currentCol!=-1) return;

    
    let _currentCells=[...selectedPairOfCells];
    if(_currentCells.includes(index))
      _currentCells.splice(_currentCells.indexOf(index), 1);
    else _currentCells.push(index);
    if(_currentCells.length>1){
      
      const _selectedArr=[...selectedArr];
      
      if(!selectedCols.includes(index)){
      _selectedArr.push(_currentCells);
      setSelectedArr(_selectedArr);
      setSelectedCols(prev => {return [...prev, ..._currentCells]});
      }
      setSelectedPairofCells(_currentCells);
      
      setTimeout(()=>setSelectedPairofCells([]), 0);
    }
    else setSelectedPairofCells(_currentCells);
    currentCol*=-1;
    
}
  const hue = useSharedValue(0);

  React.useEffect(() => {
    hue.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
    );
  }, []);

  
const animatedStyles = Array.from({ length: 5 }, (_, i) =>
  useAnimatedStyle(() => {
    const offsetHue = (hue.value + i * 60) % 360; 
    const color = `hsl(${offsetHue}, 100%, 50%)`;
    return { backgroundColor: color };
  })
);


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
      gameMode={"Portion "+route.params.heading}
      />
      <ImageBackground
        source={buttons.blueButton}
        style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
      <WordleText style={{paddingVertical: 5, paddingHorizontal: 12, fontSize: 16}}>Level {route.params.level}</WordleText>
      </ImageBackground>

{
  (firstColumn.length>0&&secondColumn.length>0)&&
  <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center', marginTop: 50}}>
    <View>
      {
        firstColumn.map((item, index)=>( 
          <Pressable
            key={index}
            onPress={()=>rowPressed(10+index)}
          >
          <WordleText style={[styles.matchingCells, {backgroundColor: '#b4fad3'}, selectedPairOfCells.includes(10+index)? {transform: [{scale: 0.9}]}: null]}>{item}</WordleText>
          {selectedCols.includes(10+index)&&<View style={styles.disabledButton}/>}
          </Pressable> 
        ))
      }
    </View>
    <View>
      {
        secondColumn.map((item, index)=>(
          <Pressable
            key={index}
            onPress={()=>rowPressed(20+index)}
          >
          <WordleText key={index} style={[styles.matchingCells, {backgroundColor: '#b4faf4'}, selectedPairOfCells.includes(20+index)? {transform: [{scale: 0.9}]}: null]}>{item}</WordleText>
          {selectedCols.includes(20+index)&&<View style={styles.disabledButton}/>}
          </Pressable>
        ))
      }
    </View>
  </View>
}

{
  selectedArr.length>0&&
  <View style={{alignSelf: 'center', marginTop: 10}}>
    {
      selectedArr.map((item, index)=>
    <View key={index} style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>  
      <Pressable
      onPress={()=>{
        let _selectedArr=[...selectedArr];
        const thePairsToBeDeleted=_selectedArr[index];
        let _selectedCols=selectedCols;
        _selectedCols.splice(_selectedCols.indexOf(thePairsToBeDeleted[0]) , 1);
        _selectedCols.splice(_selectedCols.indexOf(thePairsToBeDeleted[1]) , 1);
        setSelectedCols(_selectedCols);
        _selectedArr.splice(index, 1);
        setSelectedArr(_selectedArr);
      }}
      >
        <ImageBackground
        source={buttons.whiteKey}
        style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'contain'}}
        >
        <Image
        source={icons.blackDeleteIcon}
        style={{width: 16, height: 16}}
        >
        </Image></ImageBackground>
      </Pressable>
      <View  style={styles.matchedCells}>
        <WordleText style={{color: '#f4f0ff', fontSize: 17, width: 100, textAlign: 'center'}}>{firstColumn[item[0]%10]}</WordleText>
        <Reanimated.View style={[styles.roundedRectangle, animatedStyles[index]] }/>
        <WordleText style={{color: '#f4f0ff', fontSize: 17, width: 100, textAlign: 'center'}}>{secondColumn[item[1]%20]}</WordleText>
      </View>
      {checks[index]==-1&&<Image source={icons.redCrossIcon} style={{width: 12, height: 12}}></Image>}
      {checks[index]==1&&<Image source={icons.brightGreenTickIcon} style={{width: 12, height: 12}}></Image>}
      </View>
    )
    }
  </View>
}

<View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
  <Animated.View style={{transform: [{scale}]}}>
  <Pressable
  onPressIn={()=>buttonPressIn(scale)}
  onPressOut={()=>buttonPressOut(scale)}
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

  <Animated.View style={{transform: [{scale: clearAllBtnScale}]}}>
  <Pressable
      onPressIn={()=>buttonPressIn(clearAllBtnScale)}
      onPressOut={()=>buttonPressOut(clearAllBtnScale)}
      onPress={()=>{
        setTimeout(()=>{
        setSelectedArr([]);
        setSelectedCols([]);}, 200);
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