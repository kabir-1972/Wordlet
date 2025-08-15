/**
 * Header to be shown in Wordle-End-Matches...
**/

import React, { useEffect, useRef, useState, RefObject, use } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, TextProps, ImageBackground, Animated, Modal, Image, BackHandler, Pressable, ViewStyle,  UIManager, findNodeHandle, InteractionManager  } from 'react-native';
import { styles } from "../../source/styles/header-inmatch-styles"
import { endgameStyles } from "../../source/styles/header-endgame-styles"
import { buttons, icons} from '../../source/styles/assets';
import { buttonPressIn,buttonPressOut} from '../../source/styles/allAnimations';
import { ScoreOutlinedText, SelfDesignedOutlinedText } from '../../source/styles/outlinedText';

import { RootStackParamList } from '../../types';
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile,  readProfileDataFile, saveProfileDataToFile, updateXpsInPreviousProfileFile, updateXpsAndCoinsInPreviousProfileFile, updateXPLevelInPreviousProfileFile } from '../AccessProfileData';
import { ScoreData } from '../accessProfileData';
import { ExperiencePointAnimationRef, ExperiencePointAnimation } from '../../source/styles/xp-animation-styles';
import { CoinAnimationRef, CoinAnimation } from '../../source/styles/coin-animation-styles';
import { readWordleScoresData, createWordleScoresData, updateWordleScoresData, WordleScoreRecordedData} from './Wordle-Data-Files';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import {HorizontalLightSweep} from '../../source/styles/ingame-animations';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CountUp from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';
import { WordleBucketModal, DictionaryModal, HeaderForMatchEnd } from '../Components-For-End-Match';
import { addWord, countWords } from '../Wordlet-Bucket';

type WordleMatchRouteProp = RouteProp<RootStackParamList, 'WordleMatchEnd'>;

interface PositionalValues {
  x: number | undefined;
  y: number | undefined;
}
      
  export let _targetWord="";
  export let _xps=8; 
  let _coins=12;
  let _winOrLose=1;
  let _xpPercent=0;

//Working with the date:
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  weekday: 'short',
};


const today = new Date();
const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(today);

const month = parts.find(p => p.type === 'month')?.value ?? '';
const day = parts.find(p => p.type === 'day')?.value ?? '';
const year = parts.find(p => p.type === 'year')?.value ?? '';
const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';

export const finalDate = `${month} ${day}, ${year} ${weekday}`;

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
      
