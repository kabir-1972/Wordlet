import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useEffect, useState, useRef} from "react";
import { View, ImageBackground, FlatList, Pressable, Animated, Image } from "react-native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { styles } from "../../source/styles/inlevel-screen-styles";
import { SettingsData } from "../Settings";
import { WordleText } from "../Skip-Game-Modal";
import { buttons, icons, modalBackgrounds } from "../../source/styles/assets";
import { styles as moreStyles } from "../../source/styles/crossword-levels-style";
import { HeaderForMatchEnd } from "../Components-For-End-Match";
import { getTheMaxXpForNextLevel, ProfileData, readProfileDataFile, saveProfileDataToFile } from "../AccessProfileData";
import { _targetWord } from "../Wordle/Wordle-Match-End";
import { buttonPressIn, buttonPressOut } from "../../source/styles/allAnimations";
import { SearchUpGameInfoModal, ModalContentText } from "./Searchup-Header-inmatch";
import { Rewards} from "../../source/styles/crosswords-modals-styles";
import { NoOfLevels, Rewards as RewardsData } from "../Rewards";

import { getTheListofLevelsCleared } from "./SearchUp-Data-Files";
import LottieView from "lottie-react-native";

export type SearchUpMatchRouteProp = RouteProp<RootStackParamList, 'SearchUpLevels'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
let coins: number;
let xp: number;
let numberOfLevels: number;
const SearchUpLevels=()=>{
    const route = useRoute<SearchUpMatchRouteProp>();
    
    let gameAwardInfo;
    let noOfLevelsInfo;
    
    const [gameMode, setGameMode]=useState("");
    const [gameType, setGameType]=useState("");
    const gameName="SearchUp";


    switch(route.params.gameType){
      case /*"normal"*/1: gameAwardInfo=RewardsData.SearchUp.Normal; noOfLevelsInfo=NoOfLevels.SearchUp.Normal; setGameType("Normal"); break;
      case /*"reverse"*/2: gameAwardInfo=RewardsData.SearchUp.Reverse; noOfLevelsInfo=NoOfLevels.SearchUp.Reverse; setGameType("Reverse"); break;
      case /*"diagonal"*/3: gameAwardInfo=RewardsData.SearchUp.Diagonal; noOfLevelsInfo=NoOfLevels.SearchUp.Diagonal; setGameType("Diagonal"); break;
      case /*"labyrinth"*/4: gameAwardInfo=RewardsData.SearchUp.Labryinth; noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth; setGameType("Labryinth"); break;
      default: gameAwardInfo=RewardsData.SearchUp.Normal; noOfLevelsInfo=NoOfLevels.SearchUp.Labryinth; setGameType("Normal"); break;
    }

    switch(route.params.difficulty){
      case 1: coins = gameAwardInfo.easy.coin; xp= gameAwardInfo.easy. xp; numberOfLevels=noOfLevelsInfo.easy; break;
      case 2: coins = gameAwardInfo.intermediate.coin; xp= gameAwardInfo.intermediate. xp; numberOfLevels=noOfLevelsInfo.intermediate; break;
      case 3: coins = gameAwardInfo.hard.coin; xp= gameAwardInfo.hard. xp; numberOfLevels=noOfLevelsInfo.hard; break;
      case 4: coins = gameAwardInfo.advanced.coin; xp= gameAwardInfo.advanced. xp; numberOfLevels=noOfLevelsInfo.advanced; break;
      default: coins = gameAwardInfo.easy.coin; xp= gameAwardInfo.easy. xp; numberOfLevels=noOfLevelsInfo.easy; break;
    }
    const data = Array.from({ length: numberOfLevels }, (_, i) => ({ id: i }));
    const navigation = useNavigation<NavigationProp>();
    const [routeParameterAndProfileRead, setRouteParameterAndProfileRead]=useState(false);
    


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

    function readRouteParameters(){
      const size=route.params.difficulty;
      
      switch(size){
        case 1: setGameMode("Easy") ;break;
        case 2: setGameMode("Intermediate") ;break;
        case 3: setGameMode("Hard") ;break;
        case 4: setGameMode("Advanced") ;break;
        default: setGameMode("Easy");break;
      }
    }

    loadProfileData();
    readRouteParameters();

    setRouteParameterAndProfileRead(true);
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
    if(gameType==""||gameMode=="")
      return; 
    async function setUpListOfLevelsCleared(){
      const _listOfLevelsCleared=await getTheListofLevelsCleared(gameType, gameMode);
      setListOfLevelsCleared(_listOfLevelsCleared);
    }
    setUpListOfLevelsCleared();
  },[gameType, gameMode])


  if(routeParameterAndProfileRead&&listOfLevelsCleared)  
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
    style={styles.button}
    imageStyle={styles.bgImage}
    >
      <View style={{paddingVertical: 6}}>
      <WordleText style={{fontSize: 18, textAlign: 'center'}}>{gameName}</WordleText>
      <WordleText style={{fontSize: 15, textAlign: 'center', color: '#dedede'}}>{gameMode}</WordleText>
      </View>
    </ImageBackground>
  </Pressable>
  </Animated.View>

  <View style={moreStyles.levelHeaderParagraph}>
    <ModalContentText>A total of {numberOfLevels} levels of SearchUps are presented here. You can play any level as you want and leave the game keeping the data saved. The rewards for winning each of the game is:</ModalContentText>
    <Rewards coins={coins.toString()} xp={xp.toString()}></Rewards>
    <ModalContentText style={{textAlign: 'center'}}>Levels Cleared: {listOfLevelsCleared.length} / {numberOfLevels}</ModalContentText>
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
                navigation.navigate('SearchUpMatch', {
                  difficulty: route.params.difficulty,
                  level: item.id + 1,
                  gameType: route.params.gameType
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
  <SearchUpGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={gameName}
    />
    </ImageBackground>
  )
}

export default SearchUpLevels;
