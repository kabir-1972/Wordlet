/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useEffect, useRef} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import {View, ImageBackground, Image, Animated, Pressable, ScrollView, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import {styles} from '../../source/styles/flashcard-create-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import { startShake } from '../../source/styles/ingame-styles';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './FlashCard-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { checkTheName } from './FlashCard-Data-Files';

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  const App = () => {
  
  
  const [profileDataRead, setProfileDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
  });

    const [_gameLoadingAnimationPrompt, setGameLoadingAnimationPrompt]=useState("");
    
    const _gameName='Flash Cards';

    const [nameOfFlashCardPacket, setNameOfFlashCardPacket]=useState("My Pack");
    const [descriptionOfPacket, setdescriptionOfPacket]=useState("");

    const [titleOfCard, setTitleOfCard]=useState("");
    const [hintOfCard, setHintOfCard]=useState("");

    const scale= new Animated.Value(1);
    const clearAllBtnScale = new Animated.Value(1);
   
    const frontFaceEditScale = new Animated.Value(1);
    const backFaceEditScale = new Animated.Value(1);

    const [isCheckingName, setIsCheckingName] = useState(false);
    const [frontFacePackVisibility, setFrontFaceVisibilty]=useState(true);
    const [backFacePackVisibility, setBackFaceVisibilty]=useState(true);

    const [flashCardNamePortionVisible, setFlashCardNamePortionVisible]=useState(false);
    const [flashCardPortionVisible, setFlashCardPortionVisible]=useState(true);
    
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [error, setErrorStatement] =React.useState("");
    const [size, setSize] =useState({width: 0, height: 0});
    
    const [frontFaceEdit, setFrontFaceEdit]=useState(true);
    const [backFaceEdit, setBackFaceEdit]=useState(false);

    const revealBtnScale=new Animated.Value(1);
    const hintBtnScale=new Animated.Value(1);
    const addToFavBtnScale=new Animated.Value(1);

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Matching files and set the board


/*Get the Profile Data and Wordle Scores Data First */

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

//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  if(!profileDataRead) return;
  const loadConfiguration = async () => {    
  setGameLoadingAnimationPrompt("Setting the FlashCard Form");

};
   loadConfiguration();
}, [profileDataRead]);


//                                __\(--)/__    Remains uneffected by previously saved data

/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist


const create = async () => {
   
  if (isCheckingName) return;
  setIsCheckingName(true);

  if (nameOfFlashCardPacket.length === 0) {
    setErrorStatement("Name of The Flash Card Packet cannot be Empty");
    setTimeout(() => setErrorStatement(""), 1000);
    setIsCheckingName(false);
    return;
  }
  const checkedResult = await checkTheName(nameOfFlashCardPacket);
  
  if (checkedResult) {
    setErrorStatement("A Flash Card Packet with that name already exists");
    setTimeout(() => setErrorStatement(""), 1000);
    setIsCheckingName(false);
    return;
  }

  setFlashCardNamePortionVisible(false);
  setFlashCardPortionVisible(true);
  
  setIsCheckingName(false);
};


  useEffect(() => {
  if (error) {startShake(shakeAnim);}
  }, [error]);

