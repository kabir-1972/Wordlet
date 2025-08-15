// image={basicWordleImage} would be changed... 
import { RouteProp, useRoute } from "@react-navigation/native";
import React, {useRef, useState, useEffect} from 'react';
import {View, ImageBackground, ScrollView, ImageSourcePropType} from 'react-native';
import {styles, WordleScreenButtons} from '../source/styles/ingame-screen-styles.tsx';
import { ModalForAnagrammist, ModalForConnectico, ModalForGapFills, ModalForWordLadder, ModalForWordChain, ModalForWicWacWoe} from './MoreGamesModals.tsx';
import {buttons,modalBackgrounds} from "../source/styles/assets.tsx";
import { HeaderForMatchEnd } from './Components-For-End-Match.tsx';
import { ProfileData, saveProfileDataToFile, readProfileDataFile, getTheMaxXpForNextLevel} from './AccessProfileData.tsx';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SettingsData } from "./Profile2.tsx";
import { getTheNumberofLevelsCleared as noOfLevelsInAnagrams } from "./Anagrammist/Anagrammist-Data-Files.ts";
import { getTheNumberofLevelsCleared as noOfLevelsInGapFills } from "./GapFills/Gapfills-Data-Files.ts";
import { getTheNumberofLevelsCleared as noOfLevelsInWordLadder } from "./WordLadder/WordLadder-Data-Files.ts";



const basicMoreGamesImage = require('../source/images/homepage-icons/icon-1.jpg');

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'MoreGames'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;


const connecticoData={  
    heading : "Connectico",
    headingColor: "#870319",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton
};

const anagramistData={  
    heading : "The Anagramist",
    headingColor: "#ffffff",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.yellowButton  
};

const gapFillsData={  
    heading : "Gap Fills",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.violetModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};

