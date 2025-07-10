/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { startShake } from '../../source/styles/ingame-styles';
import {View, Text, ImageBackground, TextProps, Image, Animated, Pressable, ImageSourcePropType, UIManager, findNodeHandle, InteractionManager, ScrollView, BackHandler } from 'react-native';
import {styles} from '../../source/styles/crossword-match-styles';
import { buttons, icons } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { CrosswordKeyboard} from '../alphabet-keyboard';
import { WordleText, SmallerWhiteWordleText } from '../Skip-Game-Modal';

import LightSweep from '../../source/styles/ingame-animations';
import { HeaderInMatch } from './Crossword-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile } from '../AccessProfileData';
import { readCrosswordDataFile, saveCrosswordDataToFile, updateAccessoryDataInPreviousCrosswordFile,  } from './Crossword-Data-Files';
import  LottieView from 'lottie-react-native';
import { playerCrosswordData } from './Crossword-Data-Files';


/***
 * 
 * * * Checking the DocumentDirectoryPath Folder...
 * 
function readTheDir(){
  RNFS.readDir(RNFS.DocumentDirectoryPath)
  .then(files => {
    files.forEach(file => {
      console.log('Name:', file.name);
      /*console.log('Path:', file.path);
      console.log('Is file:', file.isFile());
    });
  })
  .catch(err => {
    console.log('Error reading directory:', err);
  });
}
*/ 

type CrosswordMatchRouteProp = RouteProp<RootStackParamList, 'ArcadeCrosswordMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let cols=5;
  let rows=5;

  let previouslySelectedId: number | null = null;
  let verticalOrHorizontal=0;

  type CheckedGridType = { [key: number]: number };

  const App = () => {
  const route = useRoute<CrosswordMatchRouteProp>();
  /*const route={
    params:{
      size: 1,
      level: 1
    }
  };
  */
  
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const  navigation = useNavigation<NavigationProp>();
  const [userLetters, setUserLetters] = useState<string[]>(Array(rows*cols).fill(""));
  const [wandedLetters, setWandedLetters]=useState<string[]>(Array(rows*cols).fill(""));
  
  const [wordNotFoundError, setWordNotFoundErrorStatement] =React.useState("");
  const [fileRead, setFileRead]=useState(false);
  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const [disallowedGrids, setDisAllowedGrids]=useState<number[]>([]);

  const [selectedGrids, setSelectedGrids]=useState<number[]>([]);
  const [currentlySelectedBox, setCurrentlySelectedBox]=useState(1);

  const [gameMode, setGameMode]=useState("");
  const [gameName, setGameName]=useState("");
  const [savedDataFileName, setSavedDataFileName]=useState("");
  const [profileDataRead, setProfileDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
  });

  const [_gameLoadingAnimationPrompt, setGaneLoadingAnimationPrompt]=useState("");

  const [placeHolders, setPlaceHolders]=useState<number[]>([]);
  const [acrossClues, setAcrossClues]= useState<{ [key: string]: { clue: string, answer: string } }>({});
  const [downClues, setDownClues]=useState<{ [key: string]: { clue: string, answer: string } }>({});
  const [answerLetters, setAnswerLetters]=useState<string[]>([]);

  //variable to hold which clue in the across 
  //and down is to be highlighted when user presses any of the crossword boxes

  const [acrossChosen, setAcrossChosen]=useState(0);
  const [downChosen, setDownChosen]=useState(0);
  
  const [showKeyboard, setShowKeyboard]=useState(false);
  const [confettiAnimation, setConfettiAnimation]=useState(false);

  const _gameName='Arcade Crossword';
  let _gameMode="Easy 5x5";

    useEffect(() => {
    if (wordNotFoundError) {startShake(shakeAnim);}
    }, [wordNotFoundError]);

/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

//First load the Profile Data
//Second read the route.params
//Third look for previously setup files
//Fourth get the score data
//Fifth read the Crossword files and set the board


