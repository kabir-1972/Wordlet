//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, TextProps, StyleProp, ViewStyle} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {icons} from "./assets.tsx";
import { styles } from "./wordle-modals-styles.tsx";
import { LevelsToUnlockLevels, Rewards as RewardsData } from "../../screens/Rewards.ts";

type DifficultyTabProps={
    mode: string;
    size: string;
    style?: StyleProp<ViewStyle>| null;
    difficultyChooseBtn: ()=>void;
    difficultyTabImage: ImageSourcePropType;
    selected: boolean;
    disabled: boolean;
}

const DifficultyTabs=(props: DifficultyTabProps)=>{
    return(
    <View style={[{flexGrow: 1}, props.selected?styles.chosenDifficulty:null]}>
        <Pressable onPress= {props.difficultyChooseBtn}
        disabled={props.disabled}>
                <ImageBackground
                  source={props.difficultyTabImage}
                  style={[styles.tabs,]}
                  imageStyle={styles.bgImage}
                >
                {props.disabled && (<View style={styles.disabledOverlay}/>)}
                {(!props.disabled&&props.selected) && (<View style={styles.selectedOption} />)}    
        <View style={[styles.difficultyTabContent]}>
            <TabText>{props.mode}</TabText>
            <TabText>{props.size}</TabText>
        </View>
                </ImageBackground>     
        </Pressable>
    </View>
);
}

export const WordLadderChoice={
  wordSize : 3,
}

export let xp: string;
export let coins: string;

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  levelsCleared: number[],
}

  let gameAwardInfo=RewardsData.WordLadder[4];
  xp=gameAwardInfo.xp.toString();
  coins=gameAwardInfo.coin.toString();

export const CompleteWordLadderModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  
  const handlePress = (key: number) => {
    setSelected(key);
    WordLadderChoice.wordSize = key+2;
    switch(key){
      case 1: gameAwardInfo=RewardsData.WordLadder[3]; break;
      case 2: gameAwardInfo=RewardsData.WordLadder[4]; break;
      case 3: gameAwardInfo=RewardsData.WordLadder[5]; break;
      case 4: gameAwardInfo=RewardsData.WordLadder[6]; break;
      default: gameAwardInfo=RewardsData.WordLadder[3]; break;
    }
    xp=gameAwardInfo.xp.toString();
    coins=gameAwardInfo.coin.toString();
  };

    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Easy" size = "3 letters" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(3, props.levelsCleared[0])} ></DifficultyTabs>
                <DifficultyTabs mode = "Intermediate" size = "4 letters" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(4,  props.levelsCleared[1])} ></DifficultyTabs>
                <DifficultyTabs mode = "Hard" size = "5 letters" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(5, props.levelsCleared[2])} ></DifficultyTabs>
                <DifficultyTabs mode = "Advanced" size = "6 letters" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(6,  props.levelsCleared[3])} ></DifficultyTabs>
                </View>
            <Text style={{fontFamily: 'Wordlet-Regular', marginVertical: 10, lineHeight: 18, color: '#333333', fontSize: 15, textAlign: 'center'}}>{showUnlockingPromptMessage(props.levelsCleared)}</Text>    
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

function checkDisablity(wordSize: number, levelsCleared: number){
    console.log(wordSize, levelsCleared);
  if(wordSize==3)
    return true;

  else if(wordSize>3&&wordSize<=6){
    if(levelsCleared<LevelsToUnlockLevels.WordLadder[wordSize as 4|5|6]) return false;
        else return true;
  }
else return false;
}

function showUnlockingPromptMessage(levelsCleared: number[]){

    let statement;

     levelsCleared[0]<LevelsToUnlockLevels.WordLadder[4]?statement=`You need to find ${LevelsToUnlockLevels.WordLadder[4]} words in 3 letters to Unlock 4 letter WordLadder Puzzles`:
     levelsCleared[1]<LevelsToUnlockLevels.WordLadder[5]?statement=`You need to find ${LevelsToUnlockLevels.WordLadder[5]} words in 4 letters to Unlock 5 letter WordLadder Puzzles`:
     levelsCleared[2]<LevelsToUnlockLevels.WordLadder[6]?statement=`You need to find ${LevelsToUnlockLevels.WordLadder[6]} words in 5 letters to Unlock 6 letter WordLadder Puzzles`:'';
    return statement;
  
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