const wordLadderData={  
    heading : "Word Ladder",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.pinkModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const wordChainsData={  
    heading : "Word Chains",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const wicwacwoeData={  
    heading : "Wic Wac Woe",
    headingColor: "#4f0207",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const App = () => {
    const [connecticoModalVisible, setConnecticoModalVisible] = useState(false);
    const [anagrammistModalVisible, setAngrammistModalVisible] = useState(false);
    const [gapFillsModalVisible, setGapFillsModalVisible] = useState(false);
    const [wordLadderModalVisible, setWordLadderModalVisible]=useState(false);
    
    const [wordChainModalVisible, setWordChainModalVisible]=useState(false);
    const [wicWacWoeModalVisible, setWicWacWoeModalVisible]=useState(false);

    /**/

    const [numberOfAnagramLevelsCleared, setNumberOfAnagramLevelsCleared] = useState<number[]>([]);
    const [numberOfGapFillsCleared, setNumberOfGapFillsCleared] = useState<number[]>([]);
    const [numberOfWordLadderCleared, setNumberOfWordLadderCleared] = useState<number[]>([]);


useEffect(() => {
  async function loadNumberOfLevelsClearedForAnagrams() {
    const four_letter = await noOfLevelsInAnagrams(4);
    const five_letter = await noOfLevelsInAnagrams(5);
    const six_letter = await noOfLevelsInAnagrams(6);
    const seven_letter = await noOfLevelsInAnagrams(7);
    const eight_letter = await noOfLevelsInAnagrams(8);
    const nine_letter = await noOfLevelsInAnagrams(9);
    return [four_letter, five_letter, six_letter, seven_letter, eight_letter, nine_letter];
  }

  async function loadNumberOfLevelsClearedForGapFills() {
    const four_letter = await noOfLevelsInGapFills(4);
    const five_letter = await noOfLevelsInGapFills(5);
    const six_letter = await noOfLevelsInGapFills(6);
    const seven_letter = await noOfLevelsInGapFills(7);
    const eight_letter = await noOfLevelsInGapFills(8);
    const nine_letter = await noOfLevelsInGapFills(9);
    return [four_letter, five_letter, six_letter, seven_letter, eight_letter, nine_letter];
  }

  async function loadNumberOfLevelsClearedForWordLadder() {
    const three_letter = await noOfLevelsInWordLadder(3);
    const four_letter = await noOfLevelsInGapFills(4);
    const five_letter = await noOfLevelsInGapFills(5);
    const six_letter = await noOfLevelsInGapFills(6);
    return [three_letter, four_letter, five_letter, six_letter];
  }


  loadNumberOfLevelsClearedForGapFills().then(setNumberOfGapFillsCleared);
  loadNumberOfLevelsClearedForAnagrams().then(setNumberOfAnagramLevelsCleared);
  loadNumberOfLevelsClearedForWordLadder().then(setNumberOfWordLadderCleared);
}, []);

    const [modalData, setModalData] = useState({
          headingColor: "",
          heading: "",
          bgImage:{} as ImageSourcePropType,
          difficultyTabImage:{} as ImageSourcePropType,
          partsOfSpeechTabImage:{} as ImageSourcePropType,
          gameMode: ""
    });
    
    const showConnecticoModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setConnecticoModalVisible(true); 
      };
    
    const hideConnecticoModal = () => {
        setConnecticoModalVisible(false);
    };

    const showAnagrammistModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setAngrammistModalVisible(true); 
      };
    
    const hideAnagrammistModal = () => {
        setAngrammistModalVisible(false);
    };

    const showGapFillModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          gameMode: string
    })=>{
        setModalData(data);
        setGapFillsModalVisible(true); 
    };
    
    const hideGapFillsModal = () => {
        setGapFillsModalVisible(false);
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
        console.log(data);
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
    preHeading="Connec"
    heading="Tico"
    description="Connect each of the jumbled letters to create different words and fill up the puzzle."
    image={basicMoreGamesImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{showConnecticoModal({
      headingColor: connecticoData.headingColor,
      heading: connecticoData.heading,
      bgImage: connecticoData.bgImage,
      difficultyTabImage: connecticoData.difficultyTabImage,
      partsOfSpeechTabImage: connecticoData.partsOfSpeechTabImage,
      gameMode: ''
    });
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}> 
    <WordleScreenButtons 
    preHeadingColor="#000080"
    postHeadingColor="#0c0c0c"
    descriptionTextColor="#404040" 
    preHeading="Search"
    heading="Up"
    description="Find out words among Large Grids of Scrambled Letters."
    image={basicMoreGamesImage}
    bgImage={buttons.blueButton}
    onPress={()=>{
    navigation.navigate('SearchUpOptions');
    }
    }>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="The"
    heading="Anagramist"
    description="Sort out the desired word by clicking the letters of the word in correct order."
    image={basicMoreGamesImage}
    bgImage={buttons.redButton}
    onPress={()=>{showAnagrammistModal({
      headingColor: anagramistData.headingColor,
      heading: anagramistData.heading,
      bgImage: anagramistData.bgImage,
      difficultyTabImage: anagramistData.difficultyTabImage,
      partsOfSpeechTabImage: anagramistData.partsOfSpeechTabImage,
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
    preHeading="Gap "
    heading="Fills"
    description="Fill the gaps and find what the word is."
    image={basicMoreGamesImage}
    bgImage={buttons.violetButton}
    onPress={()=>{showGapFillModal({
      headingColor: gapFillsData.headingColor,
      heading: gapFillsData.heading,
      bgImage: gapFillsData.bgImage,
      difficultyTabImage: gapFillsData.difficultyTabImage,
      partsOfSpeechTabImage: gapFillsData.partsOfSpeechTabImage,
      gameMode: ''
    });
  }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="Word"
    heading="Ladder"
    description="Sort out the desired word by clicking the letters of the word in correct order."
    image={basicMoreGamesImage}
    bgImage={buttons.pinkButton}
    onPress={()=>{showWordLadderModal({
      headingColor: wordLadderData.headingColor,
      heading: wordLadderData.heading,
      bgImage: wordLadderData.bgImage,
      difficultyTabImage: wordLadderData.difficultyTabImage,
      partsOfSpeechTabImage: wordLadderData.partsOfSpeechTabImage,
      gameMode: ''
    });
      
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#006400"
    postHeadingColor="#006400"
    descriptionTextColor="#015a57" 
    preHeading="Cryptograms"
    heading=" "
    description="A puzzle where a message is encrypted using a simple code. And you? Decode it."
    image={basicMoreGamesImage}
    bgImage={buttons.tealButton}
    style={{borderRadius: 18}}
    onPress={()=>{
      navigation.navigate("CryptogramLevels");
  }}>
    </WordleScreenButtons>
  </View>

    <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#2e0500"
    postHeadingColor="#444444"
    descriptionTextColor="#4a2503" 
    preHeading="Word"
    heading="Chains"
    description="Word, Dare, Eager, Rhymic, Chains, Smarter, Repeat..."
    image={basicMoreGamesImage}
    bgImage={buttons.goldenButton}
    style={{borderRadius: 23}}
    onPress={()=>{showWordChainsModal({
      headingColor: wordChainsData.headingColor,
      heading: wordChainsData.heading,
      bgImage: wordChainsData.bgImage,
      difficultyTabImage: wordChainsData.difficultyTabImage,
      partsOfSpeechTabImage: wordChainsData.partsOfSpeechTabImage,
      gameMode: ''
    });
  }}>
    </WordleScreenButtons>
  </View>

    <View style={styles.container}>

    <WordleScreenButtons 
    preHeadingColor="#00232e"
    postHeadingColor="#dddddd"
    descriptionTextColor="#015a57" 
    preHeading="Wic"
    heading="Wac Woe"
    description="A mystery entirely kept secret to you. Why not unlock it yourself?"
    image={basicMoreGamesImage}
    bgImage={buttons.blueButton}
    onPress={()=>{showWicWacWoeModal({
      headingColor: wicwacwoeData.headingColor,
      heading: wicwacwoeData.heading,
      bgImage: wicwacwoeData.bgImage,
      difficultyTabImage: wicwacwoeData.difficultyTabImage,
      partsOfSpeechTabImage: wicwacwoeData.partsOfSpeechTabImage,
      gameMode: ''
    });
  }}>
    </WordleScreenButtons>
  </View>

  </ScrollView>
  <ModalForConnectico
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideConnecticoModal}
    visible={connecticoModalVisible}
    gameMode={modalData.gameMode}
  ></ModalForConnectico>

  {numberOfAnagramLevelsCleared.length>0&&<ModalForAnagrammist
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideAnagrammistModal}
    visible={anagrammistModalVisible}
    levelsCleared={numberOfAnagramLevelsCleared}
  ></ModalForAnagrammist>}

  {numberOfGapFillsCleared.length>0&&<ModalForGapFills
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideGapFillsModal}
    visible={gapFillsModalVisible}
    levelsCleared={numberOfGapFillsCleared}
  ></ModalForGapFills>}


  {numberOfWordLadderCleared.length>0&&<ModalForWordLadder
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideWordLadderModal}
    visible={wordLadderModalVisible}
    levelsCleared={numberOfWordLadderCleared}
  ></ModalForWordLadder>}

  <ModalForWordChain
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideWordChainModal}
    visible={wordChainModalVisible}
    playerLevel={profileData.playerLevel}
    >
  </ModalForWordChain>

  <ModalForWicWacWoe
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideWicWacWoeModal}
    visible={wicWacWoeModalVisible}
    playerLevel={profileData.playerLevel}
    >
  </ModalForWicWacWoe>
  </ImageBackground>
);}

export default App;