const editName=()=>{

}


  if(!profileDataRead) {
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
            
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              <HeaderInMatch
                xp={(profileData.playerLevel).toString()}
                coins={profileData.playerCoins}
                gameName={_gameName}
                gameMode={""}
            />
          {flashCardNamePortionVisible && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Name of the Flash Card Packet"
                  value={nameOfFlashCardPacket}
                  onChangeText={setNameOfFlashCardPacket}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={descriptionOfPacket}
                  onChangeText={setdescriptionOfPacket}
                />

                <View style={{ alignSelf: 'center' }}>
                  <Animated.View style={{ transform: [{ scale }] }}>
                    <Pressable
                      onPressIn={() => buttonPressIn(scale)}
                      onPressOut={() => buttonPressOut(scale)}
                      onPress={create}
                      disabled={isCheckingName}
                    >
                      <ImageBackground
                        source={buttons.tealButton}
                        style={styles.createFlashCardBtn}
                        imageStyle={{
                          resizeMode: 'stretch',
                          borderRadius: 6,
                          borderWidth: 1,
                        }}
                      >
                        <WordleText style={{ lineHeight: 24 }}>
                          {"Create Flash\nCard Pack"}
                        </WordleText>
                      </ImageBackground>
                      {isCheckingName&&<View style={styles.disabledButton}/>}
                    </Pressable>
                  </Animated.View>
                </View>
              </View>
            )}

            {flashCardPortionVisible&&<View>
            <View style={styles.nameOfThePack}>
            <WordleText>{nameOfFlashCardPacket}</WordleText>
            <Pressable
            onPress={editName}
            >
              <View style={styles.nameEditBtnContainer}>
                <Image
                  source={icons.editIcon}
                  style={{width: 20, height: 20}}
                ></Image>
              </View>
            </Pressable>
            </View>

            <View style={styles.createCardInfoContainer}>   
            <WordleText style={{textAlign: 'center', lineHeight: 20, fontSize: 16}}>{"Create Cards to Add in Your Pack"}</WordleText>
            </View> 

            <View style={{flexDirection: 'row', alignSelf: 'flex-end', gap: 1, marginRight: 20, marginTop: 10}}>
              <Pressable style={[styles.cardSelectionTab, frontFacePackVisibility?{backgroundColor: '#fffceb'}:undefined]}
              onPress={()=>setFrontFaceVisibilty(!frontFacePackVisibility)}
              >
                <WordleText>Front</WordleText>
              </Pressable>
              <Pressable style={[styles.cardSelectionTab, backFacePackVisibility?{backgroundColor: '#ffebfb'}:undefined]}
              onPress={()=>setBackFaceVisibilty(!backFacePackVisibility)}
              >
                <WordleText>Back</WordleText>
              </Pressable>
            </View>

            <View style={{flexDirection: 'row', gap: 5, marginTop: 10, marginHorizontal: 10, justifyContent: 'center'}}>
                {frontFacePackVisibility&&(<View style={{ flex: 1 }}>
                  <WordleText style={styles.cardHeading}>Front Face</WordleText>
                  <View style={[styles.theCard, {backgroundColor: '#d4ffe5'}, !backFacePackVisibility? {width: 200}: {width: '100%'}]}>
                    <View style={styles.cardTitle}>
                    <WordleText style={{fontSize: 25, textAlign: 'center', lineHeight: 30}}>{titleOfCard}</WordleText>
                    </View>
                    <View style={styles.hintOfTheCard}>
                    <WordleText style={{textAlign: 'center'}}>{hintOfCard}</WordleText>
                    </View>

                    <Animated.View style={{transform: [{scale: revealBtnScale}]}}>
                    <Pressable
                    onPressIn={()=>{buttonPressIn(revealBtnScale)}}
                    onPressOut={()=>{buttonPressIn(revealBtnScale)}}
                    onPress={()=>{}}
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
                    onPress={()=>{}}
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
                  </View>
                </View>)}

                {backFacePackVisibility&&(<View style={{ flex:1 }}>
                  <WordleText style={styles.cardHeading}>Back Face</WordleText>
                  <View style={[styles.theCard, {backgroundColor: '#d4fffe'}, !frontFacePackVisibility? {width: 200}: {width: '100%'}]}></View>
                </View>)}
            </View>
            </View>}

            <View style={{flexDirection: 'row', alignSelf: 'center', gap: 5, marginVertical: 20}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(frontFaceEditScale)}
                  onPressOut={()=>buttonPressOut(frontFaceEditScale)}
                  onPress={()=>{}}
                  >
                    <Animated.View style={{transform: [{scale: frontFaceEditScale}]}}>
                      <ImageBackground
                      source={buttons.tealButton}
                      style={{paddingHorizontal: 15, paddingVertical: 3}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center'}}>{"Edit\nFront Face"}</WordleText>
                      </ImageBackground>
                    </Animated.View>
                  </Pressable>
                  
                  <Pressable
                  onPressIn={()=>buttonPressIn(backFaceEditScale)}
                  onPressOut={()=>buttonPressOut(backFaceEditScale)}
                  onPress={()=>{}}
                  >
                    <Animated.View style={{transform: [{scale: backFaceEditScale}]}}>
                      <ImageBackground
                      source={buttons.pinkButton}
                      style={{paddingHorizontal: 15, paddingVertical: 3}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center'}}>{"Edit\nBack Face"}</WordleText>
                      </ImageBackground>
                    </Animated.View>
                  </Pressable>
            </View>       

              {frontFaceEdit&&<View style={styles.editTab}>        
                <View style={styles.cardEditHeading}>
                  <WordleText>Set The Title</WordleText>
                </View>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Title (maximum 100 characters)"
                  value={titleOfCard}
                  onChangeText={setTitleOfCard}
                  multiline={true}
                />

                <WordleText style={styles.characterPrompt}>{titleOfCard.length}/100</WordleText>
                <View style={styles.cardEditHeading}>
                  <WordleText>Set The Hint(s)</WordleText>
                </View>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Hint (maximum 250 characters)"
                  value={hintOfCard}
                  onChangeText={setHintOfCard}
                  multiline={true}
                />
                <WordleText style={styles.characterPrompt}>{hintOfCard.length}/250</WordleText>
              </View>
            }

            {
              backFaceEdit&&<View style={styles.editTab}>
                <WordleText>Heading</WordleText>
                
              </View>
            }    
          </ScrollView>
    </TouchableWithoutFeedback>

        <Animated.View 
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSize({ width, height });
          }}
        style={[{ transform: [{ translateX: Animated.add(shakeAnim, new Animated.Value(-size.width/2))}, {translateY: -size.height/2 }] }, styles.errorTextContainer]}>
      <View style={[styles.error,
        error == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><WordleText style={[styles.errorText]}>{error}</WordleText>
      </View>
        </Animated.View>
        </ImageBackground>

        <View
          style={{
            height: 60,
            backgroundColor: "#7cbbc2",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WordleText>Google Banner Ads Here!!!</WordleText>
        </View>
      </View>
/*   <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1 }}
  >
  </KeyboardAvoidingView> */
);

}

export default App;