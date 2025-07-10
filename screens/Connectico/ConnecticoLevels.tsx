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
import { CrosswordGameInfoModal, ModalContentText } from "./Connectico-Header-inmatch";
import { Rewards} from "../../source/styles/crosswords-modals-styles";
import { NoOfLevels, Rewards as RewardsData } from "../Rewards";

import { getTheListofLevelsCleared } from "./Connectico-Data-Files";
import LottieView from "lottie-react-native";

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'ConnecticoLevels'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
let coins: number;
let xp: number;
let numberOfLevels: number;
const ConnecticoLevels=()=>{
    const route = useRoute<CrosswordMatchRouteProp>();
    /*const route={
        params:{
            size : 1,
            level: 1
        }
    }*/
    switch(route.params.size){
      case 1: coins = RewardsData.Connectico.easy.coin; xp= RewardsData.Connectico.easy. xp; numberOfLevels=NoOfLevels.Connectico.easy; break;
      case 2: coins = RewardsData.Connectico.intermediate.coin; xp= RewardsData.Connectico.intermediate. xp; numberOfLevels=NoOfLevels.Connectico.intermediate; break;
      case 3: coins = RewardsData.Connectico.hard.coin; xp= RewardsData.Connectico.hard. xp; numberOfLevels=NoOfLevels.Connectico.hard; break;
      case 4: coins = RewardsData.Connectico.advanced.coin; xp= RewardsData.Connectico.advanced. xp; numberOfLevels=NoOfLevels.Connectico.advanced; break;
      default: coins = RewardsData.Connectico.easy.coin; xp= RewardsData.Connectico.easy. xp; numberOfLevels=NoOfLevels.Connectico.easy; break;
    }
    const data = Array.from({ length: numberOfLevels }, (_, i) => ({ id: i }));
    const navigation = useNavigation<NavigationProp>();
    const [routeParameterAndProfileRead, setRouteParameterAndProfileRead]=useState(false);
    const [gameMode, setGameMode]=useState("");
    const gameName="Connectico";

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
      const size=route.params.size;
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
    async function setUpListOfLevelsCleared(){
      const _listOfLevelsCleared=await getTheListofLevelsCleared(gameMode);
      setListOfLevelsCleared(_listOfLevelsCleared);
      console.log(_listOfLevelsCleared);
    }
    setUpListOfLevelsCleared();
  },[gameMode])


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
    <ModalContentText>A total of {numberOfLevels} levels of Connecticos are presented here. You can play any level as you want and leave the game keeping the data saved. The rewards for winning each of the game is:</ModalContentText>
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
                navigation.navigate('ConnecticoMatch', {
                  difficulty: route.params.size,
                  level: item.id + 1,
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
  <CrosswordGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={gameName}
    />
    </ImageBackground>
  )
}

export default ConnecticoLevels;
