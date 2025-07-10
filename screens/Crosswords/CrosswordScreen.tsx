// image={arcadeCrosswordImage} would be changed... 
 
import React, {useState} from 'react';
import {View, ImageBackground, ScrollView, ImageSourcePropType} from 'react-native';
import {styles, WordleScreenButtons as CrosswordScreenButtons} from '../../source/styles/ingame-screen-styles.tsx';
import { ModalForCrossword } from './CrosswordModals.tsx';
import {buttons,modalBackgrounds} from "../../source/styles/assets.tsx";
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';

const arcadeCrosswordImage = require('../../source/images/homepage-icons/icon-1.jpg');
// Guess the word within the fixed number of guesses and win experience points. Choose among different words of varying difficulties including 
// other features too.

const arcadeCrosswordData={  
    heading : "Arcade Crossword",
    headingColor: "#870319",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton
};

const reverseCrosswordData={  
    heading : "Themed Crossword",
    headingColor: "#000080",
    bgImage: modalBackgrounds.blueModalBackgroundImg, 
    difficultyTabImage: buttons.greenButton,
    partsOfSpeechTabImage: buttons.redButton
};

const shiftedCrosswordData={  
    heading : "Cognates Crossword",
    headingColor: "#ffffff",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.yellowButton  
};

const crypticCrosswordData={  
    heading : "Cryptic Crossword",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.violetModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};

const multiplayerCrosswordData={  
    heading : "Diagramless Crossword",
    headingColor: "#000080",
    bgImage: modalBackgrounds.tealModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};

export type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'Crosswords'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;


const App = () => {
    const navigation = useNavigation<NavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);

    const [modalData, setModalData] = useState({
          headingColor: "",
          heading: "",
          bgImage:{} as ImageSourcePropType,
          difficultyTabImage:{} as ImageSourcePropType,
          partsOfSpeechTabImage:{} as ImageSourcePropType,
          isMultiplayer: false,
          gameMode: ""
    });
    
    const showCrosswordModal = (data: {
          headingColor: string,
          heading: string,
          bgImage: ImageSourcePropType,
          difficultyTabImage: ImageSourcePropType,
          partsOfSpeechTabImage: ImageSourcePropType,
          isMultiplayer?: boolean,
          gameMode: string
    })=>{
        setModalData({...data, isMultiplayer: data.isMultiplayer ?? false});
        setModalVisible(true); 
      };
    
    const hideCrosswordModal = () => {
        setModalVisible(false);
    };


  return(
  <ImageBackground
        source={require('../../source/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      > 
  <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>  
  <View style={styles.container}>
    <CrosswordScreenButtons
    preHeadingColor="#880808"
    postHeadingColor="0c0c0c"
    descriptionTextColor="0c0c0c" 
    preHeading="Arcade"
    heading="Crossword"
    description="The usual type of crossword games. Symmetrical grids, every letter part of both across and down answers. Standard Rules."
    image={arcadeCrosswordImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{
      showCrosswordModal({
      headingColor: arcadeCrosswordData.headingColor,
      heading: arcadeCrosswordData.heading,
      bgImage: arcadeCrosswordData.bgImage,
      difficultyTabImage: arcadeCrosswordData.difficultyTabImage,
      partsOfSpeechTabImage: arcadeCrosswordData.partsOfSpeechTabImage,
      gameMode: '1'
    });
    }}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}> 
    <CrosswordScreenButtons 
    preHeadingColor="#000080"
    postHeadingColor="#0c0c0c"
    descriptionTextColor="#404040"
    preHeading="Themed"
    heading="Crossword"
    description="Probably you haven't seen this one before. Why don't you give a try?"
    image={arcadeCrosswordImage}
    bgImage={buttons.blueButton}
    onPress={()=>{navigation.navigate("ThemedCrosswordLevels");}}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}>
    <CrosswordScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="Cognates"
    heading="Crossword"
    description="Words that are spelled the same in any two languages are generally called cognates."
    image={arcadeCrosswordImage}
    bgImage={buttons.redButton}
    onPress={()=>{navigation.navigate("CognateCrosswordLevels");}}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}>
    <CrosswordScreenButtons 
    preHeadingColor="#0d0d0d"
    postHeadingColor="#550055"
    descriptionTextColor="#ffe4e1" 
    preHeading="Cryptic"
    heading="Crossword"
    description="Clues are riddles or wordplay puzzles themselves. A hard challenge to take indeed. What say you?"
    image={arcadeCrosswordImage}
    bgImage={buttons.violetButton}
    onPress={()=>{showCrosswordModal({
      headingColor: crypticCrosswordData.headingColor,
      heading: crypticCrosswordData.heading,
      bgImage: crypticCrosswordData.bgImage,
      difficultyTabImage: crypticCrosswordData.difficultyTabImage,
      partsOfSpeechTabImage: crypticCrosswordData.partsOfSpeechTabImage,
      gameMode: '4'
    });
  }}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}>
    <CrosswordScreenButtons 
    preHeadingColor="#006400"
    postHeadingColor="#006400"
    descriptionTextColor="#015a57" 
    preHeading="Diagramless"
    heading="Crossword"
    description="No black squares shown; you figure out where everything goes."
    image={arcadeCrosswordImage}
    bgImage={buttons.tealButton}
    onPress={()=>{showCrosswordModal({
      headingColor: multiplayerCrosswordData.headingColor,
      heading: multiplayerCrosswordData.heading,
      bgImage: multiplayerCrosswordData.bgImage,
      difficultyTabImage: multiplayerCrosswordData.difficultyTabImage,
      partsOfSpeechTabImage: multiplayerCrosswordData.partsOfSpeechTabImage,
      isMultiplayer: true,
      gameMode: '5'
    });
  }}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}>
    <CrosswordScreenButtons 
    preHeadingColor="#222222"
    postHeadingColor="#404040"
    descriptionTextColor="#404040" 
    preHeading="Rectangular"
    heading="Crossword"
    description="Large Rectangular Crosswords. Random but Brainteasing..."
    image={arcadeCrosswordImage}
    bgImage={buttons.grayButton}
    onPress={()=>{
      /*
      Requires Activity...
      */
    }}>
    </CrosswordScreenButtons>
  </View>

  <View style={styles.container}>
    <CrosswordScreenButtons 
    preHeadingColor="#222222"
    postHeadingColor="#404040"
    descriptionTextColor="#404040" 
    preHeading="Crossword"
    heading="from Friends"
    description="Create and Play Crosswords from Friends. Share yours through a code and enjoy your friends' one too."
    image={arcadeCrosswordImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{navigation.navigate("CognateCrosswordLevels");}}>
    </CrosswordScreenButtons>
  </View>

  </ScrollView>
  <ModalForCrossword
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideCrosswordModal}
    visible={modalVisible}
    isMultiplayer={modalData.isMultiplayer}
    gameMode={modalData.gameMode}
  ></ModalForCrossword>
  </ImageBackground>
);}

export default App;
