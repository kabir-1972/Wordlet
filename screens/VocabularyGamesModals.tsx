import { View, Text, ImageBackground, ImageSourcePropType, Modal} from 'react-native';
import { ModalButton, CompleteConnecticoModal, styles, ConnecticoChoice} from "../source/styles/connectico-modals-styles";
import { buttons } from "../source/styles/assets";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { NavigationProp } from "./HomeScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CompleteFlashCardModal, FlashCardChoice} from '../source/styles/flashcard-modal-styles';
import { CompleteWordLadderModal, WordLadderChoice} from '../source/styles/wordladder-modal-styles';
import { CompleteGapFillsModal, GapFillsChoice } from '../source/styles/gapfill-modal-styles';
import { CompleteWordChainsModal } from '../source/styles/wordchain-modal-styles';
import { CompleteWicWacWoeModal } from '../source/styles/wicwacwoe-modal-styles';


type ModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    gameMode: string,
    onclose: ()=> void;
}

type FlashCardModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    onclose: ()=> void;
}

type WordLadderModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    levelsCleared: number[]
    onclose: ()=> void;
}

type WordChainsModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    onclose: ()=> void;
    playerLevel: number;
}

export const ModalForFlashCard=(props: FlashCardModalProps)=>{
    const navigation = useNavigation<NavigationProp>();
    const createAnFlashCardMatch = () => {
      switch(FlashCardChoice.option){
        case 1: navigation.navigate("FlashCardCreateScreen"); break;
        //case 2: navigation.navigate("FlashCardViewScreen"); break;
        case 3: navigation.navigate("FlashCardViewScreen", {name : "Wordlet"}); break;
        //case 4: navigation.navigate("FlashCardViewScreen"); break;
        default: navigation.navigate("FlashCardCreateScreen"); break;
      }
    }
    
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
            <CompleteFlashCardModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage}/>
            <View style={styles.modalButtons}>
            <ModalButton onclick={()=>props.onclose()} buttonImage={buttons.cancelButton}></ModalButton>
            <ModalButton onclick={()=>createAnFlashCardMatch()} buttonImage={buttons.playButton}></ModalButton>
            </View>
          </View>
        </View>
        </ImageBackground>
    </View>
        </Modal>
    );
};

/* 
export const ModalForGapFills=(props: FlashCardModalProps)=>{
    const navigation = useNavigation<NavigationProp>();
    const createAGapFillMatch = () => {
    type FlashCardMatchScreens = "GapFillsMatch"
    let moreGamesWindow: FlashCardMatchScreens = "GapFillsMatch";
    navigation.navigate(moreGamesWindow, {
      wordSize: GapFillsChoice.wordSize
    });
}
 
    let playButton=<ModalButton onclick={()=>createAGapFillMatch()} buttonImage={buttons.playButton}></ModalButton>
    
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
            {/* <CompleteGapFillsModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} levelsCleared={props.levelsCleared}/>
             }<View style={styles.modalButtons}>
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

export const ModalForWordLadder=(props: WordLadderModalProps)=>{
    const navigation = useNavigation<NavigationProp>();
    const createAGapFillMatch = () => {
    type FlashCardMatchScreens = "WordLadderMatch"
    let moreGamesWindow: FlashCardMatchScreens = "WordLadderMatch";
    navigation.navigate(moreGamesWindow, {
      wordSize: WordLadderChoice.wordSize
    });
}
 
    let playButton=<ModalButton onclick={()=>createAGapFillMatch()} buttonImage={buttons.playButton}></ModalButton>
    
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
            <CompleteWordLadderModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} levelsCleared={props.levelsCleared}/>
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

export const ModalForWordChain=(props: WordChainsModalProps)=>{
    const navigation = useNavigation<NavigationProp>();
    const [key, setKey]=useState(0);
    const [code, setCode]=useState("");
    const [errorCodeFound, setErrorCodeFound]=useState(false);

    const setTheAsyncStorage=async (value: string)=>{
      try {
          await AsyncStorage.setItem("multiplayerGameData", value);
      } catch (e) {
        console.error('Error storing data:', e);
      }
    }
    const createAWordChainsMatch = () => {
      console.log(key);

      if(key==1||key==2)
        navigation.navigate("WordChainsMatch", {type: key});
      if(key==3){
        const multiplayerGameData={
          name: "WordChains",
          code: ""
        }
        const jsonMultiplayerGameData=JSON.stringify(multiplayerGameData);
        setTheAsyncStorage(jsonMultiplayerGameData);
        navigation.navigate("MultiplayerGameLoading");
      }
      else if(key==4){
        if(code.length!=6){
          setErrorCodeFound(true);
          setTimeout(()=>setErrorCodeFound(false), 3000);
          return;
        }
        else setErrorCodeFound(false);
        const multiplayerGameData={
          name: "WordChains",
          code: code
        }
        const jsonMultiplayerGameData=JSON.stringify(multiplayerGameData);
        setTheAsyncStorage(jsonMultiplayerGameData);
        navigation.navigate("MultiplayerGameLoading");
      }
}
 
    let playButton=<ModalButton onclick={()=>createAWordChainsMatch()} buttonImage={buttons.playButton}></ModalButton>
    
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
            <CompleteWordChainsModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} level={props.playerLevel} setKey={setKey} setCode={setCode}/>
            
            {key==4&&errorCodeFound?<Text style={[styles.tabText, {fontSize: 16, textAlign: 'center', marginTop: 5, color: '#400e01'}]}>The Code is Invalid</Text>: undefined}
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
}

export const ModalForWicWacWoe=(props: WordChainsModalProps)=>{
    const navigation = useNavigation<NavigationProp>();
    const [key, setKey]=useState(0);
    const [code, setCode]=useState("");
    const [errorCodeFound, setErrorCodeFound]=useState(false);

    const setTheAsyncStorage=async (value: string)=>{
      try {
          await AsyncStorage.setItem("multiplayerGameData", value);
      } catch (e) {
        console.error('Error storing data:', e);
      }
    }
    const createAWicWacWoeMatch = () => {

      if(key==1||key==2)
        navigation.navigate("WicWacWoeMatch", {type: key});
      if(key==3){
        const multiplayerGameData={
          name: "WicWacWoe",
          code: ""
        }
        const jsonMultiplayerGameData=JSON.stringify(multiplayerGameData);
        setTheAsyncStorage(jsonMultiplayerGameData);
        navigation.navigate("MultiplayerGameLoading");
      }
      else if(key==4){
        if(code.length!=6){
          setErrorCodeFound(true);
          setTimeout(()=>setErrorCodeFound(false), 3000);
          return;
        }
        else setErrorCodeFound(false);
        const multiplayerGameData={
          name: "WicWacWoe",
          code: code
        }
        const jsonMultiplayerGameData=JSON.stringify(multiplayerGameData);
        setTheAsyncStorage(jsonMultiplayerGameData);
        navigation.navigate("MultiplayerGameLoading");
      }
}
 
    let playButton=<ModalButton onclick={()=>createAWicWacWoeMatch()} buttonImage={buttons.playButton}></ModalButton>
    
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
            <CompleteWicWacWoeModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} level={props.playerLevel} setKey={setKey} setCode={setCode}/>
            {key==4&&errorCodeFound?<Text style={[styles.tabText, {fontSize: 16, textAlign: 'center', marginTop: 5, color: '#400e01'}]}>The Code is Invalid</Text>: undefined}
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
} */