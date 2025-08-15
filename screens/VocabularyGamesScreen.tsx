// image={basicWordleImage} would be changed... 
import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useRef, useState, useEffect} from 'react';
import {View, ImageBackground, ScrollView, ImageSourcePropType} from 'react-native';
import {styles, WordleScreenButtons} from '../source/styles/ingame-screen-styles.tsx';
import { ModalForFlashCard, ModalForOrtographia} from './VocabularyGamesModals.tsx';
import {buttons,modalBackgrounds} from "../source/styles/assets.tsx";
import { HeaderForMatchEnd } from './Components-For-End-Match.tsx';
import { ProfileData, saveProfileDataToFile, readProfileDataFile, getTheMaxXpForNextLevel} from './AccessProfileData.tsx';
import { RootStackParamList } from '../types.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SettingsData } from "./Profile2.tsx";

const basicVocabularyGamesImage = require('../source/images/homepage-icons/icon-1.jpg');

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'VocabularyGames'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const flashCardData={  
    heading : "Flash Cards",
    headingColor: "#ffffff",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.yellowButton  
};

const ortographiaData={  
    heading : "Orto Graphia",
    headingColor: "#222222",
    bgImage: modalBackgrounds.tealModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};

const wordLadderData={  
    heading : "The Satietas",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.pinkModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const wordChainsData={  
    heading : "La Collectico",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const App = () => {
    const [flashCardModalVisible, setFlashCardModalVisible] = useState(false);
    const [ortographiaModalVisible, setOrtographiaModalVisible] = useState(false);
    const [wordLadderModalVisible, setWordLadderModalVisible]=useState(false);
    
    const [wordChainModalVisible, setWordChainModalVisible]=useState(false);
    const [wicWacWoeModalVisible, setWicWacWoeModalVisible]=useState(false);


    const [modalData, setModalData] = useState({
          headingColor: "",
          heading: "",
          bgImage:{} as ImageSourcePropType,
          difficultyTabImage:{} as ImageSourcePropType,
          partsOfSpeechTabImage:{} as ImageSourcePropType,
          gameMode: ""
    });
    
    const showFlashCardModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setFlashCardModalVisible(true); 
      };
    
    const hideFlashCardModal = () => {
        setFlashCardModalVisible(false);
    };

    const showOrtographiaModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setOrtographiaModalVisible(true); 
    };
    
    const hideOrtographiaModal = () => {
        setOrtographiaModalVisible(false);
    };

    const showWordLadderModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setWordLadderModalVisible(true); 
    };

    const hideWordLadderModal = () => {
        setWordLadderModalVisible(false);
    };

    const showWordChainsModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setWordChainModalVisible(true); 
    };

    const hideWordChainModal = () => {
        setWordChainModalVisible(false);
    };

    const showWicWacWoeModal=(data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setWicWacWoeModalVisible(true); 
    };

    const hideWicWacWoeModal = () => {
      setWicWacWoeModalVisible(false);
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
    preHeading="Boggle"
    heading=""
    description="Find the words from the square grid."
    image={basicVocabularyGamesImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{
      navigation.navigate("BoggleLevels");
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}> 
    <WordleScreenButtons 
    preHeadingColor="#000080"
    postHeadingColor="#0c0c0c"
    descriptionTextColor="#404040" 
    preHeading="Matching"
    heading=""
    description="Match the words from one column to the other."
    image={basicVocabularyGamesImage}
    bgImage={buttons.blueButton}
    onPress={()=>{
    navigation.navigate('MatchingLevels');
    }
    }>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="Flash"
    heading="Cards"
    description="Create, Share and Use Flashcards as you need them. Not only vocabulary, but for any purposes."
    image={basicVocabularyGamesImage}
    bgImage={buttons.redButton}
    onPress={()=>{showFlashCardModal({
      headingColor: flashCardData.headingColor,
      heading: flashCardData.heading,
      bgImage: flashCardData.bgImage,
      difficultyTabImage: flashCardData.difficultyTabImage,
      partsOfSpeechTabImage: flashCardData.partsOfSpeechTabImage,
      gameMode: ''
    });
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#0d0d0d"
    postHeadingColor="#550055"
    descriptionTextColor="#ffe4e1" 
    preHeading="The"
    heading="Satietas"
    description="Fill the gaps with letters and find what the word is."
    image={basicVocabularyGamesImage}
    bgImage={buttons.violetButton}
    onPress={()=>{
      
  }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="La"
    heading="Collectico"
    description="Collect synonyms or antonyms of words from a big scrambled pile."
    image={basicVocabularyGamesImage}
    bgImage={buttons.pinkButton}
    onPress={()=>{
      navigation.navigate("CollecticoMatch");
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#036b56" 
    preHeading="Orto"
    heading="Graphia"
    description="Spellings...something that is a plus for your vocabs"
    image={basicVocabularyGamesImage}
    bgImage={buttons.tealButton}
    onPress={()=>{
      showOrtographiaModal({
      headingColor: ortographiaData.headingColor,
      heading: ortographiaData.heading,
      bgImage: ortographiaData.bgImage,
      difficultyTabImage: ortographiaData.difficultyTabImage,
      partsOfSpeechTabImage: ortographiaData.partsOfSpeechTabImage,
      gameMode: ''
    });
    }}>
    </WordleScreenButtons>
  </View>

  </ScrollView>

  <ModalForFlashCard
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideFlashCardModal}
    visible={flashCardModalVisible}
    >
  </ModalForFlashCard>

{   <ModalForOrtographia
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideOrtographiaModal}
    visible={ortographiaModalVisible}
    >
  </ModalForOrtographia>}

  </ImageBackground>
);}

export default App;
