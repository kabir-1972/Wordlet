import { useRef, useState } from "react";
import { StyleSheet, View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, Modal, Button, TextProps, StyleProp, ViewStyle} from 'react-native';
import { State } from "react-native-gesture-handler";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";
import { ModalButton,  CompleteCrosswordModal, CrosswordChoice} from "../../source/styles/crosswords-modals-styles";
import { styles } from "../../source/styles/wordle-modals-styles";
import { buttonPressIn, buttonPressOut } from "../../source/styles/allAnimations";
import { buttons } from "../../source/styles/assets";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { NavigationProp } from "../HomeScreen";

type ModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    gameMode: string,
    onclose: ()=> void;
    isMultiplayer?: boolean
}

export const ModalForCrossword=(props: ModalProps)=>{
    const navigation = useNavigation<NavigationProp>();

    const createACrosswordLevel = () => {
      
    type CrosswordLevelScreens =
  | "ArcadeCrosswordLevels"
  | "CrypticCrosswordLevels"
  | "DiagramlessCrosswordLevels"
  ;

let crosswordLevelWindow: CrosswordLevelScreens = "ArcadeCrosswordLevels";

switch (CrosswordChoice.gameMode) {
  case '4': crosswordLevelWindow = "CrypticCrosswordLevels"; break;
  case '5': crosswordLevelWindow = "DiagramlessCrosswordLevels"; break;
  default: crosswordLevelWindow = "ArcadeCrosswordLevels"; break;
}
    navigation.navigate(crosswordLevelWindow, {
      size: CrosswordChoice.difficulty
    });
}
 
    let playButton=<ModalButton onclick={()=>createACrosswordLevel()} buttonImage={buttons.playButton}></ModalButton>

    return (
        <Modal
        visible={props.visible}
        onRequestClose={props.onclose}
        transparent={true}
        >
    <View style={styles.container}>
        <ImageBackground 
        source={props.bgImage}
        style={styles.backgroundImage}
        imageStyle={{resizeMode: 'stretch'}}
        >  
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalHeading , {color: props.headingColor}]}>{props.heading}</Text>
            <CompleteCrosswordModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} gameMode={props.gameMode}/>
            <View style={styles.modalButtons}>
            <ModalButton onclick={()=>props.onclose()} buttonImage={buttons.cancelButton}></ModalButton>
            {playButton}
            </View>
          </View>
        </View>
        </ImageBackground>
    </View>
        </Modal>
    );
};