const HeaderInMatch=()=>{
    const [wordletBucketWords, setWordleBucketWords] = useState(0);
    const addWordToBucket = useRef(new Animated.Value(1)).current;
    const cancelWordBucket = useRef(new Animated.Value(1)).current;
    const getMeaning = useRef(new Animated.Value(1)).current;
    

    const _allowAnimation= useRef(false);
    const [dictionaryModalVisibiltiy,setDictionaryModalVisibiltiy]=useState(false);

    //const route = useRoute<WordleMatchRouteProp>();

    const route={
      params:{
        numberOfTries: 1,
        targetWord: 'BLOW',
        gameName: 'Pre-Solved Wordle',
        winOrLose: 1
      }
    }

    const navigation = useNavigation<NavigationProp>();
    const [numberOfTries, setNumberOfTries]=useState(1);
    const [targetWord, setTargetWord]=useState("");
    const [scoreFileName, setFileName]=useState("");
    const [result, setResult]=useState(0);

    const [triggerLightSweep, setLightSweep]=useState(false);
    
    const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
    });


    const [scoreData, setScoreData]=useState<ScoreData>({
        winStreak: 0,
        score: 0
    });

    const [maxXp, setMaxXp]=useState(60);

    const [xpPercent, setXpPercent]=useState("0%");
    const [playXpAndCoinAnimation, setPlayXpAndCoinAnimation]=useState(false);

    const [profileDataRead, setProfileDataRead]=useState(false);
    const [scoreDataRead, setScoreDataRead]=useState(false);
    const [routeParametersRead, setRouteParametersRead]=useState(false);
    const [profileAndScoresDataRead, setProfileAndScoresDataRead]=useState(false);
    
    const [xps, setXPs]=useState(0);
    const [coins, setCoins]=useState(0);
    const [showXpLevelUpAnimation, setShowXpLevelUpAnimation]=useState(false);
    const [endedXpLevelFadeIn, setEndedXpLevelFadeIn]=useState(false);

    const [showWordleBucketModal, setShowWordleBucketModal]=useState(false);
    const [greetingText, setGreetingText]=useState("");

    const [showWordAlreadyAdded, setShowWordAlreadyAdded]=useState(false);
    const [showWordAdded, setShowWordAdded]=useState(false);

    useEffect(()=>{   
    if (route.params) {
      setNumberOfTries(route.params.numberOfTries);
      setTargetWord(route.params.targetWord);
      _targetWord=route.params.targetWord;

      setFileName(route.params.gameName.replaceAll(' ','-')+"-Score.json");
      let _xps, _coins;

    switch(route.params.numberOfTries){
      case 1: {
        switch(_targetWord.length){
          case 4: _xps = 8;  _coins = 18; break;
          case 5: _xps = 12; _coins = 22; break;
          case 6: _xps = 20; _coins = 30; break;
          case 7: _xps = 42; _coins = 48; break;
          default: _xps = 8; _coins = 18; break;
        }
      }

      case 2: {
        switch(_targetWord.length){
          case 4: _xps = 6;  _coins = 12; break;
          case 5: _xps = 10; _coins = 16; break;
          case 6: _xps = 16; _coins = 24; break;
          case 7: _xps = 36; _coins = 36; break;
          default: _xps = 8; _coins = 18; break;
        }
      }

      case 3: {
        switch(_targetWord.length){
          case 4: _xps = 4; _coins = 10; break;
          case 5: _xps = 8; _coins = 12; break;
          case 6: _xps = 14; _coins = 20; break;
          case 7: _xps = 28; _coins = 32; break;
          default: _xps = 8; _coins = 18; break;
        }
      }

      case 4: {
        switch(_targetWord.length){
          case 4: _xps = 2; _coins = 8; break;
          case 5: _xps = 6; _coins = 10; break;
          case 6: _xps = 12; _coins = 16; break;
          case 7: _xps = 16; _coins = 28; break;
          default: _xps = 8; _coins = 18; break;
        }
      }

      case 5: {
        switch(_targetWord.length){
          case 5: _xps = 4; _coins = 8; break;
          case 6: _xps = 8; _coins = 12; break;
          case 7: _xps = 12; _coins = 24; break;
          default: _xps = 8; _coins = 18; break;
        }
      }

      case 6: {
        switch(_targetWord.length){
          case 7: _xps = 8; _coins = 20; break;
          default: _xps = 8; _coins = 20; break;
        }
      }

      default: {
        switch(_targetWord.length){
          case 4: _xps = 8;  _coins = 18; break;
          case 5: _xps = 12; _coins = 22; break;
          case 6: _xps = 20; _coins = 30; break;
          case 7: _xps = 42; _coins = 48; break;
          default: _xps = 8; _coins = 18; break;
        }
      }     
    }
    }/**/

    setXPs(_xps);
    setCoins(_coins);
    
    setNumberOfTries(1);
    setTargetWord(route.params.targetWord);
    setResult(_winOrLose);
    if(_winOrLose==1) setGreetingText("You Have Successfully\nGuessed The Word!!!");
    else setGreetingText("You Could Have\nGuessed The Word");

    setRouteParametersRead(true);
    },[]);


    useEffect(()=>{
        if(!routeParametersRead) return;
    const _attempts=route.params.numberOfTries;
    let maxChance=5;
    
    switch(_targetWord.length){
      case 4:
      case 5:
      case 6:  
      maxChance = 5; break;
      case 7: maxChance = 6; break;
    }

    if(route.params.winOrLose==1)
      updateWordleScoresData(scoreFileName,_targetWord.length,maxChance-_attempts, 1);
    else updateWordleScoresData(scoreFileName,_targetWord.length,maxChance-_attempts, 0);

    async function loadProfileData() {

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

        let _maxXp;
        if(_profileData.playerLevel<8){
            _maxXp=(profileData.playerLevel*60);   
        }
        else _maxXp=((profileData.playerLevel-7)*70+420); 
        setMaxXp(_maxXp);
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
      
      const count=await countWords();
      setWordleBucketWords(count);
      /**/
    }
    loadProfileData();
    async function loadScoreData(){
    const scoreData = await readWordleScoresData(scoreFileName, targetWord.length);
        if(scoreData){    
          setScoreDataRead(true);
          let scoreDataTemplate={
            score: scoreData.score,
            winStreak: scoreData.winStreak
          };
          setScoreData(scoreDataTemplate);
      }
      else{
          await createWordleScoresData(scoreFileName);
          setScoreDataRead(true);
      }
      }
    loadScoreData();
    setProfileAndScoresDataRead(true);
    },[routeParametersRead])

