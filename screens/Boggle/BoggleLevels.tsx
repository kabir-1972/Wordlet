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
import { BoggleGameInfoModal, ModalContentText } from "./Boggle-Header-inmatch";
import { Rewards} from "../../source/styles/crosswords-modals-styles";
import { NoOfLevels, Rewards as RewardsData } from "../Rewards";

import { getTheListofLevelsCleared } from "./Boggle-Data-Files";
import LottieView from "lottie-react-native";

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'BoggleLevels'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
let coins: number;
let xp: number;
let numberOfLevels: number;
const BoggleLevels=()=>{
    //coins = RewardsData.Boggle.coins; xp= RewardsData.Boggle.xp;
    numberOfLevels=NoOfLevels.CryptoGram/5;

    const data = Array.from({ length: numberOfLevels }, (_, i) => ({ id: i }));
    const navigation = useNavigation<NavigationProp>();
    const gameName="Boggle";

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
  

  
  useEffect(()=>{
    async function setUpListOfLevelsCleared(){
      const _listOfLevelsCleared=await getTheListofLevelsCleared();
      setListOfLevelsCleared(_listOfLevelsCleared);
    }
    setUpListOfLevelsCleared();
  },[])


  if(listOfLevelsCleared)  
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
    <ModalContentText>A total of {200} levels of Boggles are presented here. You can play any level as you want and leave the game keeping the data saved. </ModalContentText>
    <ModalContentText style={{textAlign: 'center'}}>Levels Cleared: {listOfLevelsCleared.length} / {numberOfLevels*5}</ModalContentText>
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
                navigation.navigate('BoggleMatch', {level: item.id + 1})
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
  <BoggleGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={gameName}
    />
    </ImageBackground>
  )
}

export default BoggleLevels;
