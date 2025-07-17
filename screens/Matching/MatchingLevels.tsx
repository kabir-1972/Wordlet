import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useEffect, useState, useRef} from "react";
import { View, ImageBackground, FlatList, Pressable, Animated, Image } from "react-native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { styles } from "../../source/styles/inlevel-screen-styles";
import { SettingsData } from "../Settings";
import { WordleText } from "../Skip-Game-Modal";
import { buttons, modalBackgrounds } from "../../source/styles/assets";
import { styles as moreStyles } from "../../source/styles/crossword-levels-style";
import { HeaderForMatchEnd } from "../Components-For-End-Match";
import { getTheMaxXpForNextLevel, ProfileData, readProfileDataFile, saveProfileDataToFile } from "../AccessProfileData";
import { _targetWord } from "../Wordle/Wordle-Match-End";
import { buttonPressIn, buttonPressOut } from "../../source/styles/allAnimations";
import { MatchingGameInfoModal, ModalContentText } from "./Matching-Header-inmatch";
import { Rewards} from "../../source/styles/crosswords-modals-styles";
import { NoOfLevels, Rewards as RewardsData } from "../Rewards";

import { getTheListofLevelsCleared } from "./Matching-Data-Files";
import LottieView from "lottie-react-native";

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'MatchingLevels'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
let coins: number;
let xp: number;
let numberOfLevels: number;
const MatchingLevels=()=>{
    //const route = useRoute<CrosswordMatchRouteProp>();
    /*const route={
        params:{
            size : 1,
            level: 1
        }
    }*/
    coins = RewardsData.Matching.coins; xp= RewardsData.Matching. xp;
    numberOfLevels=NoOfLevels.CryptoGram/5;

    const data = Array.from({ length: numberOfLevels }, (_, i) => ({ id: i }));
    const navigation = useNavigation<NavigationProp>();
    //const [routeParameterAndProfileRead, setRouteParameterAndProfileRead]=useState(false);
    const gameName="Matching";

    const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
    });

    const [maxXp, setMaxXp]=useState(60);
    const [xpPercent, setXpPercent]=useState("0%");
    const experiencePointsBarRef=useRef<View>(null);
    const coinsBarRef=useRef<View>(null);

    useEffect(()=>{
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

    loadProfileData();
    },[])
  const animatedScales = useRef(data.map(() => new Animated.Value(1))).current;
  const scaleHeaderBtn = useRef(new Animated.Value(1)).current;
  const [gameInfoModalVisiblity, setGameInfoModal]=useState(false);  

  const pairedData = [];
    for (let i = 0; i < data.length; i += 2) 
    pairedData.push([data[i], data[i + 1]]);
    
  const hideGameInfoModal=()=>{setGameInfoModal(false)};
  const [listOfLevelsCleared, setListOfLevelsCleared]=useState<number[]>([]);

