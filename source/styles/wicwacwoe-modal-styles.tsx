//There would be absolutely no change made here...

import { useRef, useState } from "react";
import { View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, TextProps, StyleProp, ViewStyle, TextInput} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations.tsx";
import {buttons, icons} from "./assets.tsx";
import { styles } from "./wordle-modals-styles.tsx";
import { Rewards as RewardsData, XpLevelToUnlockGameMode } from "../../screens/Rewards.ts";

type DifficultyTabProps={
    mode: string;
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
                  style={[styles.tabs]}
                  imageStyle={[styles.bgImage]}
                >
                {props.disabled && (<View style={styles.disabledOverlay}/>)}
                {(!props.disabled&&props.selected) && (<View style={styles.selectedOption} />)}    
        
            <Text style={styles.tabTextForWordChains}>{props.mode.replace(/\\n/g, '\n')}</Text>
                </ImageBackground>     
        </Pressable>
    </View>
);
}

export let xp: string;
export let coins: string;

type wordleStyleProps={
  difficultyTabImage: ImageSourcePropType;
  partsOfSpeechTabImage: ImageSourcePropType;
  level: number;
  setKey: React.Dispatch<React.SetStateAction<number>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

  let gameAwardInfo=RewardsData.WicWacWoe;

export const CompleteWicWacWoeModal=(props:wordleStyleProps)=>{
  const [selected, setSelected] = useState(0);
  const [subSelected, setSubSelected] =useState(-1);

  const handlePress = (key: number) => {
      setSelected(key);
      props.setKey(key);

      xp=gameAwardInfo[key as 1|2|3|4]/**/.xp.toString();
      coins=gameAwardInfo[key as 1|2|3|4]/**/.coins.toString();
    };

    const [text, setText]=useState("");
    
    return(
        <View>
            <ModalText style={styles.modalText}>Select Difficulty:</ModalText>
            <View style={styles.difficultyTabs}>
                <DifficultyTabs mode = "Offline\n(Computer)" difficultyChooseBtn = {()=>handlePress(1)} selected={selected===1} difficultyTabImage={props.difficultyTabImage} disabled={props.level>XpLevelToUnlockGameMode.WicWacWoe[1]} ></DifficultyTabs>
                <DifficultyTabs mode = "Offline\n(Two Players)" difficultyChooseBtn = {()=>handlePress(2)} selected={selected===2} difficultyTabImage={props.difficultyTabImage} disabled={props.level>XpLevelToUnlockGameMode.WicWacWoe[2]} ></DifficultyTabs>
                <DifficultyTabs mode = "Multiplayer\n(Random)" difficultyChooseBtn = {()=>handlePress(3)} selected={selected===3} difficultyTabImage={props.difficultyTabImage} disabled={props.level>XpLevelToUnlockGameMode.WicWacWoe[3]} ></DifficultyTabs>
                <DifficultyTabs mode = "Multiplayer\n(With Friend)" difficultyChooseBtn = {()=>handlePress(4)} selected={selected===4} difficultyTabImage={props.difficultyTabImage} disabled={props.level>XpLevelToUnlockGameMode.WicWacWoe[4]} ></DifficultyTabs>
                </View>
            <Text style={{fontFamily: 'Wordlet-Regular', marginVertical: 10, lineHeight: 18, color: '#333333', fontSize: 15, textAlign: 'center'}}>{showUnlockingPromptMessage(props.level)}</Text>
            <Rewards coins={coins} xp={xp}></Rewards>
            {
              selected==4&&<View>
                <View style={{flexDirection: 'row', gap: 10, alignSelf: 'center', marginVertical: 10}}>
                <Pressable
                onPress={()=>setSubSelected(0)}
                style={subSelected==0?{transform:[{scale: 0.9}]}:undefined}
                >
                  <ImageBackground
                  source={buttons.pinkButton}
                  style={[styles.tabs]}
                  imageStyle={[styles.bgImage]}
                  >
                    {subSelected==0&& <View style={styles.selectedOption}></View>}
                   <Text style={[styles.tabTextForWordChains, {padding: 8}]}>Create Match</Text>   
                  </ImageBackground>
                </Pressable>
                <Pressable
                onPress={()=>setSubSelected(1)}
                style={subSelected==1?{transform:[{scale: 0.9}]}:undefined}
                >
                  <ImageBackground
                  source={buttons.goldenButton}
                  style={[styles.tabs]}
                  imageStyle={[styles.bgImage]}
                  >
                    {subSelected==1&& <View style={styles.selectedOption}></View>}
                   <Text style={[styles.tabTextForWordChains, {padding: 8}]}>Join Match</Text>   
                  </ImageBackground>
                </Pressable>
                </View>
                {
                  subSelected==1&&<View>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={(t) => { setText(t); props.setCode(t);}}
                  placeholder="Enter Code"
                  autoCapitalize="characters"
                  />
                  </View>
                }
                
              </View>
            }
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

function showUnlockingPromptMessage(xpLevel: number){
    let statement;

     xpLevel<XpLevelToUnlockGameMode.WicWacWoe[1]?statement=`You need to reach Experience Level ${XpLevelToUnlockGameMode.WicWacWoe[1]} to Unlock Offline (Computer) Mode`:
     xpLevel<XpLevelToUnlockGameMode.WicWacWoe[2]?statement=`You need to reach Experience Level ${XpLevelToUnlockGameMode.WicWacWoe[2]} to Unlock Offline (Two Players) Mode`:
     xpLevel<XpLevelToUnlockGameMode.WicWacWoe[3]?statement=`You need to reach Experience Level ${XpLevelToUnlockGameMode.WicWacWoe[3]} to Unlock Multiplayer (Random) Mode`:
     xpLevel<XpLevelToUnlockGameMode.WicWacWoe[4]?statement=`You need to reach Experience Level ${XpLevelToUnlockGameMode.WicWacWoe[4]} to Unlock Multiplayer (with Friend) Mode`:statement='';
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

  const IconText = (props: TextProps) => {
  return <Text style={[styles.iconText, props.style]} {...props} />;
};