/*Get the Profile Data and Wordle Scores Data First */
useEffect(()=>{
  async function loadProfileData() {
  setGaneLoadingAnimationPrompt("Getting Profile Data");
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
  setGaneLoadingAnimationPrompt("Setting the Crossword Size");
    let size, level;

    if (route.params) {
      size=route.params.size;
      level=route.params.level;
    }      
    
    switch(size){
        case 1: cols=rows=5; break;
        case 2: cols=rows=6; break;
        case 3: cols=rows=7; break;
        case 4: cols=rows=8; break;
        case 5: cols=rows=9; break;
        case 6: cols=rows=10; break;
        default: cols=rows=5; break;
    }
    const _savedDataFileName=`_${cols}x${rows}_level${level}${_gameName.replace(' ','-')}.json`;
    setSavedDataFileName(_savedDataFileName);
    setReadRouteParameters(true);
  };

  loadConfiguration();
}, [route.params, profileDataRead]);


//                                __\(--)/__    Remains uneffected by previously saved data
useEffect(() => {
  if (!readRouteParameters) return;

  async function readTheGameFile() {
    try {
      const gameDataFileName = "crossword-levels/arcade/"+rows+"x"+cols+"/level-" + route.params.level + ".json";
      const _content = await RNFS.readFileAssets(gameDataFileName);
      const content=JSON.parse(_content);
      const _placeholders=content.placeholder.split(',');

      const mappedPlaceholders=_placeholders.map((value: string)=>parseInt(value));
      setPlaceHolders(mappedPlaceholders);
      const acrossClues=content.across;
      const downClues=content.down;
      const answers=content.letters;
      const _disallowedGrids=content.disallowedGrids;
      const disallowedGridsArr=_disallowedGrids.split(',');
      const updatedDisallowedGridsArr = disallowedGridsArr
            .map((value:string) => parseInt(value))
            .filter((num:number) => !isNaN(num));

      const answersArray=answers.split('');
      setAnswerLetters(answersArray);

      setAcrossClues(acrossClues);
      setDownClues(downClues);
      setDisAllowedGrids(updatedDisallowedGridsArr);
      
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  readTheGameFile();
}, [readRouteParameters]);


function placeThePlaceHolder(row: number, col: number){
  const position=(row)*cols+col+1;
  if(disallowedGrids.includes(position)) return false;
  if(placeHolders.includes(position)) return true; 
  else return false;
}

function getThePlaceHolder(row: number, col: number){
  const position=(row)*cols+col+1;
  if(placeHolders.includes(position)) return (placeHolders.indexOf(position)+1); 
  else return 0;
}

  function keyPressed(key:string, selectedGrids: number[]){
    if(selectedGrids.length==0) return;
    setCheckedGrid({0:0});
    let currentTargetedBox=currentlySelectedBox-1;
    let roughString=userLetters.slice();
    
    if(key=='0'){
      roughString[currentTargetedBox]='';
      setUserLetters(roughString);
      updateAccessoryDataInPreviousCrosswordFile(savedDataFileName, wandedLetters, roughString, freeGridCheck);
      return;
    }

    else roughString[currentTargetedBox]=key;
      setUserLetters(roughString);
      updateAccessoryDataInPreviousCrosswordFile(savedDataFileName, wandedLetters, roughString, freeGridCheck);

      let newTargetedBox=currentlySelectedBox;

      if(selectedGrids[selectedGrids.indexOf(currentlySelectedBox)+1]!=undefined)  
      newTargetedBox=selectedGrids[selectedGrids.indexOf(currentlySelectedBox)+1];
      
      else{
        for(let i=0;i<selectedGrids.length;i++)
          if(roughString[selectedGrids[i]-1]==''){
            newTargetedBox=selectedGrids[i];
            break;
          }
      }
      if(newTargetedBox!=currentlySelectedBox)
        setCurrentlySelectedBox(newTargetedBox);
}
  
  async function submit(){
    let userLettersTemplate=[...userLetters];
    userLettersTemplate=userLetters.filter(value=>value!='');
    
    console.log(userLettersTemplate);

    if(userLettersTemplate.length!=answerLetters.length){

        setWordNotFoundErrorStatement("Crossword Not Solved");
        setTimeout(()=>setWordNotFoundErrorStatement(""), 1000);
        return;
    }

    for(let i=0;i<userLettersTemplate.length;i++){
      if(answerLetters[i]!=userLettersTemplate[i]){
        setWordNotFoundErrorStatement("Crossword Not Solved");
        setTimeout(()=>setWordNotFoundErrorStatement(""), 1000);
        return;
      }
    }
    setConfettiAnimation(true);
    setTimeout(()=>{setConfettiAnimation(false);
    playerCrosswordData(route.params.level, route.params.size, gameName);
    RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${savedDataFileName}`);
    navigation.navigate("CrosswordMatchEnd", {
      size: route.params.size,
      gameName: gameName,
      level: route.params.level,
    });
    }, 3000);
  }

  const scale = useRef(new Animated.Value(1)).current;
  const scaleWandRotateForBoxReveal = useRef(new Animated.Value(1)).current;
  const scaleGridRevelButton = useRef(new Animated.Value(1)).current;
  const scaleCheckGridButton = useRef(new Animated.Value(1)).current;
  
  const theKeyBoardVisibilityBtn = useRef(new Animated.Value(1)).current; 

function boxPressed(row: number, col: number){
    /**
     * Warning:::
     * This code catches the pressed box indices starting counting from row-1 col-1 instead of row-0 col-0, the usual one in CrosswordRow component
     * So we need to change the hasBeenSelected function a bit too
     */
    const gridSize=rows;
    const range=[];
    const id=(col+1)+gridSize*(row);
    setCurrentlySelectedBox(id);

    if(previouslySelectedId&&id==previouslySelectedId){
      verticalOrHorizontal=verticalOrHorizontal==1?0:1;
      previouslySelectedId=id;
    }
    else {
      previouslySelectedId=id;
      verticalOrHorizontal=0;
    }


    if(verticalOrHorizontal==0){
       for(let i=gridSize*(row)+1;i<=gridSize*(row+1);i++)
          range.push(i);
        let leftArray:number[]=[];
        let rightArray:number[]=[];

        range.forEach((value)=>{
              if(value<id)
                leftArray.push(value);
              else if(value>id)
                rightArray.push(value);
        })
          
        for(let i=leftArray.length-1; i>=0; --i){
          if(disallowedGrids.includes(leftArray[i]))
            leftArray=leftArray.slice(i+1);
        }

            
        for(let i=0; i<=rightArray.length; i++){
          if(disallowedGrids.includes(rightArray[i]))
            rightArray=rightArray.slice(0, i);
        }

        const finalArray=[...leftArray, id, ...rightArray];
        setSelectedGrids(finalArray);
        setAcrossChosen(1+placeHolders.indexOf(finalArray[0]));
        setDownChosen(0);
      }

      else{
            for(let i=col+1;i<=col+1+gridSize*(gridSize-1);i=i+gridSize)
                range.push(i);
              
            let topArray: number[]=[];
            let bottomArray: number[]=[];


            range.forEach((value)=>{
              if(value<id)
                topArray.push(value);
              else if(value>id)
                bottomArray.push(value);
            })
            
            for(let i=topArray.length-1; i>=0; --i){
              if(disallowedGrids.includes(topArray[i]))
                topArray=topArray.slice(i+1);
            }

            
            for(let i=0; i<=bottomArray.length; i++){
              if(disallowedGrids.includes(bottomArray[i]))
                bottomArray=bottomArray.slice(0, i);
            }

            const finalArray=[...topArray, id, ...bottomArray];
            setSelectedGrids(finalArray);
            setDownChosen(1+placeHolders.indexOf(finalArray[0]));
            setAcrossChosen(0);
      }
      console.log(acrossChosen, downChosen);
}

  /*
  * Final Verification for word submission
  */

/*    The buttons and their animations [LightWand and Starthrow]    */

    const [boxTriggerLightSweep, setBoxTriggerLightSweep] = useState(false);
    const [gridTriggerLightSweep, setGridTriggerLightSweep] = useState(false);
    const [gridCheckTriggerLightSweep, setGridCheckTriggerLightSweep] = useState(false);
    
    const [gridReveal, setGridReveal]=useState(true);
    const [boxReveal, setBoxReveal]=useState(true);
    const [gridCheck, setGridCheck]=useState(true);
    
    /*
    Grid checking remains free for the first 3 checks
    then it costs 25 each...
    */
    const [gridCheckCost, setGridCheckCost]=useState(0);
    const [freeGridCheck, setFreeGridCheck]=useState(3);
    
    //Store the first placeholders for the correct clues here
    //and mark the changes in the clues section
    const [checkedGrid, setCheckedGrid] = useState<CheckedGridType>({});
    

    const runBoxReveal = () => {
      if(wandedLetters[currentlySelectedBox-1]!=''||selectedGrids.length==0) return;
      setBoxReveal(false);
      setBoxTriggerLightSweep(true);

      setTimeout(()=>{setBoxReveal(true)
      setBoxTriggerLightSweep(false);
      }, 1000);
      
      let wandedLettersTemplate=[...wandedLetters];
      wandedLettersTemplate[currentlySelectedBox-1]=answerLetters[getTheCorrespondingIndex(currentlySelectedBox, disallowedGrids)];
      setWandedLetters(wandedLettersTemplate);
      updateAccessoryDataInPreviousCrosswordFile(savedDataFileName,
        wandedLettersTemplate,
        userLetters,
        freeGridCheck
      );

      let profileDataTemplate=profileData;
      profileDataTemplate.playerCoins=profileDataTemplate.playerCoins-10;
      updateCoinsInPreviousProfileFile(profileDataTemplate.playerCoins);
      setProfileData(profileDataTemplate);

     };


     const runGridReveal=()=>{
      if(selectedGrids.length==0||checkIfTheGridIsWanded(selectedGrids)) return;

      setGridReveal(false);
      setGridTriggerLightSweep(true);

      setTimeout(()=>{setGridReveal(true);
      setGridTriggerLightSweep(false);
      }, 1000);
      
      let wandedLettersTemplate=[...wandedLetters];
      for(let i=0;i<selectedGrids.length;i++)
      wandedLettersTemplate[selectedGrids[i]-1]=answerLetters[getTheCorrespondingIndex(selectedGrids[i], disallowedGrids)];
      
      setWandedLetters(wandedLettersTemplate);
      updateAccessoryDataInPreviousCrosswordFile(savedDataFileName,
        wandedLettersTemplate,
        userLetters,
        freeGridCheck
      );

      let profileDataTemplate=profileData;
      profileDataTemplate.playerCoins=profileDataTemplate.playerCoins-60;
      updateCoinsInPreviousProfileFile(profileDataTemplate.playerCoins);
      setProfileData(profileDataTemplate);
     }
 
    
     const runGridCheck = () => {
      setGridCheck(false);
      setTimeout(()=>{setGridCheck(true);
      setGridCheckTriggerLightSweep(false);
      }, 1000);

      let checkedGridTemplate: { [key: number]: number } = {};


      for(let i=0;i<selectedGrids.length;i++){
          if(userLetters[selectedGrids[i]-1]!=answerLetters[getTheCorrespondingIndex(selectedGrids[i], disallowedGrids)])
            checkedGridTemplate[selectedGrids[i] - 1] = -1;
          else checkedGridTemplate[selectedGrids[i] - 1] = 1;
      }
      setCheckedGrid(checkedGridTemplate);

      let profileDataTemplate=profileData;
      profileDataTemplate.playerCoins=profileDataTemplate.playerCoins-gridCheckCost;
      updateCoinsInPreviousProfileFile(profileDataTemplate.playerCoins);
      setProfileData(profileDataTemplate);

      let _freeGridCheck=freeGridCheck;
      if(_freeGridCheck>1)
      setFreeGridCheck(_freeGridCheck-1);

      if(_freeGridCheck==1)
        setGridCheckCost(50);  
      updateAccessoryDataInPreviousCrosswordFile(savedDataFileName,
        wandedLetters,
        userLetters,
        _freeGridCheck-1
      );    
     };

     
    function checkIfTheGridIsWanded(selectedGrids: number[]){
        for(let i=0;i<selectedGrids.length;i++)
          if(wandedLetters[selectedGrids[i]-1]=='') return false;
        return true;
    }

/* *************************************** Coding the Component JSX here ****************************************** */

  //Update the variables based on your file data
  //Else create the file if it does not exist


  useEffect(()=>{
    if(!readRouteParameters)
       return;
  async function loadData() {
  const savedData  =await readCrosswordDataFile(savedDataFileName);
  if(savedData){
    
  setGaneLoadingAnimationPrompt("Recovering Previously Saved Crosswords");
    setFileRead(true);
    setGameMode(_gameMode);
    setGameName(_gameName);
    /**/
    setWandedLetters(savedData.wandedLetters);
    setUserLetters(savedData.userLetters);
    setFreeGridCheck(savedData.freeGridCheck);
    
}
else{
  console.log("no file found");
  setGaneLoadingAnimationPrompt("Creating a new Crossword");
  setFileRead(true);
  setGameMode(_gameMode);
  setGameName(_gameName);

  
  await saveCrosswordDataToFile(
    savedDataFileName,
    wandedLetters,
    userLetters,
    freeGridCheck
  );
}
}
  loadData();
  },[readRouteParameters]);

//                                __\(--)/__    Changes by previously saved data

  if(!fileRead||!profileDataRead) {
   return(
   <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
          <GameLoadingAnimation gameLoadingAnimationPrompt={_gameLoadingAnimationPrompt}/>  
    </ImageBackground>

   )   
  }
  
  console.log(freeGridCheck);
  return(
    <View style={{ flex: 1 }}>
    <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
<ScrollView style={{ flex: 1 }}>
      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={gameMode}
      />

      {/* 
      <View>
      <Pressable  onPress={() => {readTheDir();}}>
        <Text style={{fontFamily: 'Wordlet-Regular', padding: 20}}>Read The Folder</Text>
      </Pressable>

      <Pressable  onPress={() => {
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${savedDataFileName}`);  
        console.log('File Deleted on being Clicked: '+savedDataFileName);
      }}>
        <Text style={{fontFamily: 'Wordlet-Regular', padding: 20}}>Delete The File</Text>
      </Pressable>
      </View>
      */}

      <View style={[styles.wordleContainer, {marginVertical: 5}]}>{
        Array.from({ length: rows }).map((_, index) => (
        <CrosswordRow 
        key={index}
        numberOfRow={index}
        characters={userLetters}
        wandedLetters={wandedLetters}
        disallowedGrids={disallowedGrids}
        boxPressed={boxPressed}
        selectedGrids={selectedGrids}
        placeThePlaceHolder={placeThePlaceHolder}
        getThePlaceHolder={getThePlaceHolder}
        selectedBox={currentlySelectedBox}
        checkedGrid={checkedGrid}
        />
      ))}
      </View>

      <View style={styles.clueContainer}>
        <View style={styles.acrossClueContainer}>
          <View style={styles.cluesText}>
            <WordleText style={{textAlign: 'center', fontSize: 20, color: 'darkgreen'}}>ACROSS</WordleText>
            <View style={{width: '95%', height: 2, backgroundColor: 'darkgreen', marginBottom: 10}}></View>
            {
            Object.entries(acrossClues).map(([key, value]) => (
            <View key={key} style={[{flexDirection: 'row', gap: 10, padding: 3, borderRadius: 2, alignItems: 'center', backgroundColor: '#9dd4b7', marginTop: 2}, acrossChosen==parseInt(key)?{backgroundColor: '#507562'}:undefined]}>
            <WordleText>{key}</WordleText>
            <WordleText style={{lineHeight: 23}}>{value.clue}</WordleText>
            </View>
            ))}
          </View>   
        </View>
        <View style={styles.downClueContainer}>
          <View style={styles.cluesText}>
            <WordleText style={{textAlign: 'center', fontSize: 20, color: '#207f9e'}}>DOWN</WordleText>
            <View style={{width: '95%', height: 2, backgroundColor: '#207f9e', marginBottom: 10}}></View>
            {
            Object.entries(downClues).map(([key, value]) => (
            <View key={key} style={[{flexDirection: 'row', gap: 10, padding: 3, borderRadius: 2, alignItems: 'center', backgroundColor: '#8cb1bd', marginTop: 2}, downChosen
            ==parseInt(key)?{backgroundColor: '#59747d'}:undefined]}>
            <WordleText>{key}</WordleText>
            <WordleText style={{lineHeight: 23}}>{value.clue}</WordleText>
            </View>
            ))}
          </View>
        </View>

      </View>{}

      {showKeyboard&&<CrosswordKeyboard onKeyPress={keyPressed} selectedGrids={selectedGrids}/>}

      <View style={styles.helpButtonRow}>
      <View>  
      <Animated.View style={{transform: [{ scale:scaleWandRotateForBoxReveal }] }} >
      <Pressable 
        onPressIn={()=>{if(!boxTriggerLightSweep)buttonPressIn(scaleWandRotateForBoxReveal)}}
        onPressOut={()=>{buttonPressOut(scaleWandRotateForBoxReveal)}}
        onPress={runBoxReveal}
        disabled={!boxReveal||selectedGrids.length==0||profileData.playerCoins<10}>
            <ImageBackground
                source={buttons.boxRevealButton}
                style={styles.wandRotate}
                imageStyle={styles.wandRotateImage}
            >       
            <LightSweep trigger={boxTriggerLightSweep} sweepHorizontal={50} startingPoint={30} />
            </ImageBackground>
            {(!boxReveal||selectedGrids.length==0||profileData.playerCoins<10) && (
          <View style={styles.disabledIconButton} pointerEvents="none"/>
            )}
      </Pressable>
      </Animated.View>
      <View style={styles.wandPriceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, ...profileData.playerCoins>50?{color: 'white'}:{color: 'red'}}}>10</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
      </View>

      <View>
      <Animated.View style={{transform: [{scale: scaleGridRevelButton}] }}>
      <Pressable 
      onPressIn={()=>{buttonPressIn(scaleGridRevelButton)}}
      onPressOut={()=>{buttonPressOut(scaleGridRevelButton)}}
      onPress={runGridReveal}
      disabled={!gridReveal||selectedGrids.length==0||profileData.playerCoins<60}
      >
          <ImageBackground
            source={buttons.gridRevealButton}
            style={[styles.stars]}
            imageStyle={styles.starsThrowImage}
          >
          <LightSweep trigger={gridTriggerLightSweep} sweepHorizontal={50} startingPoint={30} />
            </ImageBackground>
          {(profileData.playerCoins<60||!gridReveal||selectedGrids.length==0) && (
          <View style={styles.disabledIconButton} pointerEvents="none"/>
          )}
      </Pressable>
      </Animated.View>
      <View style={styles.starPriceContainer}>
      <SmallerWhiteWordleText style={{marginTop: 3, 
        ...profileData.playerCoins>120?{color: 'white'}:{color: 'red'}}}>60</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image>
      </View>
      </View>

      <View>
      <Animated.View style={{transform: [{scale: scaleCheckGridButton}] }}>
      <Pressable 
      onPressIn={()=>{buttonPressIn(scaleCheckGridButton)}}
      onPressOut={()=>{buttonPressOut(scaleCheckGridButton)}}
      onPress={runGridCheck}
      disabled={!gridCheck||selectedGrids.length==0||profileData.playerCoins<gridCheckCost}
      >
          <ImageBackground
            source={buttons.gridCheckButton}
            style={[styles.stars]}
            imageStyle={styles.starsThrowImage}
          >
          <LightSweep trigger={gridCheckTriggerLightSweep} sweepHorizontal={50} startingPoint={30} />
            </ImageBackground>
          {(!gridCheck||selectedGrids.length==0||profileData.playerCoins<gridCheckCost) && (
          <View style={styles.disabledIconButton} pointerEvents="none"/>
          )}
      </Pressable>
      </Animated.View>
      
        {gridCheckCost!=0?
      <View style={[styles.starPriceContainer, {backgroundColor: '#cdcdcd'}]}><SmallerWhiteWordleText style={{marginTop: 3, 
        ...profileData.playerCoins>gridCheckCost?{color: '#606060'}:{color: 'red'}}}>{gridCheckCost}</SmallerWhiteWordleText>
      <Image source={icons.coin} style={{width: 12, height: 12, resizeMode: 'stretch'}}></Image></View>:
      <View style={[styles.starPriceContainer, {backgroundColor: '#cdcdcd'}]}>
        <SmallerWhiteWordleText style={{color: '#444444', padding: 2, fontSize: 11}}>Free [{freeGridCheck}]</SmallerWhiteWordleText>
      </View>
        
      }
      </View>


      </View>


      <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }, styles.errorTextContainer]}>
      <View style={[styles.error,
        wordNotFoundError == "" && { backgroundColor: 'transparent', borderColor: 'transparent' }
      ]}><Text style={[styles.errorText]}>{wordNotFoundError}</Text>
      </View>
      </Animated.View>

      <Animated.View style={{transform: [{ scale }] }} >  
              <Pressable
              onPressIn={()=>{buttonPressIn(scale);}}
              onPressOut={() => {buttonPressOut(scale);}}
              onPress={() => submit()}
              style={{alignSelf:'center'}}
              >
              <ImageBackground
                source={buttons.submitButton}
                style={styles.submitBtnStyle}
                imageStyle={styles.submitBtnImage} 
              >
              </ImageBackground>
              </Pressable>
      </Animated.View>

