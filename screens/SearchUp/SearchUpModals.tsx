import { View, Text, ImageBackground, ImageSourcePropType, Modal} from 'react-native';
import { ModalButton,  CompleteSearchUpModal, SearchUpChoice} from "../../source/styles/searchup-modals-styles";
import { styles } from "../../source/styles/wordle-modals-styles";
import { buttons } from "../../source/styles/assets";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { NavigationProp } from "../HomeScreen";
import { LevelsCleared } from './SearchUpOptions';


type ModalProps = {
    headingColor: string,
    heading: string,
    bgImage: ImageSourcePropType,
    visible: boolean;
    difficultyTabImage: ImageSourcePropType;
    partsOfSpeechTabImage: ImageSourcePropType;
    gameMode: number,
    onclose: ()=> void;
    gameType: string;
    levelsCleared: LevelsCleared;
}

export const ModalForSearchUp=(props: ModalProps)=>{
    const navigation = useNavigation<NavigationProp>();

    const createASearchUpLevel = () => {
    navigation.navigate("SearchUpLevels", {
      difficulty: SearchUpChoice.difficulty,
      gameType: SearchUpChoice.gameType
    });
}
 
    let playButton=<ModalButton onclick={()=>createASearchUpLevel()} buttonImage={buttons.playButton}></ModalButton>
    console.log(props.levelsCleared);

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
            <CompleteSearchUpModal difficultyTabImage={props.difficultyTabImage} partsOfSpeechTabImage={props.partsOfSpeechTabImage} gameMode={props.gameMode} gameType={props.gameType} levelsCleared={props.levelsCleared}/>
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
