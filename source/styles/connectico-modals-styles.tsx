//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { StyleSheet, View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, Modal, Button, TextProps, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {icons} from "./assets.tsx";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  backgroundImage: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
  },

  modalBackground: {
    width: '100%',
  },

  modalButtonStyle:{
    width: 100,
    aspectRatio: 2.4,
  },

  modalButtonImage:{
    resizeMode: 'cover',
    borderRadius: 5
  },

  modalButtons:{
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalButtonWrapper:{
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
  },

  modalContent: {
    margin: 30,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },

  modalText: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Wordlet-Regular',
    color: 'black'
  },

  modalHeading: {
    fontSize: 25,
    fontFamily: 'Wordlet-Regular',
    textAlign: 'center'
  },

  difficultyTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 5,
    padding: 10,
    paddingTop: 0,
  },

  tabs: {
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },

  tabText: {
    fontSize: 18,
    fontFamily: 'Wordlet-Regular',
    color: 'black',  
  },

  bgImage:{
    resizeMode: 'stretch',
    width: '100%'
  },

  difficultyTabContent: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      paddingBottom: 5,
      paddingTop: 5
  },

  chosenDifficulty: {
    transform: [{ scale: 0.9 }],
  },

  selectedOption:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },

  partsOfSpeechTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 3,
    padding: 10,
    paddingTop: 3,
    paddingBottom: 3
  },

  rewardsContainer:{
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'center',
  },

  rewards:{
    flexDirection:'row',
    gap: '5',
    alignItems: 'center',
    justifyContent: 'center'
  },

  wordleIcons:{
    width: 22,
    aspectRatio: 1,
    resizeMode: 'stretch'
  },

  iconText:{
    fontFamily: 'Wordlet-Regular',
    color:"5c89c4",
    marginTop: 2,
    fontSize: 16
  }

});

type DifficultyTabProps={
    mode: string;
    size: string;
    style?: StyleProp<ViewStyle>| null;
    difficultyChooseBtn: ()=>void;
    difficultyTabImage: ImageSourcePropType;
    selected: boolean
}

const DifficultyTabs=(props: DifficultyTabProps)=>{
    return(
    <View style={[{flexGrow: 1}, props.selected?styles.chosenDifficulty:null]}>
        <Pressable onPress= {props.difficultyChooseBtn}>
                <ImageBackground
                  source={props.difficultyTabImage}
                  style={[styles.tabs,]}
                  imageStyle={styles.bgImage} 
                >
                {props.selected && (<View style={styles.selectedOption} />)}    
        <View style={[styles.difficultyTabContent]}>
            <TabText>{props.mode}</TabText>
            <TabText>{props.size}</TabText>
        </View>
                </ImageBackground>     
        </Pressable>
    </View>
);
}

export const ConnecticoChoice={
  gameMode: '',
  difficulty : 1
}

let xp="2-8";
let coins="12-18";

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  gameMode: string
}


export const CompleteConnecticoModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  ConnecticoChoice.gameMode=props.gameMode;
  const handlePress = (key: number) => {
    setSelected(key);
    ConnecticoChoice.difficulty = key;
    switch(key){
      case 2: xp="6-12"; coins="16-22"; break;
      case 3: xp="14-20"; coins="24-30";break;
      case 4: xp="30-42"; coins="36-48"; break;
      default: xp="2-8"; coins="12-18"; break;
    }
  };

    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Easy" size = "4x5" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Intermediate" size = "5x5" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Hard" size = "6x5" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Advanced" size = "7x6" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
            </View>
            <Rewards coins={coins} xp={xp}></Rewards>
        </View>
    );
}

type ModalButtonProps={
  onclick:()=>void;
  buttonImage: ImageSourcePropType
}

type RewardsProps={
  coins: string;
  xp: string
}

export const ModalButton=(props:ModalButtonProps)=>{
  const scale=useRef(new Animated.Value(1)).current;
  return(
    <Animated.View style={{ transform: [{ scale }] }}>
                        <Pressable
                        onPressIn={()=>{buttonPressIn(scale);}}
                        onPressOut={() => {buttonPressOut(scale);}}
                        onPress={props.onclick} 
                        >
                          <View style={styles.modalButtonWrapper}>
                        <ImageBackground
                        source={props.buttonImage}
                        style={styles.modalButtonStyle}
                        imageStyle={styles.modalButtonImage}       
                        >
                        </ImageBackground></View>
                        </Pressable>
            </Animated.View>
  )
}

export const Rewards=(props:RewardsProps)=>{
  return(
    <View style={styles.rewardsContainer}>
      <View style={styles.rewards}>
        <Image source={icons.xp}
        style={styles.wordleIcons}
        ></Image><IconText>{props.xp}</IconText>
      </View>
      <View  style={styles.rewards}>
        <Image
        source={icons.coin}
        style={styles.wordleIcons}
        ></Image><IconText>{props.coins}</IconText>
      </View>
    </View>
  )
}


 const ModalText = (props: TextProps) => {
  return <Text style={[styles.modalText, props.style]} {...props} />;
};

 const TabText = (props: TextProps) => {
  return <Text style={[styles.tabText, props.style]} {...props} />;
};

  const IconText = (props: TextProps) => {
  return <Text style={[styles.iconText, props.style]} {...props} />;
};
