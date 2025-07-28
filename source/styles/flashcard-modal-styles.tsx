//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, TextProps, StyleProp, ViewStyle} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {icons} from "./assets.tsx";
import { styles } from "./wordle-modals-styles.tsx";

type OptionsTabProps={
    mode: string;
    style?: StyleProp<ViewStyle>| null;
    difficultyChooseBtn: ()=>void;
    difficultyTabImage: ImageSourcePropType;
    selected: boolean;
}

const OptionsTabs=(props: OptionsTabProps)=>{
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
            <TabText style={{lineHeight: 21, textAlign: 'center'}}>{props.mode.replaceAll(' ','\n')}</TabText>
        </View>
                </ImageBackground>     
        </Pressable>
    </View>
);
}

export const FlashCardChoice={
  option : 1,
}

export let xp: string;
export let coins: string;

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
}
export const CompleteFlashCardModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(1);
  
  const handlePress = (key: number) => {
    setSelected(key);
        FlashCardChoice.option = key;
   }
    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <OptionsTabs mode = "Create FlashCards" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage}></OptionsTabs>
                <OptionsTabs mode = "Your FlashCards" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage}></OptionsTabs>
                <OptionsTabs mode = "Wordlet FlashCards" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage}></OptionsTabs>
                <OptionsTabs mode = "Other's FlashCards" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage}></OptionsTabs>
                </View>
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

const TabText = ({ style, ...rest }: TextProps) => {
  return <Text style={[styles.tabText, style]} {...rest} />;
};

  const IconText = (props: TextProps) => {
  return <Text style={[styles.iconText, props.style]} {...props} />;
};
