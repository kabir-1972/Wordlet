/**
 * Header to be shown in Wordle-End-Matches...
**/

import React, { useEffect, useRef, useState, RefObject } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, TextProps, ImageBackground, Animated, Modal, Image, BackHandler, Pressable, ViewStyle,  UIManager, findNodeHandle, InteractionManager} from 'react-native';
import { styles } from "../../source/styles/header-inmatch-styles"
import { endgameStyles } from "../../source/styles/header-endgame-styles"
import { buttons, icons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn,buttonPressOut} from '../../source/styles/allAnimations';
import { OutlinedText, ScoreOutlinedText, SelfDesignedOutlinedText } from '../../source/styles/outlinedText';
import { AddCoinModal } from '../Add-Coin-Modal'
import { SettingsModal } from '../Settings';
import { ProfileModal } from '../Profile';
import { RootStackParamList } from '../../types';
import { SettingsData } from '../Settings';
import { ProfileData, getTheMaxXpForNextLevel,  readProfileDataFile, updateXpsAndCoinsInPreviousProfileFile,/**/ saveProfileDataToFile, updateXPLevelInPreviousProfileFile } from '../AccessProfileData';

import { ExperiencePointAnimationRef, ExperiencePointAnimation } from '../../source/styles/xp-animation-styles';
import { CoinAnimationRef, CoinAnimation } from '../../source/styles/coin-animation-styles';
import { crosswordScoreRecordedData} from './Crossword-Data-Files';
import { GameLoadingAnimation } from '../Game-Loading-Animation';


import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CountUp from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

type WordleMatchRouteProp = RouteProp<RootStackParamList, 'CrosswordMatchEnd'>;

interface PositionalValues {
  x: number | undefined;
  y: number | undefined;
}
      
  let _xps: number; 
  let _coins: number;
  let _xpPercent=0;

//Working with the date:

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
let rows=5;
let cols=5;

const HeaderInMatch=()=>{

    const settingsBtnScale = useRef(new Animated.Value(1)).current;
    const profileBtnScale = useRef(new Animated.Value(1)).current;
    const coinBtnScale = useRef(new Animated.Value(1)).current;
    const returnToWordleScreenBtnScale = useRef(new Animated.Value(1)).current;
    
    const _allowAnimation= useRef(false);

    const [settingsModalVisibility,setSettingsModalVisibility]=useState(false);
    const [profileSettingsModalVisiblity,setProfileSettingsModalVisiblity]=useState(false);
    const [addCoinModalVisiblity,setAddCoinModalVisiblity]=useState(false);
    
    const hideSettingsModal = () => {setSettingsModalVisibility(false)};
    const hideProfileSettingsModal = () => {setProfileSettingsModalVisiblity(false)};
    const hideAddCoinModal = () => {setAddCoinModalVisiblity(false)};

    //const route = useRoute<WordleMatchRouteProp>();

    const route={
      params:{
        level: 1,
        size: 1,
        gameName: 'Arcade Crossword'
      }
    }

    const navigation = useNavigation<NavigationProp>();    
    const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
    });

    const [maxXp, setMaxXp]=useState(60);

    const [xpPercent, setXpPercent]=useState("0%");
    const [playXpAndCoinAnimation, setPlayXpAndCoinAnimation]=useState(false);

    const [routeParametersRead, setRouteParametersRead]=useState(false);
    const [profileAndScoresDataRead, setProfileAndScoresDataRead]=useState(false);
    
    const [xps, setXPs]=useState(0);
    const [coins, setCoins]=useState(0);
    const [showXpLevelUpAnimation, setShowXpLevelUpAnimation]=useState(false);
    const [endedXpLevelFadeIn, setEndedXpLevelFadeIn]=useState(false);

    const [greetingText, setGreetingText]=useState("");

    const [answerLetters, setAnswerLetters]=useState<string[]>([]);
    const [disallowedGrids, setDisAllowedGrids]=useState<number[]>([]);

    useEffect(()=>{   
    if (route.params) {
      switch(route.params.size){
        case 1: rows=cols=5; _coins=30; _xps=rows*cols; break;
        case 2: rows=cols=6; _coins=40; _xps=rows*cols; break;
        case 3: rows=cols=7; _coins=55; _xps=rows*cols; break;
        case 4: rows=cols=8; _coins=70; _xps=rows*cols; break;
        case 5: rows=cols=9; _coins=100; _xps=rows*cols; break;
        case 6: rows=cols=10; _coins=150; _xps=rows*cols; break;
        default: rows=cols=5; _coins=30; _xps=rows*cols; break;
      }
    }
    
    setXPs(_xps);
    setCoins(_coins);
    setGreetingText("You Have Successfully\nSolved The Crossword!!!");
    setRouteParametersRead(true);
    },[]);


    useEffect(()=>{
        if(!routeParametersRead) return;

    async function loadProfileData() {
      const savedData = await readProfileDataFile();
      if(savedData){
        const _profileData={
            profileName: savedData.profileName,
            playerXP: savedData.playerXP,
            playerCoins: savedData.playerCoins,
            playerLevel: savedData.playerLevel,
            lastMatch: savedData.lastMatch,
        }
        setProfileData(_profileData);
        console.log(_profileData);
        let _maxXp=getTheMaxXpForNextLevel(_profileData.playerLevel);
        setMaxXp(_maxXp);
    }
    else{
      await saveProfileDataToFile(
        profileData.profileName,
        profileData.playerXP,
        profileData.playerCoins,
        profileData.playerLevel,
        profileData.lastMatch,
      );
    }
    }
    async function loadCrosswordData(){
      let _gameName=route.params.gameName.toLowerCase();
      let gameType =_gameName.includes('arcade')?'arcade'
      :_gameName.includes('cryptic')?'cryptic'
      :_gameName.includes('diagramless')?'diagramless'
      :_gameName.includes('rectangular')?'rectangular'
      :_gameName.includes('themed')?'themed'
      :_gameName.includes('cognates')?'cognates':'arcade'
      ;
      let gamesize = rows+'x'+cols;

      const gameDataFileName = "crossword-levels/"+gameType+"/"+gamesize+"/level-" + route.params.level + ".json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content);
      const answers=content.letters;
      const answersArray=answers.split('');
      setAnswerLetters(answersArray);
      
      const _disallowedGrids=content.disallowedGrids;
      const disallowedGridsArr=_disallowedGrids.split(',');
      const updatedDisallowedGridsArr = disallowedGridsArr
            .map((value:string) => parseInt(value))
            .filter((num:number) => !isNaN(num));
      
      setDisAllowedGrids(updatedDisallowedGridsArr);
    }

    loadProfileData();
    loadCrosswordData();
    setProfileAndScoresDataRead(true);
    },[routeParametersRead])