useEffect(()=>{
  if(!_allowAnimation.current&&routeParametersRead) return;
  console.log(_allowAnimation.current, routeParametersRead);  
  _xpPercent = parseFloat((profileData.playerXP/maxXp).toFixed(2)) * 100;
  setXpPercent(_xpPercent.toString());

},[_allowAnimation, routeParametersRead])

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    useEffect(()=>{
      if(result==2){
    const animation = Animated.sequence([
        Animated.parallel([
        Animated.timing(scaleAnim,{
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ]),
       Animated.parallel([
        Animated.timing(scaleAnim,{
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
    ])
    ]);
      
    Animated.loop(animation, { iterations: 3 }).start();}
    else{

    }
    },[result])

    const wobble=rotateAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['0deg', '-5deg', '5deg', '-5deg', '0deg']
    });

        const experiencePointsRef=useRef<View>(null);
        const experiencePointsBarRef=useRef<View>(null);
        const coinsRef=useRef<View>(null);
        const coinsBarRef=useRef<View>(null);

        const [xpMovementCoord, setXpMovementCoord]=useState<number[]>([]);
        const [coinMovementCoord, setCoinMovementCoord]=useState<number[]>([]);

/**/
useEffect(() => {
  const measureComponent = (ref: RefObject<View | null>): Promise<PositionalValues | null> => {
    return new Promise((resolve) => {
      const nodeHandle = findNodeHandle(ref.current);
      if (nodeHandle != null) {
        InteractionManager.runAfterInteractions(() => {
          UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
            resolve({x: pageX, y: pageY });
          });
        });
      } else {
        resolve(null);
      }
    });
  };

  const measureAll = async () => {
    const experiencePoints: PositionalValues | null= await measureComponent(experiencePointsRef);
    const experienceBar: PositionalValues | null = await measureComponent(experiencePointsBarRef);
    const coins: PositionalValues | null = await measureComponent(coinsRef);
    const coinsBar: PositionalValues | null = await measureComponent(coinsBarRef);

    if (experiencePoints && experienceBar && experiencePoints.x && experienceBar.x && experiencePoints.y && experienceBar.y
       && coins && coinsBar && coins.x && coinsBar.x && coinsBar.y && coins.y
    ) {
      const dx = experienceBar.x - experiencePoints.x;
      const dy = experienceBar.y - experiencePoints.y;
      setXpMovementCoord([dx, dy]);

      const dx2 = coinsBar.x - coins.x;
      const dy2 = coinsBar.y - coins.y;
      setCoinMovementCoord([dx2, dy2]);

      setTimeout(()=>{
        setPlayXpAndCoinAnimation(true);
      },500);
    }
  };
  measureAll();
}, []);

    useEffect(()=>{
        if(!playXpAndCoinAnimation) return;
        const checkForValidity=async ()=>{
          const checkValidityOfScoreCounting=await WordleScoreRecordedData(_targetWord.length);
          _allowAnimation.current=false;
          if(checkValidityOfScoreCounting){
            ExperiencePointsRef.current?.startAnimation(1);
            CoinsRef.current?.startAnimation(1);

            let _profileData=profileData;
            _profileData.playerXP=profileData.playerXP+xps;
            _profileData.playerCoins=profileData.playerCoins+coins;   
            _allowAnimation.current=true;
            setTimeout(()=>{

            if(_profileData.playerXP>maxXp){
              _profileData.playerXP=_profileData.playerXP-maxXp;
             
              _profileData.playerLevel=_profileData.playerLevel+1;
              
              let _maxXp;
                if(_profileData.playerLevel<8)
                  _maxXp=(profileData.playerLevel*60);   
                else _maxXp=((profileData.playerLevel-7)*70+420); 
                  setMaxXp(_maxXp);

              updateXPLevelInPreviousProfileFile(_profileData.playerLevel);
              _allowAnimation.current=false;
              showXpLevelIncrementAnimation();
            }
            /*
            updateCoinsInPreviousProfileFile(_profileData.playerCoins);
            updateXpsInPreviousProfileFile(_profileData.playerXP);*/
            updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
            setProfileData(_profileData);
            },500)
          }
        }
     
     checkForValidity();   
    },[playXpAndCoinAnimation])      

    const ExperiencePointsRef= useRef<ExperiencePointAnimationRef>(null);
    const CoinsRef= useRef<CoinAnimationRef>(null);

  useEffect(() => {
  const interval = setInterval(() => {
    setLightSweep(prev => !prev);
  }, 1500);

  return () => clearInterval(interval);
}, []);

  function showXpLevelIncrementAnimation(){
    setShowXpLevelUpAnimation(true);
  }

    const closeTheLevelUpModalScale=useRef(new Animated.Value(1)).current;
    const goHomeBtnScale=useRef(new Animated.Value(1)).current;
    const nextMatchBtnScale=useRef(new Animated.Value(1)).current;
    const addWordToWordletBucketBtnScale=useRef(new Animated.Value(1)).current;
    const returnToWordleScreenBtnScale=useRef(new Animated.Value(1)).current;
    const playMultiplayerBtnScale=useRef(new Animated.Value(1)).current;

    const fadeModalAnim=useRef(new Animated.Value(0)).current;
    const translateYAnim=useRef(new Animated.Value(-500)).current;
    const scaleAllAnim=useRef(new Animated.Value(1)).current;

    
    useEffect(()=>{
      const animationDuration = 800;
    if(showXpLevelUpAnimation){
      translateYAnim.setValue(-500);
      fadeModalAnim.setValue(0);
      scaleAllAnim.setValue(1);

      Animated.parallel([
        Animated.timing(fadeModalAnim,{
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true
      }),
      Animated.timing(translateYAnim,{
          toValue: -50,
          duration: animationDuration,
          useNativeDriver: true
        })
    ]).start();
      setTimeout(()=>{setEndedXpLevelFadeIn(true)},1000);
    }

    },[showXpLevelUpAnimation]);

    useEffect(()=>{
     if(endedXpLevelFadeIn){
      const scaleAnimationDuration=1500;

        Animated.timing(scaleAllAnim,{
          toValue: 2.6,
          duration: scaleAnimationDuration,
          useNativeDriver: true
        }).start();
    }
    },[endedXpLevelFadeIn])


    const scaleValues=scaleAllAnim.interpolate({
      inputRange: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
      outputRange: [1.1, 1.2, 1.1, 1, 0.9, 0.8, 0.9, 1, 1.1, 1, 0.9, 1, 1.1, 1, 0.9, 1]
    })

    type WordleMatchScreens =
      | "BasicWordleMatch"
      | "ReversedWordleMatch"
      | "ShiftedWordleMatch"
      | "PreSolvedWordleMatch";
    
    let wordleMatchWindow: WordleMatchScreens = "BasicWordleMatch";
    
    switch (true) {
      case route.params?.gameName.toLowerCase().includes("reversed"): wordleMatchWindow = "ReversedWordleMatch"; break;
      case route.params?.gameName.toLowerCase().includes("shifted"): wordleMatchWindow = "ShiftedWordleMatch"; break;
      case route.params?.gameName.toLowerCase().includes("solved"): wordleMatchWindow = "PreSolvedWordleMatch"; break;
      default: wordleMatchWindow = "BasicWordleMatch"; break;
    }

    useEffect(()=>{
      const backAction=()=>{
        navigation.navigate("Home");  
        return true;
      }
    
      const backHandler =BackHandler.addEventListener(
      "hardwareBackPress", backAction);
       return ()=>  backHandler.remove();
    }, []);

    const handleAddWordToBucket = async () => {
    const checkIfWordisAdded = await addWord(_targetWord, finalDate);  
    if (checkIfWordisAdded === 1) {
        setWordleBucketWords(prev => prev + 1);
        setShowWordAdded(true);
        setTimeout(()=>setShowWordAdded(false),2000);
        }
        else{
        setShowWordAlreadyAdded(true);
        setTimeout(()=>setShowWordAlreadyAdded(false),2000);
        }
    };

    if(profileAndScoresDataRead)
    return (
        <ImageBackground
        source={SettingsData.background}
        style={{flex: 1}}
        imageStyle={ {resizeMode: 'stretch', width: '100%',}}
        >
        <HeaderForMatchEnd
        profileData={profileData}
        setXpPercent={setXpPercent}
        xpPercent={xpPercent}
        maxXp={maxXp}
        experiencePointsBarRef={experiencePointsBarRef}
        coinsBarRef={coinsBarRef}
        _xps={_xps}
        />
        <View style={styles.lowerRow}>
                    <ImageBackground
                    source={buttons.pinkButton}
                    style={styles.button}
                    imageStyle={styles.buttonStyle}
                    >
                    <View style={styles.scoreCardContainer}>
                        <View style={{alignItems: 'center'}}><HeaderText style={{color:'black'}}>Score</HeaderText><ScoreOutlinedText text={scoreData.score.toString()}/></View>
                        <View style={{height: '80%', width: 1, backgroundColor: 'black', marginTop: -3}}></View>
                        <View style={{alignItems: 'center'}}><HeaderText style={{color:'black'}}>Win Streak</HeaderText><ScoreOutlinedText text={scoreData.winStreak.toString()}/></View>
                    </View>
                    </ImageBackground>
        </View>
        <Animated.View style={{
          transform: [
            { rotate: wobble },
            { scale: scaleAnim }
          ]
        }}>
        <View style={endgameStyles.matchResultContainer}>
        <ParagraphText style={{fontSize: 20, textAlign: 'center', lineHeight: 30, color:'#b4f4ea'}}>{greetingText}</ParagraphText>
        </View>
        </Animated.View>
        <View style={endgameStyles.wordleRow}>
                {
                  Array.from({ length: targetWord.length }).map((_, i) => (
                  <View key={i} style={endgameStyles.wordleBox}>
                  <Text style={endgameStyles.wordleText}>{targetWord[i]}</Text></View>))
                }
        </View>

        <Animated.View style={{transform: [{scale: getMeaning}]}}>        
        <Pressable
        onPressIn={()=>buttonPressIn(getMeaning)}
        onPressOut={()=>buttonPressOut(getMeaning)}
        onPress={()=>{setDictionaryModalVisibiltiy(true)}}
        >
          <ImageBackground
          source={buttons.blueButton}
          style={[styles.button, {alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 6}]}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', gap: 0, alignItems: 'center'}}>
          <WordleText>Meaning</WordleText>
          <LottieView source={require('./../../assets/animations/info-button-popup.json')} autoPlay style={{ width: 25, height: 25, marginTop: -2 }} />
          </View>
          </ImageBackground>
        </Pressable>
        </Animated.View>

        <View style={endgameStyles.resultContainer}>
        <BlackParagraphText>{insertHyphenForFileName (scoreFileName.split('-Score.json')[0])}</BlackParagraphText>
        <BlackParagraphText style={{marginTop: 2}}>Attempts : {numberOfTries}</BlackParagraphText>
        <HorizontalLightSweep trigger={triggerLightSweep}
        sweepHorizontal={100}
        startingPoint={100}
        style={{backgroundColor: '#fce7a070', marginTop: -65}}
        height={'180%'}
        duration={2000}
        />
        </View>
        
        <ParagraphText style={{textAlign: 'center'}}>Rewards : </ParagraphText>
        <View style={{flexDirection: 'row', gap: 10, alignSelf: 'center'}}>
        <View style={{flexDirection: 'row'}} ref={experiencePointsRef}>
          <ScoreOutlinedText text={_xps.toString()}/>
          <Image source={icons.xp} style={{width: 20, height: 20, marginTop: -2}}></Image>
        <ExperiencePointAnimation
                      ref={ExperiencePointsRef}
                      animationStart1={{ x: -25, y: -5 }}
                      animationStart2={{ x: -25, y: -5 }}
                      animationStart3={{ x: -25, y: -5 }}
                      animationEnd1={{ 
                        x: xpMovementCoord[0]?xpMovementCoord[0]:0,
                        y: xpMovementCoord[1]?xpMovementCoord[1]:0,}}
                      animationEnd2={{ 
                        x: xpMovementCoord[0]?xpMovementCoord[0]+3:0,
                        y: xpMovementCoord[1]?xpMovementCoord[1]:0 }}
                      animationEnd3={{
                        x: xpMovementCoord[0]?xpMovementCoord[0]+5:0,
                        y: xpMovementCoord[1]?xpMovementCoord[1]:0 }}
        />
        </View>
        <View style={{flexDirection: 'row'}} ref={coinsRef}>
          <ScoreOutlinedText text={_coins.toString()}/>
          <Image source={icons.coin} style={{width: 20, height: 20, marginTop: -2}}></Image>
        <CoinAnimation
                      ref={CoinsRef}
                      animationStart1={{ x: -25, y: -5 }}
                      animationStart2={{ x: -25, y: -5 }}
                      animationStart3={{ x: -25, y: -5 }}
                      animationEnd1={{ 
                        x: coinMovementCoord[0]?coinMovementCoord[0]:0,
                        y: coinMovementCoord[1]?coinMovementCoord[1]:0, }}
                      animationEnd2={{ 
                        x: coinMovementCoord[0]?coinMovementCoord[0]+3:0,
                        y: coinMovementCoord[1]?coinMovementCoord[1]:0 }}
                      animationEnd3={{
                        x: coinMovementCoord[0]?coinMovementCoord[0]+5:0,
                        y: coinMovementCoord[1]?coinMovementCoord[1]:0 }}
        />
        </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, alignSelf: 'center'}}>
          <Animated.View style={{transform: [{scale: goHomeBtnScale}]}}>               
          <Pressable
          onPressIn={()=>{buttonPressIn(goHomeBtnScale)}}
          onPressOut={()=>{buttonPressOut(goHomeBtnScale)}}
          onPress={()=>navigation.navigate("Home")}
          >
          <ImageBackground
          source={buttons.redButton}
          style={styles.button}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.btnHomeIcon} style={{width: 20, height: 20, marginTop: -6}}></Image>  
          <BlackParagraphText style={{paddingVertical: 9, paddingHorizontal: 6, fontSize: 20}}>Return Home</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>

          <Animated.View style={{transform: [{scale: nextMatchBtnScale}]}}>
          <Pressable
          onPressIn={()=>{buttonPressIn(nextMatchBtnScale)}}
          onPressOut={()=>{buttonPressOut(nextMatchBtnScale)}}
          onPress={()=>navigation.navigate(wordleMatchWindow,{size: _targetWord.length})}/**/>
          <ImageBackground
          source={buttons.blueButton}
          style={styles.button}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.btnNextMatchIcon} style={{width: 20, height: 20, marginTop: -6}}></Image> 
          <BlackParagraphText style={{paddingVertical: 9, paddingHorizontal: 6, fontSize: 20}}>Play Again</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>
        </View>

