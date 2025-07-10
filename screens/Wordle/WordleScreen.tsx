// image={basicWordleImage} would be changed... 
 
import React, {useState} from 'react';
import {View, ImageBackground, ScrollView, ImageSourcePropType} from 'react-native';
import {styles, WordleScreenButtons} from '../../source/styles/ingame-screen-styles.tsx';
import { ModalForWordle } from './WordleModals.tsx';
import {buttons,modalBackgrounds} from "../../source/styles/assets.tsx";

const basicWordleImage = require('../../source/images/homepage-icons/icon-1.jpg');
// Guess the word within the fixed number of guesses and win experience points. Choose among different words of varying difficulties including 
// other features too.

const basicWordleData={  
    heading : "Basic Wordle",
    headingColor: "#870319",
    bgImage: modalBackgrounds.orangeModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton
};

const reverseWordleData={  
    heading : "Reverse Wordle",
    headingColor: "#000080",
    bgImage: modalBackgrounds.blueModalBackgroundImg, 
    difficultyTabImage: buttons.greenButton,
    partsOfSpeechTabImage: buttons.redButton
};

const shiftedWordleData={  
    heading : "Shifted Wordle",
    headingColor: "#ffffff",
    bgImage: modalBackgrounds.redModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.yellowButton  
};

const preSolvedWordleData={  
    heading : "Pre-Solved Wordle",
    headingColor: "#7702d1",
    bgImage: modalBackgrounds.violetModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};

const multiplayerWordleData={  
    heading : "Multiplayer Wordle",
    headingColor: "#000080",
    bgImage: modalBackgrounds.tealModalBackgroundImg,
    difficultyTabImage: buttons.blueButton,
    partsOfSpeechTabImage: buttons.redButton  
};


const App = () => {
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
    
    const showWordleModal = (data: {
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
    
    const hideWordleModal = () => {
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
    <WordleScreenButtons
    preHeadingColor="#880808"
    postHeadingColor="0c0c0c"
    descriptionTextColor="0c0c0c" 
    preHeading="Basic"
    heading="Wordle"
    description="The usual type of arcade wordle games, made up of different sizes with predefined rules."
    image={basicWordleImage}
    bgImage={buttons.yellowButton}
    onPress={()=>{
      showWordleModal({
      headingColor: basicWordleData.headingColor,
      heading: basicWordleData.heading,
      bgImage: basicWordleData.bgImage,
      difficultyTabImage: basicWordleData.difficultyTabImage,
      partsOfSpeechTabImage: basicWordleData.partsOfSpeechTabImage,
      gameMode: '1'
    });
  }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}> 
    <WordleScreenButtons 
    preHeadingColor="#000080"
    postHeadingColor="#0c0c0c"
    descriptionTextColor="#404040" 
    preHeading="Reverse"
    heading="Wordle"
    description="Probably you haven't seen this one before. Why don't you give a try?"
    image={basicWordleImage}
    bgImage={buttons.blueButton}
    onPress={()=>{showWordleModal({
      headingColor: reverseWordleData.headingColor,
      heading: reverseWordleData.heading,
      bgImage: reverseWordleData.bgImage,
      difficultyTabImage: reverseWordleData.difficultyTabImage,
      partsOfSpeechTabImage: reverseWordleData.partsOfSpeechTabImage,
      gameMode: '2'
    });
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#ffffff"
    postHeadingColor="#404040"
    descriptionTextColor="#fffff0" 
    preHeading="Shifted"
    heading="Wordle"
    description="Wordle that responses to the relative positional placements of the letters you have chosen. Enjoyable, isn't it?"
    image={basicWordleImage}
    bgImage={buttons.redButton}
    onPress={()=>{showWordleModal({
      headingColor: shiftedWordleData.headingColor,
      heading: shiftedWordleData.heading,
      bgImage: shiftedWordleData.bgImage,
      difficultyTabImage: shiftedWordleData.difficultyTabImage,
      partsOfSpeechTabImage: shiftedWordleData.partsOfSpeechTabImage,
      gameMode: '3'
    });
    }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#0d0d0d"
    postHeadingColor="#550055"
    descriptionTextColor="#ffe4e1" 
    preHeading="Pre-Solved"
    heading="Wordle"
    description="They attempted to solve it, but failed. One last chance to take. What say you?"
    image={basicWordleImage}
    bgImage={buttons.violetButton}
    onPress={()=>{showWordleModal({
      headingColor: preSolvedWordleData.headingColor,
      heading: preSolvedWordleData.heading,
      bgImage: preSolvedWordleData.bgImage,
      difficultyTabImage: preSolvedWordleData.difficultyTabImage,
      partsOfSpeechTabImage: preSolvedWordleData.partsOfSpeechTabImage,
      gameMode: '4'
    });
  }}>
    </WordleScreenButtons>
  </View>

  <View style={styles.container}>
    <WordleScreenButtons 
    preHeadingColor="#006400"
    postHeadingColor="#006400"
    descriptionTextColor="#015a57" 
    preHeading="Multiplayer"
    heading="Wordle"
    description="Find other players and round up for a match. Earn trophies too as you win."
    image={basicWordleImage}
    bgImage={buttons.tealButton}
    onPress={()=>{showWordleModal({
      headingColor: multiplayerWordleData.headingColor,
      heading: multiplayerWordleData.heading,
      bgImage: multiplayerWordleData.bgImage,
      difficultyTabImage: multiplayerWordleData.difficultyTabImage,
      partsOfSpeechTabImage: multiplayerWordleData.partsOfSpeechTabImage,
      isMultiplayer: true,
      gameMode: '5'
    });
  }}>
    </WordleScreenButtons>
  </View>

  </ScrollView>
  <ModalForWordle
    headingColor={modalData.headingColor}
    heading={modalData.heading}
    bgImage={modalData.bgImage}
    difficultyTabImage={modalData.difficultyTabImage}
    partsOfSpeechTabImage={modalData.partsOfSpeechTabImage}
    onclose={hideWordleModal}
    visible={modalVisible}
    isMultiplayer={modalData.isMultiplayer}
    gameMode={modalData.gameMode}
  ></ModalForWordle>
  </ImageBackground>
);}

export default App;