useEffect(()=>{
  if(!_allowAnimation.current&&routeParametersRead) return;
  
  _xpPercent = parseFloat((profileData.playerXP/maxXp).toFixed(2)) * 100;
  setXpPercent(_xpPercent.toString());

},[_allowAnimation, routeParametersRead])

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
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
    ,[])

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
        //updateCoinsInPreviousProfileFile(510);
        const checkForValidity=async ()=>{
          const checkValidityOfScoreCounting=await crosswordScoreRecordedData(route.params.size, route.params.level, route.params.gameName);
          _allowAnimation.current=false;
          
          if(checkValidityOfScoreCounting ){
            ExperiencePointsRef.current?.startAnimation(1);
            CoinsRef.current?.startAnimation(1); 

            let _profileData=profileData;
            //console.log(profileData);
            _profileData.playerXP=profileData.playerXP+xps;
            _profileData.playerCoins=profileData.playerCoins+coins;
            _allowAnimation.current=true;
            setTimeout(()=>{
            if(_profileData.playerXP>maxXp){
              _profileData.playerXP=_profileData.playerXP-maxXp;
              _profileData.playerLevel=_profileData.playerLevel+1;
              let _maxXp=getTheMaxXpForNextLevel(_profileData.playerLevel);
              setMaxXp(_maxXp);

              updateXPLevelInPreviousProfileFile(_profileData.playerLevel);
              _allowAnimation.current=false;
              showXpLevelIncrementAnimation();
            }
            updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
            setProfileData(_profileData);
            },500)
          }
        }
     
     checkForValidity();   
    },[playXpAndCoinAnimation])      

    const ExperiencePointsRef= useRef<ExperiencePointAnimationRef>(null);
    const CoinsRef= useRef<CoinAnimationRef>(null);

  function showXpLevelIncrementAnimation(){
    setShowXpLevelUpAnimation(true);
  }

    const closeTheLevelUpModalScale=useRef(new Animated.Value(1)).current;
    const goHomeBtnScale=useRef(new Animated.Value(1)).current;
    const nextMatchBtnScale=useRef(new Animated.Value(1)).current;
    
    const headerForMatchEnd=()=>(
    <View style={styles.container}>
        <View style={styles.upperRow}>
            <View style={{flexDirection: 'row', gap: 5}}>    
            <Animated.View style={{transform:[{scale: settingsBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(settingsBtnScale)}}
                onPressOut={()=>{buttonPressOut(settingsBtnScale)}}
                onPress={settingsBtnPressed}
                >
                    <ImageBackground
                    source={buttons.blueButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.settingsIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>

            <Animated.View style={{transform:[{scale: profileBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(profileBtnScale)}}
                onPressOut={()=>{buttonPressOut(profileBtnScale)}}
                onPress={settingsBtnPressed}
                >
                    <ImageBackground
                    source={buttons.grayButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.profileIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>        
            </View>

            <View style={endgameStyles.xpBar} ref={experiencePointsBarRef}>
            <ImageBackground
            source={icons.xp}
            style={[styles.xpImage, {zIndex: 2}]}
            imageStyle={styles.xpImageStyle}>
            <OutlinedText text={profileData.playerLevel.toString()}/>
            </ImageBackground>
            <View
            style={endgameStyles.xpBarContainer}>
                <View style={[endgameStyles.xpBarFill, {width: `${xpPercent}%` as ViewStyle['width'] }]}/>
                <View style={[endgameStyles.xpBarFloat]}/>
                <View style={{flexDirection: 'row', marginTop: -17, alignSelf: 'center',}}>
                <CountUp
                    targetNumber={profileData.playerXP}
                    allowAnimation={_xps!=0}
                    style={{
                          fontSize: 15,
                          fontFamily: 'Wordlet-Regular',
                          letterSpacing: -0.5,
                }}
                onComplete={(finalValue)=>{setXpPercent(finalValue.toString());}}
                maxXp={maxXp} 
                />
                <WordleText style={{ fontSize: 15}}>/{maxXp}</WordleText>
                </View>
            </View>
            </View> 

            <Animated.View style={{transform:[{scale: coinBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(coinBtnScale)}}
                onPressOut={()=>{buttonPressOut(coinBtnScale)}}
                onPress={addCoinsBtnPressed}
                >
            <View style={styles.inGameCoin} ref={coinsBarRef}>
                <View style={styles.coinContainer}>
                <View style={styles.coinContainerInline}></View>
                <CountUp
                    targetNumber={profileData.playerCoins}
                    allowAnimation={_xps!=0}
                    style={{
                          fontSize: 15,
                          fontFamily: 'Wordlet-Regular',
                          letterSpacing: -0.5,
                          marginTop: 3
                }}/>
                </View>
                <Image 
                source={icons.coin}
                style={styles.coinImage}>
                </Image>
            </View></Pressable>
        </Animated.View>
        </View>
        <SettingsModal
        visible={settingsModalVisibility}
        onclose={hideSettingsModal}
        />

        <AddCoinModal
        visible={addCoinModalVisiblity}
        onclose={hideAddCoinModal}
        />

        <ProfileModal
        visible={profileSettingsModalVisiblity}
        onclose={hideProfileSettingsModal}
        />

    </View>
    )

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

    type CrosswordMatchScreens =
      | "ArcadeCrosswordMatch"
      | "CognateCrosswordMatch"
      | "ThemedCrosswordMatch"
      | "DiagramlessCrosswordMatch"
      | "CrypticCrosswordMatch"
      | "RectangularCrosswordMatch"
      ;
    
    let crosswordMatchWindow: CrosswordMatchScreens = "ArcadeCrosswordMatch";
    
    switch (true) {
      case route.params?.gameName.toLowerCase().includes("cognate"): crosswordMatchWindow = "CognateCrosswordMatch"; break;
      case route.params?.gameName.toLowerCase().includes("themed"): crosswordMatchWindow = "ThemedCrosswordMatch"; break;
      case route.params?.gameName.toLowerCase().includes("diagramless"): crosswordMatchWindow = "DiagramlessCrosswordMatch"; break;
      case route.params?.gameName.toLowerCase().includes("crpytic"): crosswordMatchWindow = "CrypticCrosswordMatch"; break;
      case route.params?.gameName.toLowerCase().includes("rectangular"): crosswordMatchWindow = "RectangularCrosswordMatch"; break;
      default: crosswordMatchWindow = "ArcadeCrosswordMatch"; break;
    }

    useEffect(()=>{
    type CrosswordLevelScreens =
      | "ArcadeCrosswordLevels"
      | "CognateCrosswordLevels"
      | "ThemedCrosswordLevels"
      | "DiagramlessCrosswordLevels"
      | "CrypticCrosswordLevels"
      | "RectangularCrosswordLevels"
      ;
    
    let crosswordLevelWindow: CrosswordLevelScreens = "ArcadeCrosswordLevels";
    let noParameterCrosswordLevelWindow: CrosswordLevelScreens = "ThemedCrosswordLevels";

    switch (true) {
      case route.params?.gameName.toLowerCase().includes("cognate"): noParameterCrosswordLevelWindow = "CognateCrosswordLevels"; break;
      case route.params?.gameName.toLowerCase().includes("themed"): noParameterCrosswordLevelWindow = "ThemedCrosswordLevels"; break;
      case route.params?.gameName.toLowerCase().includes("diagramless"): crosswordLevelWindow = "DiagramlessCrosswordLevels"; break;
      case route.params?.gameName.toLowerCase().includes("crpytic"): crosswordLevelWindow = "CrypticCrosswordLevels"; break;
      case route.params?.gameName.toLowerCase().includes("rectangular"): noParameterCrosswordLevelWindow = "RectangularCrosswordLevels"; break;
      default: crosswordLevelWindow = "ArcadeCrosswordLevels"; break;
    }

      const backAction=()=>{
        if(route.params?.gameName.toLowerCase().includes("arcade")||
        route.params?.gameName.toLowerCase().includes("cryptic")||
        route.params?.gameName.toLowerCase().includes("diagramless"))
        navigation.navigate(crosswordLevelWindow, {
          size: route.params.size
        });
        else navigation.navigate(noParameterCrosswordLevelWindow);  
        return true;
      }
    
      const backHandler =BackHandler.addEventListener(
      "hardwareBackPress", backAction);
       return ()=>  backHandler.remove();
    }, []);


    if(profileAndScoresDataRead)
    return (
        <ImageBackground
        source={SettingsData.background}
        style={{flex: 1}}
        imageStyle={ {resizeMode: 'stretch', width: '100%',}}
        >
        {headerForMatchEnd()}
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
        
        <View style={[styles.wordleContainer, {marginVertical: 5}]}>{
                Array.from({ length: rows }).map((_, index) => (
                <CrosswordRow 
                key={index}
                numberOfRow={index}
                characters={answerLetters}
                disallowedGrids={disallowedGrids}
                />
              ))}
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
          onPress={()=>navigation.navigate(crosswordMatchWindow,
            {size:route.params.size,
            level: route.params.level+1
            })}>
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
          <Animated.View style={{transform: [{scale: returnToWordleScreenBtnScale}]}}>
          <Pressable
          onPressIn={()=>{buttonPressIn(returnToWordleScreenBtnScale)}}
          onPressOut={()=>{buttonPressOut(returnToWordleScreenBtnScale)}}
          onPress={()=>navigation.navigate("Crosswords")}
          style={{alignSelf: 'center', marginVertical: 10}}
          >
          <ImageBackground
          source={buttons.tealButton}
          style={[styles.button, {borderRadius: 9}]}
          imageStyle={styles.buttonStyle}
          >
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>  
          <Image source={icons.btnNextMatchIcon} style={{width: 20, height: 20, marginTop: -6}}></Image>  
          <BlackParagraphText style={{paddingVertical: 6, paddingRight: 12, paddingLeft: 6, fontSize: 18, textAlign: 'center', lineHeight: 23}}>{"Return to\nCrossword Screen"}</BlackParagraphText>
          </View>
          </ImageBackground>
          </Pressable>
          </Animated.View>
</View>

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
    </ImageBackground>
    );
    
    else return(
        <GameLoadingAnimation gameLoadingAnimationPrompt="Loading Scores..."/>
    )

function settingsBtnPressed(){
    setSettingsModalVisibility(true);
    
}

function addCoinsBtnPressed(){
    setAddCoinModalVisiblity(true);
}



}




const HeaderText = ({ style, children, ...rest }: TextProps) => {
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

type CrosswordRowProps={
  characters: string[];
  numberOfRow: number;
  disallowedGrids: number[];
}


 const CrosswordRow=(props:CrosswordRowProps)=>{
  const disallowedBoxes=findTheDisAllowedBoxesInTheRow(props.numberOfRow, props.disallowedGrids);
  return (
    <View style={[styles.wordleRow, {gap: 0.5, marginVertical: 0.5}]}>
      {Array.from({ length: cols }).map((_, i) => (
        <View
          key={i}
          style={[styles.wordleBox,
            {
              backgroundColor: disallowedBoxes.includes(i)? 'transparent' :'#e0d9cc',
              borderWidth: disallowedBoxes.includes(i)? 0 : 1,
              borderRadius: 3,
            },
          ]}>
          <Text
            style={styles.crosswordText}>
            { disallowedBoxes.includes(i)?'': getTheAppropriateLetter(props.characters, props.disallowedGrids, props.numberOfRow, i)}
          </Text>
        </View>
      ))}
    </View>
  );

};

function getTheAppropriateLetter(characters: string[], disallowedGrids: number[], row: number, col: number){
    let index=row*rows+col;
    let disallowedGridsCount=0;
  for(let i=0;i<disallowedGrids.length;i++)
    if(disallowedGrids[i]<=index)
    disallowedGridsCount++;

  index=index-disallowedGridsCount;
  return characters[index];
}

function findTheDisAllowedBoxesInTheRow(row: number, disallowedGrids: number[]){
    const columnsToConsider=[];
    for(let i=1; i<=cols; i++){
      if(disallowedGrids.includes(i+(row)*cols))
        columnsToConsider.push(i-1);
    } 
    return columnsToConsider;
}