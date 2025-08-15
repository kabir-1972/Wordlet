import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated, ImageBackground, ScrollView} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {styles} from '../../source/styles/player-flash-card-styles';
import { icons } from '../../source/styles/assets';
//import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { RouteProp, useRoute } from '@react-navigation/native';

import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { useEffect } from 'react';
import { SettingsData } from '../Profile2';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { HeaderInMatch } from './FlashCard-Header-inmatch';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import { buttons } from '../../source/styles/assets';
import { WordleText } from '../Skip-Game-Modal';
import RNFS from 'react-native-fs';
import { getTheNamesOfTheCard } from './FlashCard-Data-Files';
import { useNavigation } from '@react-navigation/native';

type FlashCardViewRouteProp = RouteProp<RootStackParamList, 'FlashCardViewScreen'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const App=()=> {
  const route=useRoute<FlashCardViewRouteProp>();
  const  navigation = useNavigation<NavigationProp>();
  
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
  const [cardDeleteModalVisibility, setCardDeleteModalVisibility]=useState(false);
  const [cardChosenForDeletion, setCardChosenForDeletion]=useState("");

  const [descriptionScaleUp, setDescriptionScaleUp]=useState<number|null>();


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
      const cardData=await getTheNamesOfTheCard();
      
      setFlashCardData(cardData);
      setFlashcardDataRead(true);
  };
     loadTheFlashCardData();
  }, [profileDataRead]);


if(!profileDataRead||!flashcardDataRead||!flashCardData) {
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
                gameMode={"Your FlashCards"}
            />
        <View style={{marginTop: 20}}>
            <View style={{alignSelf: 'center', backgroundColor: '#a4fce8', borderRadius: 4, marginBottom: 10}}><WordleText style={{fontSize: 16, paddingHorizontal: 15, paddingVertical: 2}}>Your FlashCards</WordleText></View>
      <View style={{marginHorizontal: 20}}>
            {Array.from({length: flashCardData.length}).map((_, index)=>(
              <View key={index}>
              <View style={{flexDirection: 'row', alignItems: 'center', borderRadius: 4, backgroundColor: '#e6f2ef'}}>
                <View style={{paddingVertical: 10, paddingHorizontal: 15}}><WordleText>{index+1}</WordleText></View>
                <View style={{width: 1.5, height: '70%', backgroundColor: '#333333'}}/>
                <Pressable onPress={()=>{navigation.navigate("FlashCardViewScreen", {name: flashCardData[index].name})}} style={{paddingHorizontal: 10, flex: 1}}>
                <View>
                    <WordleText>{flashCardData[index].name}</WordleText>
                    <View style={{flexDirection: 'row'}}>
                        <WordleText style={styles.date}>{flashCardData[index].date}</WordleText>
                        <View style={{flex: 1}}></View>
                    </View>
                </View>
                </Pressable>
                <View style={{flexDirection: 'row', gap: 4, marginRight: 15}}>
                   <View style={{backgroundColor: '#51fccf', padding: 5, borderRadius: 4}}><Image source={icons.share} style={styles.icons}/></View>
                   <View style={{backgroundColor: '#d683fc', padding: 5, borderRadius: 4}}><Image source={icons.upload} style={styles.icons}/></View>
                   <Pressable onPress={()=>{navigation.navigate("EditFlashCard", {name: flashCardData[index].name})}}
                   ><View style={{backgroundColor: '#faeb89', padding: 5, borderRadius: 4}}><Image source={icons.editIcon} style={styles.icons}/></View></Pressable>
                   <Pressable onPress={()=>{
                    setCardChosenForDeletion(index.toString());
                    setTimeout(()=>setCardDeleteModalVisibility(true), 1000);
                    }}><View style={{backgroundColor: '#fa8989', padding: 5, borderRadius: 4}}><Image source={icons.blackDeleteIcon} style={styles.icons}/></View></Pressable>
                   <Pressable onPress={()=>{
                      if(descriptionScaleUp==-1) setDescriptionScaleUp(index);
                      else setDescriptionScaleUp(-1);

                    console.log(descriptionScaleUp);
                   }}><View style={{backgroundColor: '#838dfc', padding: 5, borderRadius: 4}}><WordleText style={[styles.icons, {textAlign: 'center', fontSize: 22}]}>i</WordleText></View></Pressable>
                </View>
            </View>
            <View style={[{marginHorizontal: 10, marginTop: 5, backgroundColor: '#f7f5d7', display: descriptionScaleUp != index ? 'flex' : 'none'}]}>
              <WordleText style={{lineHeight: 22, paddingHorizontal: 3, fontSize: 15}}>{flashCardData[index].description}</WordleText>
            </View>
        </View>))}
      </View>

            </View>          
        </ScrollView>
  </ImageBackground> 
  </View>
  );
}

export default App;