</ScrollView>

      <Animated.View style={[styles.keyboardAnimation, { transform: [{ scale: theKeyBoardVisibilityBtn }] }]}>
        <Pressable 
        onPressIn={()=>buttonPressIn(theKeyBoardVisibilityBtn)}
        onPressOut={()=>buttonPressOut(theKeyBoardVisibilityBtn)}
        onPress={()=>{setShowKeyboard(!showKeyboard)}}

        style={styles.keyBoardBtn}>
          <Image
          source={icons.keyboardIcon}
          style={{width: 38, height: 38}}
          />
        </Pressable>
      </Animated.View>

    {
    confettiAnimation&&
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position:'absolute', top: 0, left: 0, right:0, bottom: 0, zIndex: 999 }}>
    <LottieView
        source={require('./../../assets/animations/confetti.json')} 
        autoPlay
        style={{ width: '100%', height: '100%' }}/>
    </View>
    }

    </ImageBackground>
        <View
      style={{
      height: 60,
      backgroundColor: '#7cbbc2',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
    <WordleText>Google Banner Ads Here!!!</WordleText>
  </View>
    </View>
);}


type CrosswordRowProps={
  characters: string[];
  numberOfRow: number;
  wandedLetters: string[];
  disallowedGrids: number[];
  boxPressed:(row: number, col: number)=>void;
  selectedGrids: number[];
  placeThePlaceHolder:(row: number, col: number)=>boolean;
  getThePlaceHolder:(row: number, col: number)=>number;
  selectedBox: number;
  checkedGrid: CheckedGridType;
}


 const CrosswordRow=(props:CrosswordRowProps)=>{
  const wandedLetters=props.wandedLetters;
  const disallowedBoxes=findTheDisAllowedBoxesInTheRow(props.numberOfRow, props.disallowedGrids);
  const preId=props.numberOfRow*rows;
  const checkedGrid=props.checkedGrid;

  return (
    <View style={[styles.wordleRow, {gap: 0.5, marginVertical: 0.5}]}>
      {Array.from({ length: cols }).map((_, i) => (
        <Pressable
          onPress={()=>props.boxPressed(props.numberOfRow, i)}
          key={i}
          style={[styles.wordleBox,
            {
              backgroundColor: disallowedBoxes.includes(i)? 'transparent' :(props.selectedBox==(preId+i+1))?'#03a39d': 
              hasBeenSelected(props.selectedGrids, props.numberOfRow, i, )?'#b4cccb':wandedLetters[preId+i]!=''?'#e4aab4':'#e0d9cc',
              borderWidth: disallowedBoxes.includes(i)? 0 : 1,
              borderRadius: 3,
            },
          ]}>
          {
          props.placeThePlaceHolder(props.numberOfRow, i) ? (
            <PlaceholderText>{props.getThePlaceHolder(props.numberOfRow, i)}</PlaceholderText>
          ) : null
          }
          {
            !disallowedBoxes.includes(i)?checkedGrid[preId+i]==-1?
            <Image
            source={icons.redCrossIcon}
            style={styles.cornerImage}
            ></Image>:
            checkedGrid[preId+i]==1?
            <Image
            source={icons.greenTickIcon}
            style={styles.cornerImage}
            ></Image>:
            null
            :null
          }

          {<Text
            style={[
              styles.wordleText,
              {color: getTheAppropriateLetter(props.characters, props.numberOfRow, i)!=''?'black':'#d48593'},
            ]}>
            {
            !disallowedBoxes.includes(i)?
            getTheAppropriateLetter(props.characters, props.numberOfRow, i)==''?
            wandedLetters[preId+i]:
            getTheAppropriateLetter(props.characters, props.numberOfRow, i):''
            }
          </Text>}
        </Pressable>
      ))}
    </View>
  );



};

