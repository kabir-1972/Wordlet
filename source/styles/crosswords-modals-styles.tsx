//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { StyleSheet, View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, Modal, Button, TextProps, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {icons} from "./assets.tsx";
import { styles } from "./wordle-modals-styles.tsx";

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

export const CrosswordChoice={
  gameMode: '',
  difficulty : 1,
}

export let xp="25";
export let coins="30";

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  gameMode: string
}


export const CompleteCrosswordModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  CrosswordChoice.gameMode=props.gameMode;
  const handlePress = (key: number) => {
    setSelected(key);
    CrosswordChoice.difficulty = key;
    switch(key){
      case 2: xp="36"; coins="40"; break;
      case 3: xp="49"; coins="55";break;
      case 4: xp="64"; coins="70"; break;
      case 5: xp="81"; coins="100";break;
      case 6: xp="100"; coins="150"; break;
      default: xp="25"; coins="30"; break;
    }
  };

    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Easy" size = "5x5" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Intermediate" size = "6x6" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Hard" size = "7x7" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Advanced" size = "8x8" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Extreme" size = "9x9" difficultyChooseBtn = {()=>handlePress(5)} selected={selected===5} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
                <DifficultyTabs mode = "Insane" size = "10x10" difficultyChooseBtn = {()=>handlePress(6)} selected={selected===6} difficultyTabImage={props.difficultyTabImage}></DifficultyTabs>
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
