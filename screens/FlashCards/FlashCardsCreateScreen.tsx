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
import { SettingsData } from '../Profile2';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import { checkTheName } from './FlashCard-Data-Files';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  const App = () => {
  
  const navigation = useNavigation<NavigationProp>(); 
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

    const [headingsOfTheCard, setHeadingsOfTheCard]=useState<string[]>([""]);
    const [paragraphsOfTheCard, setParagraphsOfTheCard]=useState<string[]>([""]);

    const scale= new Animated.Value(1);
   
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
    const colorPallete : string[][]=[
      ['#FF6B6B', '#FFB74D', '#FFD93D', '#FF6EC7', '#FF8A5B'],
      ['#3A86FF', '#00B4D8', '#5E60CE', '#06D6A0', '#118AB2'],
      ['#FF0090', '#39FF14', '#FFD700', '#00FFFF', '#FF5F1F'],
      ['#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8'],
      ['#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F']
    ];

    const [colorPalleteIndex, setColorPalleteIndex]=useState(0);
    const [currentCardNumber, setCurrentNumber]=useState(1);

    const [numberOfCards, setNumberOfCards]=useState(0);

    const revealBtnScale=new Animated.Value(1);
    const hintBtnScale=new Animated.Value(1);
    const addToFavBtnScale=new Animated.Value(1);
    const addHeadingBtn=new Animated.Value(1);
    const addCardBtn= new Animated.Value(1);
    const deleteCardBtn = new Animated.Value(1);
    const saveCardPackBtn = new Animated.Value(1);
    const clearFrontFace=new Animated.Value(1);
    const clearBackFace=new Animated.Value(1);

    const removeHeadingParagraph=Array.from({length: paragraphsOfTheCard.length}, ()=>(new Animated.Value(1)));

    const colorPalleteIndices=Array.from({length: colorPallete.length}, ()=>(new Animated.Value(1)));
    const [deletedCards, setDeletedCards]=useState<number[]>([]);

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
  setFlashCardNamePortionVisible(!flashCardNamePortionVisible);
}

const addCard = async(cardNumber: number)=>{
    let errorFound=false;

    for(let i=0; i<paragraphsOfTheCard.length; i++){
      if(paragraphsOfTheCard[i].length==0||paragraphsOfTheCard[i].length>250){
        setErrorStatement("Paragraph "+(i+1)+" is too long or too short");
        setTimeout(()=>setErrorStatement(""), 1000);
        errorFound=true;
        break;
      }
    }

    for(let i=0; i<headingsOfTheCard.length; i++){
      if(headingsOfTheCard[i].length>100){
        setErrorStatement("Heading "+(i+1)+" is too long or too short");
        setTimeout(()=>setErrorStatement(""), 1000);
        errorFound=true;
        break;
      }
    }

    if(titleOfCard.length==0){
        setErrorStatement("Card Title For Front Face is missing");
        setTimeout(()=>setErrorStatement(""), 1000);
        errorFound=true;
    }

    if(titleOfCard.length>100){
        setErrorStatement("Title For Front Face is too long");
        setTimeout(()=>setErrorStatement(""), 1000);
        errorFound=true;
    }

    if(hintOfCard.length>250){
        setErrorStatement("Hint For Front Face is too long");
        setTimeout(()=>setErrorStatement(""), 1000);
        errorFound=true;
    }

    if(errorFound) return;

    const frontFace={
      title: titleOfCard,
      hint: hintOfCard
    }

   const backFace={
    headingsOfTheCard: headingsOfTheCard,
    paragraphsOfTheCard: paragraphsOfTheCard
   }
   
   const cardData={
    atFront: frontFace,
    atBack: backFace,
    colorPallete: colorPalleteIndex,
   }


   await AsyncStorage.setItem("card"+cardNumber, JSON.stringify(cardData));
   if(cardNumber==numberOfCards+1){
    setNumberOfCards(numberOfCards+1);
    setCurrentNumber(cardNumber+1);
  }

  setTitleOfCard("");
  setHeadingsOfTheCard([""]);
  setHintOfCard("");
  setParagraphsOfTheCard([""]);
}

