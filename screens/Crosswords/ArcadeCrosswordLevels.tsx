import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useEffect, useState, useRef} from "react";
import { View, ImageBackground, FlatList, Pressable, Animated } from "react-native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { styles } from "../../source/styles/inlevel-screen-styles";
import { SettingsData } from "../Profile2";
import { WordleText } from "../Skip-Game-Modal";
import { buttons, modalBackgrounds } from "../../source/styles/assets";
import { styles as moreStyles } from "../../source/styles/crossword-levels-style";
import { HeaderForMatchEnd } from "../Components-For-End-Match";
import { getTheMaxXpForNextLevel, ProfileData, readProfileDataFile, saveProfileDataToFile } from "../AccessProfileData";
import { _targetWord } from "../Wordle/Wordle-Match-End";
import { buttonPressIn, buttonPressOut } from "../../source/styles/allAnimations";
import { getTheWordAndFirstSolveData } from "./Crossword-Data-Files";
import { CrosswordGameInfoModal, ModalContentText } from "./Crossword-Header-inmatch";
import { Rewards} from "../../source/styles/crosswords-modals-styles";


export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'ArcadeCrosswordLevels'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
let rows: number;
let cols: number;

const ArcadeCrosswordLevels=()=>{
    const route = useRoute<CrosswordMatchRouteProp>();
    const numberOfLevels=100;
    const data = Array.from({ length: numberOfLevels }, (_, i) => ({ id: i }));
    const navigation = useNavigation<NavigationProp>();
    const [routeParameterAndProfileRead, setRouteParameterAndProfileRead]=useState(false);
    const [arcadeLevelString, setArcadeLevelString]=useState("");

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
        case 1: setArcadeLevelString("Easy 5x5"); rows=cols=5;break;
        case 2: setArcadeLevelString("Intermediate 6x6"); rows=cols=6;break;
        case 3: setArcadeLevelString("Hard 7x7"); rows=cols=7;break;
        case 4: setArcadeLevelString("Advanced 8x8"); rows=cols=8;break;
        case 5: setArcadeLevelString("Extreme 9x9"); rows=cols=9;break;
        case 6: setArcadeLevelString("Insane 10x10"); rows=cols=10;break;
        default: setArcadeLevelString("Easy 5x5"); rows=cols=5;break;
      }
    }

    loadProfileData();
    readRouteParameters();

    setRouteParameterAndProfileRead(true);
    },[])
  const animatedScales = useRef(data.map(() => new Animated.Value(1))).current;
  const scaleHeaderBtn = useRef(new Animated.Value(1)).current;
  const [gameInfoModalVisiblity, setGameInfoModal]=useState(false);  

  const hideGameInfoModal=()=>{setGameInfoModal(false)}
  const gameName="Arcade Crossword";
  if(routeParameterAndProfileRead)  
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
  <Pressable style={{alignSelf: 'center'}}
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
      <WordleText style={{fontSize: 15, textAlign: 'center', color: '#dedede'}}>{arcadeLevelString}</WordleText>
      </View>
    </ImageBackground>
  </Pressable>
  </Animated.View>

  <View style={moreStyles.levelHeaderParagraph}>
    <ModalContentText>A total of 100 levels of 5x5 arcade crosswords are presented here. You can play any level as you want and leave the game keeping the data saved. The rewards for winning each of the game is:</ModalContentText>
    <Rewards coins={"25"} xp={"30"}></Rewards>
  </View>
  {rows&&cols&&
  <FlatList
    data={data}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item, index }) => (
      <Animated.View style={{transform: [{scale: animatedScales[index]}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(animatedScales[index])}
        onPressOut={()=>buttonPressOut(animatedScales[index])}
        onPress={()=>{navigation.navigate('ArcadeCrosswordMatch',{
          size: route.params.size,
          level: (item.id+1)
        })}}
        >
      <View style={{alignSelf: 'center', marginVertical: 2, borderRadius: 8, borderWidth: 1, marginHorizontal: 5}}>
        <ImageBackground
        source={buttons.wideWhiteButton}
        style={{height: 50, aspectRatio: 6, alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch'}}
        >
            <View style={moreStyles.levelContainer}>
                <View style={{flex: 1}}><WordleText style={{textAlign: 'center'}}>Level {item.id+1}</WordleText></View>
                <View style={moreStyles.verticalBar}></View>
                <CrosswordItem level={item.id+1} rows={rows} cols={cols}/>
                
            </View>
        </ImageBackground>
      </View>
      </Pressable>
      </Animated.View>
    )}
    initialNumToRender={20}
    maxToRenderPerBatch={20}
    windowSize={10}
  />}
  <CrosswordGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={gameName}
    />
    </ImageBackground>
  )
}

export default ArcadeCrosswordLevels;

type Props = {
  level: number;
  rows: number;
  cols: number;
};

type WordData = {
  words: number;
  firstSolve: string;
};

const CrosswordItem: React.FC<Props> = ({ level, rows, cols }) => {
  const [data, setData] = useState<WordData | null>(null);

  useEffect(() => {
    let isMounted = true;
    getTheWordAndFirstSolveData(rows, cols, 'arcade', level)
      .then(result => {
        if (isMounted&&result) setData(result);
      });
    return () => { isMounted = false };
  }, [level, rows, cols]);

  if (!data) return null;

  return (
    <View style={{flexDirection: 'row', gap: 10, marginHorizontal: 10}}>
      <View>
        <WordleText style={{ color: '#606060', fontSize: 14 }}>Total Words</WordleText>
        <WordleText style={{ color: '#606060', fontSize: 14, textAlign: 'center' }}>{data.words}</WordleText>
      </View>
      <View>
        <WordleText style={{ color: '#606060', fontSize: 14 }}>First Solve</WordleText>
        <WordleText style={{ color: '#606060', fontSize: 14, textAlign: 'center' }}>{data.firstSolve==""?"---":data.firstSolve}</WordleText>
      </View>
    </View>
  );
};