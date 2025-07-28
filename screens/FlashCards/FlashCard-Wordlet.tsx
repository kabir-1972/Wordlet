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


export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

type FlashCard = {
  word: string,
  definition: string,
  partOfSpeech: string,
  exampleUsage: string,
  synonyms: string[],
  antonyms: string[]
}

type FlashCardMap = Record<string, FlashCard>;

const App=()=> {
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

  const [flashCardData, setFlashCardData]=useState<FlashCardMap>();

  const nextBtnScale=new Animated.Value(1);
  const previousBtnScale=new Animated.Value(1);
  const revealBtnScale=new Animated.Value(1);
  const hintBtnScale=new Animated.Value(1);
  const addToFavBtnScale=new Animated.Value(1);
  
  const [currentIndexOfCard, setCurrentIndexOfCard]=useState(1);
  const hintViewScale=useSharedValue(0);
  const animatedHintViewScale = useAnimatedStyle(()=>({
    transform: [{scale: hintViewScale.value}]
  }))



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
      
      const data=await RNFS.readFileAssets("flashcards.json");
      const JSONData=JSON.parse(data);
      setFlashCardData(JSONData);
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

  if(flashCardData)
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
                      gameMode={"Wordlet FlashCards"}
                  />
      <WordleText style={{textAlign: 'center', fontSize: 20, color: '#ffeebf', marginTop: 20}}>Card #{currentIndexOfCard}</WordleText>            
      <View style={styles.container}>
        <Reanimated.View style={[styles.card, styles.front, frontAnimatedStyle]}
        pointerEvents={!flipped ? 'auto' : 'none'}
        >
          <WordleText style={{fontSize: 25}}>
            {flashCardData[currentIndexOfCard].word}
          </WordleText>
          <Reanimated.View style={[{marginHorizontal: 10, marginTop: 5, backgroundColor: '#f7f5d7'}, animatedHintViewScale]}><WordleText style={{lineHeight: 22, paddingHorizontal: 3
          }}>
            {flashCardData[currentIndexOfCard].exampleUsage}
          </WordleText></Reanimated.View>
          
          <Animated.View style={{transform: [{scale: revealBtnScale}]}}>
                              <Pressable
                              onPressIn={()=>{buttonPressIn(revealBtnScale)}}
                              onPressOut={()=>{buttonPressOut(revealBtnScale)}}
                              onPress={flipCard}
                              >
                                <ImageBackground
                                  source={buttons.blueButton}
                                  style={styles.button}
                                  imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                <WordleText style={{color: '#444444'}}>Reveal</WordleText>
                                </ImageBackground>  
                              </Pressable>
                              </Animated.View>

                              <View style={styles.rowOfButtonsInCard}>
                              <Animated.View style={{transform: [{scale: hintBtnScale}]}}>
                              <Pressable
                              onPressIn={()=>{buttonPressIn(hintBtnScale)}}
                              onPressOut={()=>{buttonPressOut(hintBtnScale)}}
                              onPress={()=>{hintViewScale.value=withTiming(1, {duration: 500})}}
                              >
                                <ImageBackground
                                  source={buttons.tealButton}
                                  style={styles.button}
                                  imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                <WordleText style={{color: '#444444'}}>Hint</WordleText>
                                </ImageBackground>
                              </Pressable>
                              </Animated.View>
          
                              <Animated.View style={{transform: [{scale: addToFavBtnScale}]}}>
                              <Pressable
                              onPressIn={()=>{buttonPressIn(addToFavBtnScale)}}
                              onPressOut={()=>{buttonPressOut(addToFavBtnScale)}}
                              onPress={()=>{}}
                              >
                                <ImageBackground
                                  source={buttons.goldenButton}
                                  style={styles.button}
                                  imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                <WordleText style={{color: '#662200', textAlign: 'center'}}>{"Add to\nFavorites"}</WordleText>
                                </ImageBackground>
                              </Pressable>
                              </Animated.View>
                              </View>
        </Reanimated.View>
        <Reanimated.View style={[styles.card, styles.back, backAnimatedStyle]}
        pointerEvents={flipped ? 'auto' : 'none'}
        >
          <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{marginHorizontal: 10}}>
          <WordleText style={[styles.backFaceTitle, {backgroundColor: '#fffcde'}]}>Definition</WordleText>
          <WordleText style={styles.backFaceAnsEntry}>{flashCardData[currentIndexOfCard].definition}</WordleText>
          <WordleText style={[styles.backFaceTitle, {backgroundColor: '#deffe0'}]}>Part Of Speech</WordleText>
          <WordleText style={styles.backFaceAnsEntry}>{flashCardData[currentIndexOfCard].partOfSpeech}</WordleText>
          <WordleText style={[styles.backFaceTitle, {backgroundColor: '#defffa'}]}>Synonyms</WordleText>
          <WordleText style={styles.backFaceAnsEntry}>{flashCardData[currentIndexOfCard].synonyms.join(', ')}</WordleText>
          <WordleText style={[styles.backFaceTitle, {backgroundColor: '#ffc9ad'}]}>Antonyms</WordleText>
          <WordleText style={styles.backFaceAnsEntry}>{flashCardData[currentIndexOfCard].antonyms.join(', ')}</WordleText>
          </ScrollView>


                              <Animated.View style={{transform: [{scale: revealBtnScale}]}}>
                              <Pressable
                              onPressIn={()=>{buttonPressIn(revealBtnScale)}}
                              onPressOut={()=>{buttonPressOut(revealBtnScale)}}
                              onPress={flipCard}
                              >
                                <ImageBackground
                                  source={buttons.goldenButton}
                                  style={styles.button}
                                  imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                <WordleText>Flip Back</WordleText>
                                </ImageBackground>  
                              </Pressable>
                              </Animated.View>

        </Reanimated.View>
      </View>

    <View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'center', gap: 20}}>
      <Animated.View style={{transform: [{scale: previousBtnScale}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(previousBtnScale)}
        onPressOut={()=>buttonPressOut(previousBtnScale)}
        onPress={()=>{
          if(flipped) flipCard();
          setTimeout(()=>setCurrentIndexOfCard(currentIndexOfCard-1), 500)}}
          disabled={currentIndexOfCard<=1}
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
          {(currentIndexOfCard<=1)&&<View style={styles.disabledBtn}/>}  
        </Pressable>
      </Animated.View>

      <Animated.View style={{transform: [{scale: nextBtnScale}]}}>
        <Pressable
        onPressIn={()=>buttonPressIn(nextBtnScale)}
        onPressOut={()=>buttonPressOut(nextBtnScale)}
        onPress={()=>{
          if(flipped) flipCard();
          setTimeout(()=>setCurrentIndexOfCard(currentIndexOfCard+1), 500)
          }}
        disabled={currentIndexOfCard>=70}
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
          {(currentIndexOfCard>=70)&&<View style={styles.disabledBtn}/>} 
        </Pressable>
      </Animated.View>
    </View>
    </ScrollView>
  </ImageBackground> 
  </View>
  );
}

export default App;
