//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, Modal, Button, TextProps, StyleProp, ViewStyle} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {icons} from "./assets.tsx";
import { styles } from "./wordle-modals-styles.tsx";
import { LevelsToUnlockLevels, Rewards as RewardsData } from "../../screens/Rewards.ts";
import { LevelsCleared } from "../../screens/SearchUp/SearchUpOptions.tsx";

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
  console.log(props.disabled);
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

export const SearchUpChoice={
  difficulty : 1,
  gameType: 1,
}

export let xp="25";
export let coins="30";

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  gameMode: number,
  gameType: string,
  levelsCleared: LevelsCleared,
}


export const CompleteSearchUpModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  
  const handlePress = (key: number) => {
    setSelected(key);
    SearchUpChoice.difficulty = key;
    let gameAwardInfo;
    switch(props.gameType.toLowerCase().trim()){
      case "normal": gameAwardInfo=RewardsData.SearchUp.Normal; break;
      case "reverse": gameAwardInfo=RewardsData.SearchUp.Reverse; break;
      case "diagonal": gameAwardInfo=RewardsData.SearchUp.Diagonal; break;
      case "labyrinth": gameAwardInfo=RewardsData.SearchUp.Labryinth; break;
      default: gameAwardInfo=RewardsData.SearchUp.Normal; break;
    }
    switch(key){
      case 1: xp=gameAwardInfo.easy.xp.toString(); coins=gameAwardInfo.easy.coin.toString(); break;
      case 2: xp=gameAwardInfo.intermediate.xp.toString(); coins=gameAwardInfo.intermediate.coin.toString();break;
      case 3: xp=gameAwardInfo.hard.xp.toString(); coins=gameAwardInfo.hard.coin.toString(); break;
      case 4: xp=gameAwardInfo.advanced.xp.toString(); coins=gameAwardInfo.advanced.coin.toString(); break;
      default: xp=gameAwardInfo.easy.xp.toString(); coins=gameAwardInfo.easy.coin.toString(); break;
    }
  };

    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Easy" size = "8x8" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(1, props.gameType, props.levelsCleared)} ></DifficultyTabs>
                <DifficultyTabs mode = "Intermediate" size = "9x9" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(2, props.gameType, props.levelsCleared)} ></DifficultyTabs>
                <DifficultyTabs mode = "Hard" size = "10x10" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(3, props.gameType, props.levelsCleared)} ></DifficultyTabs>
                <DifficultyTabs mode = "Advanced" size = "11x11" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage} disabled={!checkDisablity(4, props.gameType, props.levelsCleared)} ></DifficultyTabs>
                </View>
            <Text style={{fontFamily: 'Wordlet-Regular', marginVertical: 10, lineHeight: 18, color: '#333333', fontSize: 15, textAlign: 'center'}}>{showUnlockingPromptMessage(props.gameType, props.levelsCleared)}</Text>    
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

function checkDisablity(gameMode: number, gameType: string, levelsCleared: LevelsCleared){
  console.log(gameType.trim()=="normal", gameType);
  if(gameType.trim()=="normal")
    return true;
  else if(gameType.trim()=="reverse"){
    let verdict;

    switch(gameMode){
      case 1: levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Reverse.easy?verdict=false:verdict=true; break;
      case 2: levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Reverse.intermediate?verdict=false:verdict=true; break;
      case 3: levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Reverse.hard?verdict=false:verdict=true; break;
      case 4: levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Reverse.advanced?verdict=false:verdict=true; break;
      default: verdict=true; break;
    }
    return verdict;
  }

  else if(gameType.trim()=="diagonal"){
    let verdict;

    switch(gameMode){
      case 1: levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Diagonal.easy?verdict=false:verdict=true; break;
      case 2: levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Diagonal.intermediate?verdict=false:verdict=true; break;
      case 3: levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Diagonal.hard?verdict=false:verdict=true; break;
      case 4: levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Diagonal.advanced?verdict=false:verdict=true; break;
      default: verdict=true; break;
    }
    return verdict;
  }
  else if(gameType.trim()=="labyrinth"){
  let verdict;

  switch(gameMode){
      case 1: levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Labryinth.easy?verdict=false:verdict=true; break;
      case 2: levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Labryinth.intermediate?verdict=false:verdict=true; break;
      case 3: levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Labryinth.hard?verdict=false:verdict=true; break;
      case 4: levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Labryinth.advanced?verdict=false:verdict=true; break;
      default: verdict=true; break;
    }
    return verdict;
  }
else return false;
}

function showUnlockingPromptMessage(gameType: string, levelsCleared: LevelsCleared){
  if(gameType.trim()=="normal")
    return "";
  else if(gameType.trim()=="reverse"){
    let statement;

    //switch(gameMode){
     /* case 1: */levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Reverse.easy?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Reverse.easy} Levels in Normal Easy Mode to Unlock Reverse Easy Puzzles`:/*statement=""; break;*/
     /* case 2: */levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Reverse.intermediate?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Reverse.intermediate} Levels in Normal Intermediate Mode to Unlock Reverse Intermediate Puzzles`:/*statement=""; break;*/
     /* case 3:*/ levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Reverse.hard?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Reverse.hard} Levels in Normal Hard Mode to Unlock Reverse Hard Puzzles`:/*statement=""; break;*/
     /* case 4: */levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Reverse.advanced?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Reverse.advanced} Levels in Normal Advanced Mode to Unlock Reverse Advanced Puzzles`:statement="";
      //default: statement=""; break;
    
    return statement;
  }

  else if(gameType.trim()=="diagonal"){
    let statement;

    //switch(gameMode){
      /*case 1:*/ levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Diagonal.easy?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Diagonal.easy} Levels in Reverse Easy Mode to Unlock Diagonal Easy Puzzles`:/*statement=""; break;
      case 2:*/ levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Diagonal.intermediate?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Diagonal.intermediate} Levels in Reverse Intermediate Mode to Unlock Diagonal Intermediate Puzzles`:/*statement=""; break;
      case 3:*/ levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Diagonal.hard?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Diagonal.hard} Levels in Reverse Hard Mode to Unlock Diagonal Hard Puzzles`:/*statement=""; break;
      case 4:*/ levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Diagonal.advanced?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Diagonal.advanced} Levels in Reverse Advanced Mode to Unlock Diagonal Advanced Puzzles`:statement="";/* break;
      default: statement=""; break;
    }*/
    return statement;
  }
  else if(gameType.trim()=="labyrinth"){
  let statement;

  //switch(gameMode){
      /*case 1:*/ levelsCleared.easy<LevelsToUnlockLevels.SearchUp.Labryinth.easy?statement="":/*statement=""; break;
      case 2:*/ levelsCleared.intermediate<LevelsToUnlockLevels.SearchUp.Labryinth.intermediate?statement="":/*statement=""; break;
      case 3:*/ levelsCleared.hard<LevelsToUnlockLevels.SearchUp.Labryinth.hard?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Labryinth.hard} Levels in Normal Hard Mode to Unlock Labryinth Hard Puzzles`:/*statement=""; break;
      case 4:*/ levelsCleared.advanced<LevelsToUnlockLevels.SearchUp.Labryinth.advanced?statement=`You need to clear ${LevelsToUnlockLevels.SearchUp.Labryinth.advanced} Levels in Normal Advanced Mode to Unlock Labryinth Advanced Puzzles`:statement=""; /*break;
      default: statement=""; break;
    }*/
    return statement;
  }/**/
else return "";
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