const fetchCard=async(cardNumber: number)=>{
  setCurrentNumber(cardNumber);
  try{
    const cardData= await AsyncStorage.getItem("card"+cardNumber);
    if(cardData !==null){
      const JSONData=JSON.parse(cardData);
      setTitleOfCard(JSONData.atFront.title);
      setHintOfCard(JSONData.atFront.hint);
      setParagraphsOfTheCard(JSONData.atBack.paragraphsOfTheCard);
      setHeadingsOfTheCard(JSONData.atBack.headingsOfTheCard);
      setColorPalleteIndex(JSONData.colorPallete);
    }
    else{
        setErrorStatement("Card data is unavailable. Unknown error occured.");
        setTimeout(()=>setErrorStatement(""), 1000);
    }
  }
  catch{
        setErrorStatement("Card data is unavailable. Unknown error occured.");
        setTimeout(()=>setErrorStatement(""), 1000);
  }
}

const createCardPackAsFile=async()=>{
  const arrayOfCardsToChoose=[];
  for(let i = 1; i <= numberOfCards; i++){
    if(!deletedCards.includes(i))
      arrayOfCardsToChoose.push(i);
  }

  const dataOfTheCards: Record<string, string>={};
  for(let i = 0;i<arrayOfCardsToChoose.length; i++){
    const cardData=await AsyncStorage.getItem("card"+arrayOfCardsToChoose[i]);
    if(cardData) 
      dataOfTheCards[(i+1).toString()]=cardData;
  }

  const allData={
    description: descriptionOfPacket,
    data: dataOfTheCards
  }

  const folderPath = `${RNFS.DocumentDirectoryPath}/player-flash-cards`;
  const filePath = `${folderPath}/${nameOfFlashCardPacket}.json`;

await RNFS.mkdir(folderPath);
const exists = await RNFS.exists(filePath);
if(exists) {
  setErrorStatement("A Flash Card Packet with that name already has been created by you. Change the name.");
  setTimeout(()=>setErrorStatement(""), 1000);
}
await RNFS.writeFile(filePath, JSON.stringify(allData), 'utf8');
  setErrorStatement("Flash Card Packet" +nameOfFlashCardPacket+" created successfully.");
  setTimeout(()=>setErrorStatement(""), 1000);
  navigation.replace("FlashCardCreateScreen");  
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
                gameMode={"Create Yours"}
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
                  style={[styles.input, {height: 90, textAlignVertical: 'top', marginBottom: 8}]}
                  placeholder="Description"
                  value={descriptionOfPacket}
                  onChangeText={setdescriptionOfPacket}
                  multiline={true}
                />

                  {!flashCardPortionVisible&&<Animated.View style={{ alignSelf: 'center', transform: [{ scale }] }}>
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
                  </Animated.View>}
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

            {
              <ScrollView horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={[styles.theCardStackContainer, {width: '80%'}]}
              style={{alignSelf: 'center'}}
              >
                {Array.from({length: numberOfCards}).map((_, index)=>(                  
                  (!deletedCards.includes(index+1)&&<Pressable key={index} 
                  onPress={()=>fetchCard(index+1)}
                  style={styles.theCardInStack}><WordleText style={styles.cardNumberInStack}>{index+1}</WordleText></Pressable>)
                ))
                }
              </ScrollView>
            }

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
                    {titleOfCard.length>0&&<View style={styles.cardTitle}>
                    <WordleText style={{fontSize: 25, textAlign: 'center', lineHeight: 30}}>{titleOfCard}</WordleText>
                    </View>}
                    {hintOfCard.length>0&&<View style={styles.hintOfTheCard}>
                    <WordleText style={{textAlign: 'center'}}>{hintOfCard}</WordleText>
                    </View>}

                    <Animated.View style={{transform: [{scale: revealBtnScale}]}}>
                    <Pressable
                    onPressIn={()=>{buttonPressIn(revealBtnScale)}}
                    onPressOut={()=>{buttonPressOut(revealBtnScale)}}
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
                  <View style={[styles.theCard, {backgroundColor: '#d4fffe'}, !frontFacePackVisibility? {width: 200}: {width: '100%'}]}>
                    {
                      headingsOfTheCard.map((item, index)=>(
                        <View key={index}>
                          {item.length>0&&<WordleText style={[styles.headingsOfBackFace, {backgroundColor: colorPallete[colorPalleteIndex][index]}]}>{item}</WordleText>}
                          {paragraphsOfTheCard[index].length>0&&<WordleText style={styles.paragraphsOfBackFace}>{paragraphsOfTheCard[index]}</WordleText>}
                        </View>
                      ))
                    }
                  </View>
                </View>)}
            </View>
            </View>}

            <WordleText style={{textAlign: 'center', marginTop: 10, color: '#fcdaa7', fontSize: 20}}>Card #{currentCardNumber}</WordleText>
            <WordleText style={{fontSize: 16, textAlign: 'center', color: '#f9cffa', marginTop: 5}}>{currentCardNumber<=numberOfCards?"(Edit Mode)":""}</WordleText>
            <View style={{flexDirection: 'row', alignSelf: 'center', gap: 5, marginVertical: 20}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(frontFaceEditScale)}
                  onPressOut={()=>buttonPressOut(frontFaceEditScale)}
                  onPress={()=>{setBackFaceEdit(false); setFrontFaceEdit(true);}}
                  >
                    <Animated.View style={{transform: [{scale: frontFaceEditScale}]}}>
                      <ImageBackground
                      source={buttons.tealButton}
                      style={{paddingHorizontal: 15, paddingVertical: 3}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center'}}>{"Edit\nFront Face"}</WordleText>
                      </ImageBackground>
                  {frontFaceEdit&&<View style={[styles.disabledButton, {transform: [{scaleY: 1}]}]}></View>} 
                    </Animated.View> 
                  </Pressable>
                  
                  <Pressable
                  onPressIn={()=>buttonPressIn(backFaceEditScale)}
                  onPressOut={()=>buttonPressOut(backFaceEditScale)}
                  onPress={()=>{setFrontFaceEdit(false);setBackFaceEdit(true);}}
                  >
                    <Animated.View style={{transform: [{scale: backFaceEditScale}]}}>
                      <ImageBackground
                      source={buttons.pinkButton}
                      style={{paddingHorizontal: 15, paddingVertical: 3}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center'}}>{"Edit\nBack Face"}</WordleText>
                      </ImageBackground>
                    {backFaceEdit&&<View style={[styles.disabledButton, {transform: [{scaleY: 1}]}]}></View>} 
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
                  placeholder="Hint (optional, maximum 250 characters)"
                  value={hintOfCard}
                  onChangeText={setHintOfCard}
                  multiline={true}
                />
                <WordleText style={styles.characterPrompt}>{hintOfCard.length}/250</WordleText>

            <Animated.View style={{transform: [{scale: clearFrontFace}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(clearFrontFace)}
                onPressOut={()=>buttonPressOut(clearFrontFace)}
                onPress={()=>{setTitleOfCard(""); setHintOfCard("");}}
                >
                  <ImageBackground
                      source={buttons.redButton}
                      style={{paddingHorizontal: 15, paddingVertical: 6, alignSelf: 'center'}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center', color: '#faeccf'}}>{"Clear Face"}</WordleText>
                  </ImageBackground>
                </Pressable>
            </Animated.View>
              </View>
              }

            {
              backFaceEdit&&<View style={styles.editTab}>
                {Array.from({length: headingsOfTheCard.length}).map((_, index)=>(
                  <View key={index}>
                    {headingsOfTheCard.length>1&&<Animated.View style={{transform: [{scale: removeHeadingParagraph[index]}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(removeHeadingParagraph[index])}
                onPressOut={()=>buttonPressOut(removeHeadingParagraph[index])}
                onPress={()=>{
                  const _headingsOfTheCard=[...headingsOfTheCard.slice(0, index), ...headingsOfTheCard.slice(index + 1)];
                  const _paragraphsOfTheCard=[...paragraphsOfTheCard.slice(0, index), ...paragraphsOfTheCard.slice(index + 1)];
                  setHeadingsOfTheCard(_headingsOfTheCard);
                  setParagraphsOfTheCard(_paragraphsOfTheCard);
                }}
                >
                  <ImageBackground
                      source={buttons.closeModalButton}
                      style={{height: 25, aspectRatio: 1.10, alignSelf: 'flex-end', marginVertical: 8, marginRight: 6}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                  </ImageBackground>
                </Pressable>
                </Animated.View>}
                  <View style={styles.cardEditHeading}>
                  <WordleText>The Heading</WordleText>
                </View>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Heading (maximum 100 characters, can be empty)"
                  value={headingsOfTheCard[index]}
                  onChangeText={(text)=>{
                    const _headingsOfTheCard=[...headingsOfTheCard];
                    _headingsOfTheCard[index]=text;
                    setHeadingsOfTheCard(_headingsOfTheCard);
                  }}
                  multiline={true}
                />
                <WordleText style={styles.characterPrompt}>{headingsOfTheCard[index].length}/100</WordleText>

                <View style={styles.cardEditHeading}>
                  <WordleText>The Paragraph</WordleText>
                </View>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Paragraph (maximum 150 characters)"
                  value={paragraphsOfTheCard[index]}
                  onChangeText={(text)=>{
                    const _paragraphsOfTheCard=[...paragraphsOfTheCard];
                    _paragraphsOfTheCard[index]=text;
                    setParagraphsOfTheCard(_paragraphsOfTheCard);
                  }}
                  multiline={true}
                />
                <WordleText style={styles.characterPrompt}>{paragraphsOfTheCard[index].length}/250</WordleText>
                <View style={{flexDirection: 'row', gap: 5}}>
                  <View style={styles.bar}></View>
                  <LottieView source={require("../../assets/animations/laoshi-loader.json")} autoPlay loop style={{width: 15, transform: [{scale: 1.5}]}}/>
                  <View style={styles.bar}></View>
                  </View>

                </View>
                ))
                }

                {headingsOfTheCard.length<5&&<Animated.View style={{transform: [{scale: addHeadingBtn}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(addHeadingBtn)}
                onPressOut={()=>buttonPressOut(addHeadingBtn)}
                onPress={()=>{
                    const _paragraphsOfTheCard=[...paragraphsOfTheCard];
                    _paragraphsOfTheCard.push("");
                    setParagraphsOfTheCard(_paragraphsOfTheCard);

                    const _headingsOfTheCard=[...headingsOfTheCard];
                    _headingsOfTheCard.push("");
                    setHeadingsOfTheCard(_headingsOfTheCard);
                }}
                >
                  <ImageBackground
                      source={buttons.goldenButton}
                      style={{paddingHorizontal: 15, paddingVertical: 3, alignSelf: 'flex-end', marginVertical: 8, marginRight: 6}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center', lineHeight: 21}}>{"Add Heading\nand Paragraph"}</WordleText>
                  </ImageBackground>
                </Pressable>
                </Animated.View>
              }
  <WordleText style={{textAlign: 'center', color: '#dedeff', fontSize: 15}}>Set Color Pallete for The Card</WordleText>

              <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center', marginVertical: 6}}>
              {
              colorPallete.map((_, i)=>(
              <Animated.View key={i} style={{transform: [{scale: colorPalleteIndices[i]}]}}>
              <Pressable
              onPressIn={()=>buttonPressIn(colorPalleteIndices[i])}
              onPressOut={()=>buttonPressOut(colorPalleteIndices[i])}
              onPress={()=>{setColorPalleteIndex(i)}}
              >
              <ImageBackground
              source={buttons.whiteKey}
              style={{ width: 32, height: 36 ,alignItems: 'center', justifyContent: 'center'}}
              imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
              >
                <WordleText style={{fontSize: 20}}>{i+1}</WordleText>
              </ImageBackground>
              {colorPalleteIndex==i&&<View style={[styles.disabledButton, {transform: [{scaleY: 1.01}]}]}></View>}  
              </Pressable>           
              </Animated.View>
              ))
              }
              </View>

      <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center', marginVertical: 6}}>
              {
              colorPallete.map((_, index)=>
              <View key={index} style={{width: 15, height: 15, borderRadius: 4, backgroundColor: colorPallete[colorPalleteIndex][index]}}/>
              )
              }
      </View>
          <Animated.View style={{transform: [{scale: clearBackFace}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(clearBackFace)}
                onPressOut={()=>buttonPressOut(clearBackFace)}
                onPress={()=>{
                  const _paragraphsOfTheCard = paragraphsOfTheCard.map(() => "");
                  setParagraphsOfTheCard(_paragraphsOfTheCard);

                  const _headingsOfTheCard=headingsOfTheCard.map(()=> "");
                  setHeadingsOfTheCard(_headingsOfTheCard);
                }}
                >
                  <ImageBackground
                      source={buttons.redButton}
                      style={{paddingHorizontal: 15, paddingVertical: 6, alignSelf: 'center'}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center', color: '#faeccf'}}>{"Clear Face"}</WordleText>
                  </ImageBackground>
                </Pressable>
            </Animated.View>

              </View>
            }

          <View style={{marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10}}>
            <Animated.View style={{transform: [{scale: addCardBtn}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(addCardBtn)}
                onPressOut={()=>buttonPressOut(addCardBtn)}
                onPress={()=>{setTimeout(()=>addCard(currentCardNumber), 0)}}
                >
                  <ImageBackground
                      source={buttons.violetButton}
                      style={{paddingHorizontal: 15, paddingVertical: 10}}
                      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                      >
                        <WordleText style={{textAlign: 'center', color: '#faeccf'}}>{currentCardNumber<=numberOfCards?"Edit Card":"Add Card"}</WordleText>                       
                  </ImageBackground>
                </Pressable>
            </Animated.View>  
            {
            currentCardNumber<=numberOfCards&&
            <Animated.View style={{transform: [{scale: deleteCardBtn}]}}>
                <Pressable
                onPressIn={()=>buttonPressIn(deleteCardBtn)}
                onPressOut={()=>buttonPressOut(deleteCardBtn)}
                onPress={()=>{
                  setDeletedCards(prev=>{
                  if (!prev.includes(currentCardNumber)) return [...prev, currentCardNumber];
                    return prev;
                  });
                  setTitleOfCard("");
                  setHeadingsOfTheCard([""]);
                  setHintOfCard("");
                  setParagraphsOfTheCard([""]);
                  setCurrentNumber(numberOfCards+1);
                }}
                >
                  <ImageBackground
                    source={buttons.redButton}
                    style={{paddingHorizontal: 15, paddingVertical: 10}}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                  >
                    <WordleText style={{textAlign: 'center', color: '#f4f2ff'}}>Delete Card</WordleText>    
                  </ImageBackground>
                </Pressable>
            </Animated.View>
            }
          </View>

          <Animated.View style={{alignSelf: 'center', marginBottom: 20, transform: [{scale: saveCardPackBtn}]}}>
            <Pressable
                onPressIn={()=>buttonPressIn(deleteCardBtn)}
                onPressOut={()=>buttonPressOut(deleteCardBtn)}
                onPress={()=>{
                  createCardPackAsFile();
                }}
            >
               <ImageBackground
                    source={buttons.goldenButton}
                    style={{paddingHorizontal: 15, paddingVertical: 6}}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                  >
                    <WordleText style={{textAlign: 'center', color: '#252525', lineHeight: 20}}>{"Save\nCard Pack"}</WordleText>    
                </ImageBackground>
            </Pressable>
          </Animated.View>

          </ScrollView>
    </TouchableWithoutFeedback>

        <Animated.View 
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSize({ width, height });
          }}
        style={[{ transform: [{ translateX: Animated.add(shakeAnim, new Animated.Value(-size.width/2))}] }, styles.errorTextContainer]}>
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
);


}

export default App;