export default App;

function findTheDisAllowedBoxesInTheRow(row: number, disallowedGrids: number[]){
    const columnsToConsider=[];
    for(let i=1; i<=cols; i++){
      if(disallowedGrids.includes(i+(row)*cols))
        columnsToConsider.push(i-1);
    } 
    return columnsToConsider;
}

function hasBeenSelected(selectedGrids: number[], row: number, col: number){
  const numberOfGrid=(row)*rows+col;
  const _selectedGrids = selectedGrids.map(value => value - 1);
  if(_selectedGrids.includes(numberOfGrid)) return true;
}

function getTheAppropriateLetter(characters: string[], row: number, col: number){
  let index=row*rows+col;
  return characters[index];
}

export const PlaceholderText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.wordleText, style, {position: 'absolute', top: 4, left: 4, fontSize: 12, color: '#696969'}]} {...rest}>
      {children}
    </Text>
    
  );
};

function getTheCorrespondingIndex(current: number, disallowedGrids: number[]){
  //let target=current;
  let disallowedGridsCount=0;
  for(let i=0;i<disallowedGrids.length;i++)
    if(disallowedGrids[i]<=current)
    disallowedGridsCount++;

  return current-1-disallowedGridsCount;
}

interface CorneredImageProps {
  source: ImageSourcePropType;
}

const CorneredImage: React.FC<CorneredImageProps> = ({ source}) => (
  <View style={styles.container}>
    <Image source={source} style={styles.cornerImage} />
  </View>
);