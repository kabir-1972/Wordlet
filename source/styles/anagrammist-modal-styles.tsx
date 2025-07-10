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
  //console.log(props.disabled);
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

export const AnagrammistChoice={
  wordSize : 4,
}

export let xp: string;
export let coins: string;

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  levelsCleared: number[],
}

  let gameAwardInfo=RewardsData.Anagrammist[4];
  xp=gameAwardInfo.xp.toString();
  coins=gameAwardInfo.coin.toString();

export const CompleteAnagrammistModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  
  const handlePress = (key: number) => {
    setSelected(key);
    AnagrammistChoice.wordSize = key;
    switch(key){
      case 1: gameAwardInfo=RewardsData.Anagrammist[4]; break;
      case 2: gameAwardInfo=RewardsData.Anagrammist[5]; break;
      case 3: gameAwardInfo=RewardsData.Anagrammist[6]; break;
      case 4: gameAwardInfo=RewardsData.Anagrammist[7]; break;
      case 5: gameAwardInfo=RewardsData.Anagrammist[8]; break;
      case 6: gameAwardInfo=RewardsData.Anagrammist[9]; break;
      default: gameAwardInfo=RewardsData.Anagrammist[4]; break;
    }
    xp=gameAwardInfo.xp.toString();
    coins=gameAwardInfo.coin.toString();
  };

    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Easy" size = "4 letters" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(4, props.levelsCleared[0])} ></DifficultyTabs>
                <DifficultyTabs mode = "Intermediate" size = "5 letters" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(5,  props.levelsCleared[1])} ></DifficultyTabs>
                <DifficultyTabs mode = "Hard" size = "6 letters" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(6, props.levelsCleared[2])} ></DifficultyTabs>
                <DifficultyTabs mode = "Advanced" size = "7 letters" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(7,  props.levelsCleared[3])} ></DifficultyTabs>
                <DifficultyTabs mode = "Extreme" size = "8 letters" difficultyChooseBtn = {()=>handlePress(5)} selected={selected===5} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(8,  props.levelsCleared[4])} ></DifficultyTabs>
                <DifficultyTabs mode = "Insane" size = "9 letters" difficultyChooseBtn = {()=>handlePress(6)} selected={selected===6} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(9,  props.levelsCleared[5])} ></DifficultyTabs>
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
  if(wordSize==4)
    return true;

  else if(wordSize>4&&wordSize<=9){
    if(levelsCleared<LevelsToUnlockLevels.Anagrammist[wordSize as 5|6|7|8|9]) return false;
        else return true;
  }
else return false;
}

function showUnlockingPromptMessage(levelsCleared: number[]){

    let statement;

     levelsCleared[0]<LevelsToUnlockLevels.Anagrammist[5]?statement=`You need to find ${LevelsToUnlockLevels.Anagrammist[5]} words in 4 letters to Unlock 5 letter Anagrammist Puzzles`:
     levelsCleared[1]<LevelsToUnlockLevels.Anagrammist[6]?statement=`You need to find ${LevelsToUnlockLevels.Anagrammist[6]} words in 5 letters to Unlock 6 letter Anagrammist Puzzles`:
     levelsCleared[2]<LevelsToUnlockLevels.Anagrammist[7]?statement=`You need to find ${LevelsToUnlockLevels.Anagrammist[7]} words in 6 letters to Unlock 7 letter Anagrammist Puzzles`:
     levelsCleared[3]<LevelsToUnlockLevels.Anagrammist[8]?statement=`You need to find ${LevelsToUnlockLevels.Anagrammist[8]} words in 7 letters to Unlock 8 letter Anagrammist Puzzles`:
     levelsCleared[4]<LevelsToUnlockLevels.Anagrammist[9]?statement=`You need to find ${LevelsToUnlockLevels.Anagrammist[9]} words in 8 letters to Unlock 9 letter Anagrammist Puzzles`:statement="";
 
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
