import { useRef, useState } from "react";
import { StyleSheet, View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, Modal, Button, TextProps, StyleProp, ViewStyle} from 'react-native';
import { State } from "react-native-gesture-handler";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";
import { ModalButton, CompleteWordleModal, styles, WordleChoice} from "../../source/styles/wordle-modals-styles";
import { buttonPressIn, buttonPressOut } from "../../source/styles/allAnimations";
import { buttons } from "../../source/styles/assets";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { NavigationProp } from "./../HomeScreen";

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

export const ModalForWordle=(props: ModalProps)=>{
    const navigation = useNavigation<NavigationProp>();

    const createAWordleMatch = () => {
      
    type WordleMatchScreens =
  | "BasicWordleMatch"
  | "ReversedWordleMatch"
  | "ShiftedWordleMatch"
  | "PreSolvedWordleMatch";

let wordleMatchWindow: WordleMatchScreens = "BasicWordleMatch";

switch (WordleChoice.gameMode) {
  case '2': wordleMatchWindow = "ReversedWordleMatch"; break;
  case '3': wordleMatchWindow = "ShiftedWordleMatch"; break;
  case '4': wordleMatchWindow = "PreSolvedWordleMatch"; break;
  default: wordleMatchWindow = "BasicWordleMatch"; break;
}
    navigation.navigate(wordleMatchWindow, {
      size: WordleChoice.difficulty
    });
}

    const createAMultiplayerWordleMatch = () => {
        navigation.navigate('MultiplayerGameLoading');
    };
 
    let playButton;
    if(!props.isMultiplayer)
        playButton=<ModalButton onclick={()=>createAWordleMatch()} buttonImage={buttons.playButton}></ModalButton>
    else playButton=<ModalButton onclick={()=>createAMultiplayerWordleMatch()} buttonImage={buttons.findMatchButton}></ModalButton>
    
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
            <CompleteWordleModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} gameMode={props.gameMode}/>
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