<View style={{flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'center'}}>
          <Animated.View style={{transform: [{scale: addWordToWordletBucketBtnScale}]}}>
          <Pressable
          onPressIn={()=>{buttonPressIn(addWordToWordletBucketBtnScale)}}
          onPressOut={()=>{buttonPressOut(addWordToWordletBucketBtnScale)}}
          onPress={()=>setShowWordleBucketModal(true)}
          style={{alignSelf: 'center', marginVertical: 10}}
          >
          <ImageBackground
          source={buttons.pinkButton}
          style={[styles.button, {borderRadius: 9}]}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.wordletBucketIcon} style={{width: 20, height: 20, marginTop: -6}}></Image>  
          <BlackParagraphText style={{paddingVertical: 6, paddingRight: 12, paddingLeft: 6, fontSize: 18, textAlign: 'center', lineHeight: 23}}>{"Add Word to\nWordlet Bucket"}</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>

          <Animated.View style={{transform: [{scale: returnToWordleScreenBtnScale}]}}>
          <Pressable
          onPressIn={()=>{buttonPressIn(returnToWordleScreenBtnScale)}}
          onPressOut={()=>{buttonPressOut(returnToWordleScreenBtnScale)}}
          onPress={()=>navigation.navigate("Wordle")}
          style={{alignSelf: 'center', marginVertical: 10}}
          >
          <ImageBackground
          source={buttons.tealButton}
          style={[styles.button, {borderRadius: 9}]}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.btnNextMatchIcon} style={{width: 20, height: 20, marginTop: -6}}></Image>  
          <BlackParagraphText style={{paddingVertical: 6, paddingRight: 12, paddingLeft: 6, fontSize: 18, textAlign: 'center', lineHeight: 23}}>{"Return to\nWordle Screen"}</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>