const levelHeadingButtons = useRef(
  Array.from({ length: 5 }, () => new Animated.Value(1))
).current;
  

  const [selectedHeading, setSelectedHeading]=useState(0);
  
  useEffect(()=>{
    async function setUpListOfLevelsCleared(){
      const _listOfLevelsCleared=await getTheListofLevelsCleared(selectedHeading);
      setListOfLevelsCleared(_listOfLevelsCleared);
    }
    setUpListOfLevelsCleared();
  },[selectedHeading])


  if(/*routeParameterAndProfileRead&&*/listOfLevelsCleared)  
  return(
  <ImageBackground
        source={SettingsData.background}
        style={styles.background}
        resizeMode="cover"
  >
  <HeaderForMatchEnd
        profileData={profileData}
        setXpPercent={setXpPercent}
        xpPercent={xpPercent}
        maxXp={maxXp}
        experiencePointsBarRef={experiencePointsBarRef}
        coinsBarRef={coinsBarRef}
        _xps={0}
  />

  <Animated.View style={{transform: [{scale: scaleHeaderBtn}]}}>  
  <Pressable style={{alignSelf: 'center', marginBottom: 12}}
    onPressIn={()=>buttonPressIn(scaleHeaderBtn)}
    onPressOut={()=>buttonPressOut(scaleHeaderBtn)}
    onPress={()=>setGameInfoModal(true)}
  >
    <ImageBackground
    source={buttons.pinkButton}
    style={[styles.button, {width: 100}]}
    imageStyle={styles.bgImage}
    >
      <View style={{paddingVertical: 6}}>
      <WordleText style={{fontSize: 18, textAlign: 'center'}}>{gameName}</WordleText>
      </View>
    </ImageBackground>
  </Pressable>
  </Animated.View>

  <View style={moreStyles.levelHeaderParagraph}>
    <ModalContentText>A total of {numberOfLevels*5} levels of Matchings are presented here. You can play any level as you want and leave the game keeping the data saved. The rewards for winning each of the game is:</ModalContentText>
    <Rewards coins={coins.toString()} xp={xp.toString()}></Rewards>
    <ModalContentText style={{textAlign: 'center'}}>Levels Cleared: {listOfLevelsCleared.length} / {numberOfLevels*5}</ModalContentText>
  </View>

  <View style={styles.levelHeading}>
   <Animated.View style={selectedHeading==0?{transform: [{scale: 0.9}]}: {transform: [{scale: levelHeadingButtons[0]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(levelHeadingButtons[0])}
        onPressOut={()=>buttonPressOut(levelHeadingButtons[0])}
        onPress={()=>{setSelectedHeading(0)}}
        >
    <ImageBackground
    source={buttons.goldenButton}
    style={styles.levelHeadingImg}
    imageStyle={styles.bgLevelHeadingImage}>
        <WordleText style={styles.levelHeadingText}>a</WordleText>
    </ImageBackground>
        </Pressable>
    {selectedHeading==0?<View style={styles.selectedHeading}></View>: null}    
    </Animated.View>

    <Animated.View style={selectedHeading==1?{transform: [{scale: 0.9}]}: {transform: [{scale: levelHeadingButtons[1]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(levelHeadingButtons[1])}
        onPressOut={()=>buttonPressOut(levelHeadingButtons[1])}
        onPress={()=>{setSelectedHeading(1)}}
        >
        <ImageBackground
    source={buttons.goldenButton}
    style={styles.levelHeadingImg}
    imageStyle={styles.bgLevelHeadingImage}>
        <WordleText style={styles.levelHeadingText}>b</WordleText>
    </ImageBackground>
        </Pressable>
    {selectedHeading==1?<View style={styles.selectedHeading}></View>: null}
    </Animated.View>

    <Animated.View style={selectedHeading==2?{transform: [{scale: 0.9}]}: {transform: [{scale: levelHeadingButtons[2]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(levelHeadingButtons[2])}
        onPressOut={()=>buttonPressOut(levelHeadingButtons[2])}
        onPress={()=>{setSelectedHeading(2)}}
        >    
        <ImageBackground
    source={buttons.goldenButton}
    style={styles.levelHeadingImg}
    imageStyle={styles.bgLevelHeadingImage}>
        <WordleText style={styles.levelHeadingText}>c</WordleText>
        </ImageBackground>
        </Pressable>
    {selectedHeading==2?<View style={styles.selectedHeading}></View>: null}
        </Animated.View>

    <Animated.View style={selectedHeading==3?{transform: [{scale: 0.9}]}: {transform: [{scale: levelHeadingButtons[3]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(levelHeadingButtons[3])}
        onPressOut={()=>buttonPressOut(levelHeadingButtons[3])}
        onPress={()=>{setSelectedHeading(3)}}
        >
        <ImageBackground
    source={buttons.goldenButton}
    style={styles.levelHeadingImg}
    imageStyle={styles.bgLevelHeadingImage}>
        <WordleText style={styles.levelHeadingText}>d</WordleText>
    </ImageBackground>
    </Pressable>
    {selectedHeading==3?<View style={styles.selectedHeading}></View>: null}
    </Animated.View>

<Animated.View style={selectedHeading==4?{transform: [{scale: 0.9}]}: {transform: [{scale: levelHeadingButtons[4]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(levelHeadingButtons[4])}
        onPressOut={()=>buttonPressOut(levelHeadingButtons[4])}
        onPress={()=>{setSelectedHeading(4)}}
        >
        <ImageBackground
    source={buttons.goldenButton}
    style={styles.levelHeadingImg}
    imageStyle={styles.bgLevelHeadingImage}>
        <WordleText style={styles.levelHeadingText}>e</WordleText>
    </ImageBackground>
    </Pressable>
    {selectedHeading==4?<View style={styles.selectedHeading}></View>: null}
</Animated.View>

  </View>
  {
  <FlatList
  data={pairedData}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item: pair, index }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 20 }}>
      {pair.map((item, i) => (
        item && (
          <Animated.View
            key={item.id}
            style={{ transform: [{ scale: animatedScales[item.id] }] }}
          >
            <Pressable
              onPressIn={() => buttonPressIn(animatedScales[item.id])}
              onPressOut={() => buttonPressOut(animatedScales[item.id])}
              onPress={() =>
                navigation.navigate('MatchingMatch', {
                  level: item.id + 1,
                  heading: selectedHeading + 1
                })
              }
            >
              <View style={{ alignSelf: 'center', margin: 2, borderRadius: 8, borderWidth: 1 }}>
                <ImageBackground
                  source={buttons.wideWhiteButton}
                  style={{ height: 50, aspectRatio: 3, alignItems: 'center', justifyContent: 'center' }}
                  imageStyle={{ resizeMode: 'stretch' }}
                >
                  <View style={moreStyles.levelContainer}>
                    <View style={{ flex: 1 }}>
                      <WordleText style={{ textAlign: 'center' }}>Level {item.id + 1}</WordleText>
                    </View>
                    <View style={moreStyles.verticalBar}></View>
                    {
                      listOfLevelsCleared.includes(item.id+1)&&
                      <LottieView
                      source={require("./../../assets/animations/rotating-tick-mark.json")}
                      style={{width: 10, height: 10, transform:[{scale: 3}], marginRight: 10}}
                      autoPlay={true}
                      />
                    }
                  </View>
                </ImageBackground>
              </View>
            </Pressable>
          </Animated.View>
        )
      ))}
    </View>
  )}
    />
}
  <MatchingGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={gameName}
    />
    </ImageBackground>
  )
}

export default MatchingLevels;
