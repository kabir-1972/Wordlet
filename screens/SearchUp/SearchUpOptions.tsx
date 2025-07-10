// image={basicWordleImage} would be changed... 
import { RouteProp } from "@react-navigation/native";
import React, {useRef, useState, useEffect} from 'react';
import {View, ImageBackground, ScrollView, ImageSourcePropType} from 'react-native';
import {styles, WordleScreenButtons} from '../../source/styles/ingame-screen-styles.tsx';
import { ModalForSearchUp } from './SearchUpModals.tsx';
import {buttons,modalBackgrounds} from "../../source/styles/assets.tsx";
import { HeaderForMatchEnd } from './../Components-For-End-Match.tsx';
import { ProfileData, saveProfileDataToFile, readProfileDataFile, getTheMaxXpForNextLevel} from './../AccessProfileData';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsData } from "./../Settings.tsx";
import { getTheListofLevelsCleared } from "./SearchUp-Data-Files";

const basicMoreGamesImage = require('../../source/images/homepage-icons/icon-1.jpg');

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'SearchUpOptions'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const elNormalisData={  
    heading : "El Normalis",
    headingColor: "#870319",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton,
    gameType: "normal"
};


const elReversicoData={  
    heading : "El Reversico",
    headingColor: "#000080",
    bgImage: modalBackgrounds.blueModalBackgroundImg, 
    difficultyTabImage: buttons.greenButton,
    partsOfSpeechTabImage: buttons.redButton,
    gameType: "reverse"
};

const elDiagnoloData={  
    heading : "El Diagnolo",
    headingColor: "#ffffff",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.yellowButton,
    gameType: "diagonal"
};

const labyrinthData={  
    heading : "Labyrinth Inn",
    headingColor: "#000080",
    bgImage: modalBackgrounds.tealModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton,
    gameType: "labyrinth"
};