</View>

          <Animated.View style={{transform: [{scale: playMultiplayerBtnScale}]}}>
          <Pressable
          onPressIn={()=>{buttonPressIn(playMultiplayerBtnScale)}}
          onPressOut={()=>{buttonPressOut(playMultiplayerBtnScale)}}
          style={{alignSelf: 'center', marginVertical: 0}}
          onPress={()=>{
          navigation.navigate("MultiplayerGameLoading");
          }}>
          <ImageBackground
          source={buttons.yellowButton}
          style={[styles.button, {borderRadius: 7}]}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.multiplayerIcon} style={{width: 20, height: 20, marginTop: -6}}></Image> 
          <BlackParagraphText style={{paddingVertical: 6, paddingHorizontal: 12, fontSize: 18, textAlign: 'center', lineHeight: 20}}>{"Play\nMultiplayer"}</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>

           <Modal
                  visible={showXpLevelUpAnimation}
                  onRequestClose={()=>setShowXpLevelUpAnimation(false)}
                  transparent={true}
                  >
              <Animated.View style={[endgameStyles.container, {opacity: fadeModalAnim}]}> 
               <View style={endgameStyles.modalBackground}>
                        <Animated.View style={[{transform: [{translateY: translateYAnim}, {scale: scaleValues}]}]}> 
                        <ImageBackground
                        source={icons.xp}
                        style={{width: 100, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}
                        >
                        <SelfDesignedOutlinedText height={40} width={40} dy={5} text={profileData.playerLevel.toString()} fontSize={30}/>
                        </ImageBackground>
                        </Animated.View>
                        <ParagraphText style={{fontSize: 22, color: '#00ffba'}}>Level Up</ParagraphText>
                        
                        <View style={{opacity: endedXpLevelFadeIn?1:0}}>
                        <ParagraphText style={{color: "#ffa927"}}>Here are your Gifts: </ParagraphText>

                        <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 4}}>
                          <ParagraphText>150</ParagraphText>
                          <Image source={icons.coin} style={{width: 20, height: 20, marginTop: -2}}></Image>
                        </View>

                        <View style={{alignSelf: 'center', alignItems: 'center'}}>
                          <ParagraphText style={{color: "#27edff"}}>Unlocked Levels:</ParagraphText>
                          <ParagraphText style={{color: "#27edff"}}>-  -  -</ParagraphText>

                        </View>

                        <Animated.View style={{marginTop: 40, alignSelf: 'center', transform: [{scale: closeTheLevelUpModalScale} ]}}>
                        <Pressable
                        onPressIn={()=>{buttonPressIn(closeTheLevelUpModalScale)}}
                        onPressOut={()=>{buttonPressOut(closeTheLevelUpModalScale)}}
                        onPress={()=>{setShowXpLevelUpAnimation(false)}}
                        >
                        <ImageBackground
                        source={buttons.redButton}
                        style={endgameStyles.button}
                        imageStyle={styles.buttonStyle}
                        > 
                          <ParagraphText style={{fontSize: 20}}>Close</ParagraphText>
                        </ImageBackground> 
                        </Pressable>
                        </Animated.View>
                        </View>
                  </View>
              </Animated.View>
          </Modal>

          <WordleBucketModal
              showWordleBucketModal={showWordleBucketModal}
              setShowWordleBucketModal={setShowWordleBucketModal}
              targetWord={targetWord}
              finalDate={finalDate}
              wordletBucketWords={wordletBucketWords}
              showWordAdded={showWordAdded}
              showWordAlreadyAdded={showWordAlreadyAdded}
              cancelWordBucket={cancelWordBucket}
              addWordToBucket={addWordToBucket}
              handleAddWordToBucket={handleAddWordToBucket}
          />


          <DictionaryModal
              showDictionaryModal={dictionaryModalVisibiltiy}
              setShowDictionaryModal={setDictionaryModalVisibiltiy}
              targetWord={targetWord}
              cancelWordBucket={cancelWordBucket}
              addWordToBucket={addWordToBucket}
          />

            
    </ImageBackground>
    );
    
    else return(
        <GameLoadingAnimation gameLoadingAnimationPrompt="Loading Scores..."/>
    )





}




export const HeaderText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.headerText, style]} {...rest}>
      {children}
    </Text>
    
  );
};

export const WordleText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.wordleText, style]} {...rest}>
      {children}
    </Text>
    
  );
};


export const ParagraphText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.paragraphText, style]} {...rest}>
      {children}
    </Text>
    
  );
};

export const BlackParagraphText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.paragraphText, {color: '#222222', fontSize: 19, lineHeight: 19, marginVertical: 4}, style]} {...rest}>
      {children}
    </Text>
    
  );
};

export const ModalContentText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.modalContentText, style]} {...rest}>
      {children}
    </Text>
    
  );
};

export default HeaderInMatch;

function insertHyphenForFileName(str: string) {
  const count = (str.match(/-/g) || []).length;

  if (count >= 2) {
    const lastIndex = str.lastIndexOf('-');
    return str.slice(0, lastIndex) + ' ' + str.slice(lastIndex + 1);
  } else 
    return str.replace('-', ' ');
}