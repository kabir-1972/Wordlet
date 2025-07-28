import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated, ImageBackground, ScrollView} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {styles} from '../../source/styles/flashcard-view-styles';
import { icons } from '../../source/styles/assets';
//import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { RouteProp, useRoute } from '@react-navigation/native';

import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { useEffect } from 'react';
import { SettingsData } from '../Settings';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { HeaderInMatch } from './FlashCard-Header-inmatch';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import { buttons } from '../../source/styles/assets';
import { WordleText } from '../Skip-Game-Modal';
import RNFS from 'react-native-fs';

type FlashCardViewRouteProp = RouteProp<RootStackParamList, 'FlashCardViewScreen'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const App=()=> {
  const route=useRoute<FlashCardViewRouteProp>();

  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const flipCard = () => {
    setFlipped((prev) => !prev);
    rotation.value = withTiming(flipped ? 0 : 180, { duration: 600 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
    };
  });

  const [profileDataRead, setProfileDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
      profileName: "Wordleteer",
      playerXP: 1,
      playerCoins: 500,
      playerLevel: 1,
      lastMatch: "",
  });
  
  const [flashcardDataRead, setFlashcardDataRead]=useState(true);
  const [_gameLoadingAnimationPrompt, setGameLoadingAnimationPrompt]=useState("");
  const _gameName='Flash Cards';

  const [flashCardData, setFlashCardData]=useState<any>();

  const nextBtnScale=new Animated.Value(1);
  const previousBtnScale=new Animated.Value(1);


  useEffect(()=>{
    async function loadProfileData() {
    setGameLoadingAnimationPrompt("Getting Profile Data");
    const savedData = await readProfileDataFile();
    if(savedData){
      setProfileDataRead(true);
      const _profileData={
          profileName: savedData.profileName,
          playerXP: savedData.playerXP,
          playerCoins: savedData.playerCoins,
          playerLevel: savedData.playerLevel,
          lastMatch: savedData.lastMatch,
      }
      setProfileData(_profileData);
  }
  else{
    setProfileDataRead(true);
  
    await saveProfileDataToFile(
      profileData.profileName,
      profileData.playerXP,
      profileData.playerCoins,
      profileData.playerLevel,
      profileData.lastMatch,
    );
  }
  }
    loadProfileData();
  },[]);

  useEffect(() => {
    if(!profileDataRead) return;
    const loadTheFlashCardData = async () => {    
      setGameLoadingAnimationPrompt("Getting the FlashCard Data");
      const name=route.params.name;
      
      setFlashcardDataRead(true);
  };
     loadTheFlashCardData();
  }, [profileDataRead]);

if(!profileDataRead||!flashcardDataRead) {
   return(
   <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
          <GameLoadingAnimation gameLoadingAnimationPrompt={_gameLoadingAnimationPrompt}/>  
    </ImageBackground>
   )   
  }

  return (
  <View style={{ flex: 1 }}>
          <ImageBackground
            source={SettingsData.background}
            style={styles.background}
            resizeMode="cover"
          >
      <ScrollView style={{ flex: 1 }}>
                    <HeaderInMatch
                      xp={(profileData.playerLevel).toString()}
                      coins={profileData.playerCoins}
                      gameName={_gameName}
                      gameMode={"Use FlashCards"}
                  />
    <Pressable onPress={flipCard}>
      <View style={styles.container}>
        <Reanimated.View style={[styles.card, styles.front, frontAnimatedStyle]}>
          <WordleText>Front</WordleText>
        </Reanimated.View>
        <Reanimated.View style={[styles.card, styles.back, backAnimatedStyle]}>
          <WordleText>Back</WordleText>
        </Reanimated.View>
      </View>
    </Pressable>

    <View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'center', gap: 20}}>
      <Animated.View style={{transform: [{scale: previousBtnScale}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(previousBtnScale)}
        onPressOut={()=>buttonPressOut(previousBtnScale)}
        onPress={()=>{}}
        >
          <ImageBackground
          source={buttons.tealButton}
          style={{minWidth: 75}}
          imageStyle={{resizeMode: 'cover', borderRadius: 4, borderWidth: 1}}
          >
            <Image source={icons.leftArrow}
            style={{width: 20, height: 20, alignSelf: 'center', marginTop: 5}}
            />
            <WordleText style={{paddingHorizontal: 6, paddingVertical: 5, paddingTop: 3, textAlign: 'center'}}>Previous</WordleText>
          </ImageBackground>  
        </Pressable>
      </Animated.View>

      <Animated.View style={{transform: [{scale: nextBtnScale}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(nextBtnScale)}
        onPressOut={()=>buttonPressOut(nextBtnScale)}
        onPress={()=>{}}
        >
        <ImageBackground
          source={buttons.blueButton}
          style={{minWidth: 75}}
          imageStyle={{resizeMode: 'cover', borderRadius: 4, borderWidth: 1}}
          >
            <Image source={icons.rightArrow}
            style={{width: 20, height: 20, alignSelf: 'center', marginTop: 5}}
            />
            <WordleText style={{paddingHorizontal: 6, paddingVertical: 5, paddingTop: 3, textAlign: 'center'}}>Next</WordleText>
          </ImageBackground>
        </Pressable>
      </Animated.View>
    </View>
    </ScrollView>
  </ImageBackground> 
  </View>
  );
}

export default App;