export interface LevelsCleared {
  easy: number;
  intermediate: number;
  hard: number;
  advanced: number
}

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
          headingColor: "",
          heading: "",
          bgImage:{} as ImageSourcePropType,
          difficultyTabImage:{} as ImageSourcePropType,
          partsOfSpeechTabImage:{} as ImageSourcePropType,
          gameMode: "",
          gameType: "",
          levelsCleared:{} as LevelsCleared
    });
    
    const showMoreGamesModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          isMultiplayer?: boolean,
          gameMode: string,
          gameType: string,
          levelsCleared: LevelsCleared
    })=>{
        setModalData(data);
        setModalVisible(true); 
      };
    
    const hideMoreGamesModal = () => {
        setModalVisible(false);
    };

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
    const [xps, setXps]=useState(0);

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
    
  const [normalLevelsCleared, setNormalLevelsCleared]=useState({easy: 0, intermediate: 0, hard: 0, advanced: 0});
  const [reverseLevelsCleared, setReverseLevelsCleared]=useState({easy: 0, intermediate: 0, hard: 0, advanced: 0});
  
  useEffect(()=>{

    async function getTheLevelClearedDataForSearchup(){
      const normalScores=await createTheQuadrupleArray('Normal');
      const reverseScores=await createTheQuadrupleArray('Reverse');
      
      setNormalLevelsCleared(normalScores);
      setReverseLevelsCleared(reverseScores);
    }

    async function createTheQuadrupleArray(gameType: string){
      const easyList=await getTheListofLevelsCleared(gameType, 'Easy');
      const intermediateList=await getTheListofLevelsCleared(gameType, 'Intermediate');
      const hardList=await getTheListofLevelsCleared(gameType, 'Hard');
      const advancedList=await getTheListofLevelsCleared(gameType, 'Advanced');
      return {easy: easyList.length, intermediate: intermediateList.length, hard: hardList.length, advanced: advancedList.length};
    }

    getTheLevelClearedDataForSearchup();
    
  },[])

  return(
  <ImageBackground
        source={SettingsData.background}
        style={styles.background}
        resizeMode="cover"
      > 
  <ScrollView contentContainerStyle={{ paddingBottom: 50 }}> 
    <HeaderForMatchEnd
        profileData={profileData}
        setXpPercent={setXpPercent}
        xpPercent={xpPercent}
        maxXp={maxXp}
        experiencePointsBarRef={experiencePointsBarRef}
        coinsBarRef={coinsBarRef}
        _xps={xps}
  />
  <View style={styles.container}>
    <WordleScreenButtons
    preHeadingColor="#880808"
    postHeadingColor="0c0c0c"
    descriptionTextColor="0c0c0c" 
    preHeading="El "
    heading="Normalis"
    description="A normal word search puzzle. No diagonals. No reverse."
    image={basicMoreGamesImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{
      showMoreGamesModal({
      headingColor: elNormalisData.headingColor,
      heading: elNormalisData.heading,
      bgImage: elNormalisData.bgImage,
      difficultyTabImage: elNormalisData.difficultyTabImage,
      partsOfSpeechTabImage: elNormalisData.partsOfSpeechTabImage,
      gameMode: '1',
      gameType: 'normal',
      levelsCleared: normalLevelsCleared
    });}}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}> 
    <WordleScreenButtons 
    preHeadingColor="#000080"
    postHeadingColor="#0c0c0c"
    descriptionTextColor="#404040" 
    preHeading="El "
    heading="Reversico"
    description="Word Search but as you guessed... it can have letters arranged in reverse."
    image={basicMoreGamesImage}
    bgImage={buttons.blueButton}
    onPress={()=>{
      showMoreGamesModal({
      headingColor: elReversicoData.headingColor,
      heading: elReversicoData.heading,
      bgImage: elReversicoData.bgImage,
      difficultyTabImage: elReversicoData.difficultyTabImage,
      partsOfSpeechTabImage: elReversicoData.partsOfSpeechTabImage,
      gameMode: '2',
      gameType: 'reverse',
      levelsCleared: normalLevelsCleared
    });
    }
    }>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="El "
    heading="Diagnolo"
    description="Usual Word Search games, but with diagonals too."
    image={basicMoreGamesImage}
    bgImage={buttons.redButton}
    onPress={()=>{showMoreGamesModal({
      headingColor: elDiagnoloData.headingColor,
      heading: elDiagnoloData.heading,
      bgImage: elDiagnoloData.bgImage,
      difficultyTabImage: elDiagnoloData.difficultyTabImage,
      partsOfSpeechTabImage: elDiagnoloData.partsOfSpeechTabImage,
      gameMode: '3',
      gameType: 'diagonal',
      levelsCleared: reverseLevelsCleared
    });
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#006400"
    postHeadingColor="#006400"
    descriptionTextColor="#015a57" 
    preHeading="Labyrinth "
    heading="Inn"
    description="Word Search that you know nothing about. Just brainstorming..."
    image={basicMoreGamesImage}
    bgImage={buttons.tealButton}
    onPress={()=>{showMoreGamesModal({
      headingColor: labyrinthData.headingColor,
      heading: labyrinthData.heading,
      bgImage: labyrinthData.bgImage,
      difficultyTabImage: labyrinthData.difficultyTabImage,
      partsOfSpeechTabImage: labyrinthData.partsOfSpeechTabImage,
      isMultiplayer: true,
      gameMode: '4',
      gameType: 'labyrinth',
      levelsCleared: normalLevelsCleared
    });
  }}>
    </WordleScreenButtons>
  </View>

  </ScrollView>
  <ModalForSearchUp
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideMoreGamesModal}
    visible={modalVisible}
    gameMode={parseInt(modalData.gameMode)}
    gameType={modalData.gameType}
    levelsCleared={modalData.levelsCleared}
  ></ModalForSearchUp>
  </ImageBackground>
);}

export default App;
