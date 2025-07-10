/**
 * Confetti, coin, assistance, endgameScreen
 */

import React, {useState, useRef, useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { startShake } from '../../source/styles/ingame-styles';
import {View, Modal, ImageBackground, Animated, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import {styles} from '../../source/styles/wicwacwoe-match-styles';
import { buttons, icons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import RNFS from 'react-native-fs';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types';
import { WordleText } from '../Skip-Game-Modal';
import { HeaderInMatch } from './WicWacWoe-Header-inmatch';
import { GameLoadingAnimation } from '../Game-Loading-Animation';
import { SettingsData } from '../Settings';
import { ProfileData, updateCoinsInPreviousProfileFile, readProfileDataFile, saveProfileDataToFile, updateXpsAndCoinsInPreviousProfileFile } from '../AccessProfileData';
import  LottieView from 'lottie-react-native';

import { WordLadderKeyBoard } from '../alphabet-keyboard';
import { Rewards } from '../Rewards';

type WicWacWoeMatchRouteProp = RouteProp<RootStackParamList, 'WicWacWoeMatch'>;
export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

  let coins: number;
  let xp: number;
  let verticalOrHorizontal=1;
  let _roughString: string="";

  
  let floatingBoxIsVisible = false;
  let currentlySelectedBlock = 0;
  let currentPlayer = 1;

  let computerTries = 0;

  let floatingboxtimeOut: NodeJS.Timeout;

  const App = () => {
  const route = useRoute<WicWacWoeMatchRouteProp>();

  /*
  const route={
    params:{
      type: 1
    }
  };
  */
  const  navigation = useNavigation<NavigationProp>();
  const [gameEndString, setGameEndString]=useState("");
  const [gameEndModalVisibility, setGameEndModalVisibility]=useState(false);

  const [readRouteParameters, setReadRouteParameters] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [profileDataRead, setProfileDataRead]=useState(false);
  const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
  });

    const [_gameLoadingAnimationPrompt, setGameLoadingAnimationPrompt]=useState("");
    const [confettiAnimation, setConfettiAnimation]=useState(false);
    
  const gameName='Wic Wac Woe';
  let _gameMode: string;

  const [gameMode, setGameMode]=useState("");
  const [wordsPrepared, setWordsPrepared]=useState(false);
  const [roughString, setRoughString]=useState("");
  const [gameError, setGameErrorStatement] =useState("");
  const [gameInstructions, setGameInstructions]=useState("");

  const rowsRepeat=3;
  const colsRepeat=3;
  const rows=3;
  const cols=3;

const screenWidth=Dimensions.get('window').width;
const _boxWidth=(screenWidth-3-20)/(rows*cols);
const boxWidth=_boxWidth>30?30:_boxWidth;

const returnToHomeBtnScale=new Animated.Value(1);
const replayMatchBtnScale=new Animated.Value(1);


/* Listed are all the use Effects for this match...*/

// Series of useEffect Settings....

// First load the Profile Data
// Second read the route.params
// Third set the board


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
  setGameLoadingAnimationPrompt("Setting the Wic Wac Woe");
    let gameRewardData: {xp: number, coins: number};
    if (route.params) {
    switch(route.params.type){
      case 1: gameRewardData=Rewards.WicWacWoe[1]; _gameMode="Offline Computer"; break;
      case 2: gameRewardData=Rewards.WicWacWoe[2]; _gameMode="Offline Two Players"; break;
      case 3: gameRewardData=Rewards.WicWacWoe[3]; _gameMode="Multiplayer"; break;
      case 4: gameRewardData=Rewards.WicWacWoe[4]; _gameMode="Multiplayer"; break;
      default: gameRewardData=Rewards.WicWacWoe[1]; _gameMode="Offline Computer"; break;
    }

    xp=gameRewardData.xp; coins=gameRewardData.coins;
    setGameMode(_gameMode);
    setReadRouteParameters(true);
  }
};

  loadConfiguration();
}, [route.params, profileDataRead]);
/**/

//                                __\(--)/__    Remains uneffected by previously saved data
const [allWords, setAllWords]=useState<string[]>([""]);
const [selectedGrids, setSelectedGrids]=useState<number[]>([]);


const [player1Words, setPlayer1Words]=useState<string[]>([]);
const [player2Words, setPlayer2Words]=useState<string[]>([]);

useEffect(() => {
  if (!readRouteParameters) return;

  async function preListTheWords() {
    try {
      const content=await RNFS.readFileAssets("letter-based-words/three-letter-words.txt");
      const words=content.split(",\r\n");
      
      setAllWords(words);
      setWordsPrepared(true);
    } catch (error) {
      console.log("File not found or error reading:", error);
    }
  }

  preListTheWords();
}, [readRouteParameters]);

/* *************************************** Coding the Component JSX here ****************************************** */
 
const submitBtnScale = new Animated.Value(1);
const eyeBtnScale = new Animated.Value(1);

const [wordBoxVisibility, setWordBoxVisibilty]=useState(false);

const floatingBoxScale = useRef(new Animated.Value(0)).current;
const topPosition = useRef(new Animated.Value(0)).current;
const leftPosition = useRef(new Animated.Value(0)).current;
const [submitBtnEnabled, setSubmitBtnEnabled]=useState(true);

const [characters, setCharacters]=useState(Array(rows*rowsRepeat*cols*colsRepeat).fill(""));

function setTheNewPositionOfTheFloatingBox(index: number){
    
    const largeRowNo=Math.ceil(index/(cols*colsRepeat*rows))-1;
    const largeColNo=Math.ceil((index-largeRowNo*cols*colsRepeat*rows)/9)-1;
    
    const _topPosition=3.5 + largeRowNo * boxWidth * 3 + largeRowNo * 5;
    const _leftPosition=3.5 + largeColNo * boxWidth * 3 + largeColNo *5;

    
    currentlySelectedBlock=(largeRowNo)*colsRepeat+largeColNo+1;
    currentPlayer*=-1;

    if(!floatingBoxIsVisible){
        Animated.parallel([
          Animated.timing(topPosition, {
          toValue: _topPosition,
          duration: 500,
          useNativeDriver: true,
          }),
          Animated.timing(leftPosition, {
          toValue: _leftPosition,
          duration: 500,
          useNativeDriver: true,
          }),
          Animated.timing(floatingBoxScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          })
        ]).start(() => {floatingBoxIsVisible=true;});
    }
    else{
      Animated.parallel([
        Animated.timing(topPosition, {
        toValue: _topPosition,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(leftPosition, {
        toValue: _leftPosition,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    }
}

function checkForAllowableWordsInTheBlock(){
  const _characters=[...characters];
  const probableSubGrids=[[1,2,3], [7,8,9], [1,4,7], [3,6,9]];
  probableSubGrids.forEach((subArr, i) => {
      subArr.forEach((subSubArr, j) => {
      probableSubGrids[i][j] = subSubArr + currentlySelectedBlock;
        });
      });
  const setOfCharacters:string[][]=[];
  for(let i=0; i<probableSubGrids.length; i++){
      setOfCharacters[i] = [];
    for(let j=0; j<probableSubGrids[i].length; j++)
      setOfCharacters[i][j]=_characters[probableSubGrids[i][j]-1];
  }

  const finalSetOfCharacters=setOfCharacters.filter(innerArray=>{
    const strFromInnerArray=innerArray.join('');
    return strFromInnerArray.length === 2;
  });

  let foundAPlaceToInsertANewWord=false;

  for(let i=0; i< finalSetOfCharacters.length; i++){
      const firstWord = finalSetOfCharacters[i][0];
      const lastWord = finalSetOfCharacters[i][finalSetOfCharacters[i].length-1];
      for (const item of allWords) {
    if (item.startsWith(firstWord.toLowerCase()) && item.endsWith(lastWord.toLowerCase())) {
        foundAPlaceToInsertANewWord = true; break;
    }}
    if(foundAPlaceToInsertANewWord) break; 
  }

  if(!foundAPlaceToInsertANewWord)
    endtheMatch("There is no such word to be placed in that block");
}

useEffect(()=>{
  if(!profileDataRead||!readRouteParameters||!wordsPrepared) return;
  if(route.params.type==1&&currentPlayer==-1) giveTheChanceToComputer();
  else setSubmitBtnEnabled(true);
    checkForAllowableWordsInTheBlock();
}, [characters]);

function checkForSubmission(){
  _roughString=roughString;

  if(_roughString.length!=3) {
          setGameErrorStatement("Only three letter words are allowed");
          setTimeout(()=>setGameErrorStatement(""), 1000);
          return;
  }

  if(player1Words.includes(_roughString)||player2Words.includes(_roughString)){
          setGameErrorStatement("The word has already been used");
          setTimeout(()=>setGameErrorStatement(""), 1000);
          return;
  }
  
  if(selectedGrids.length!=3){
          setGameErrorStatement("There is no selected grid");
          setTimeout(()=>setGameErrorStatement(""), 1000);
          return;
  }

  const key=selectedGrids.sort((a, b) => a - b)[0];
  const blockPosition=Math.ceil(key/(cols*colsRepeat));
  
  if(currentlySelectedBlock!=0&&blockPosition!=currentlySelectedBlock){
          setGameErrorStatement("You are not in the correct grid. Go to the marked grid.");
          setTimeout(()=>setGameErrorStatement(""), 1000);
          return;
  }

  let validPositioningOfWord=true;
  let noNewPositionFound=false;

  if(allWords.includes(_roughString.toLowerCase())){
    if(selectedGrids.length==3){
      setSubmitBtnEnabled(false);
      let _characters=[...characters];
      if(_characters[selectedGrids[0]-1]==''&&_characters[selectedGrids[1]-1]==''&&_characters[selectedGrids[2]-1]==''){
        for(let i=0;i<selectedGrids.length;i++)
          _characters[selectedGrids[i]-1]=_roughString[i];
            
            let alphabeticalIndex=_roughString[_roughString.length-1].toUpperCase().charCodeAt(0)-64;
            
            let rotations=0;
            while(_characters[alphabeticalIndex-1]!=''){
                    alphabeticalIndex+=26;
                    rotations++;
                    if(alphabeticalIndex>81) {
                      noNewPositionFound=true;
                      break;}
              }  
            if(!noNewPositionFound){
            if(currentPlayer==1)
              {
                const _player1Words=[...player1Words];
                _player1Words.push(_roughString);
                setPlayer1Words(_player1Words);
              }
            else{
                const _player2Words=[...player2Words];
                _player2Words.push(_roughString);
                setPlayer2Words(_player2Words);
            }  
            
            setRoughString("");
            setTheNewPositionOfTheFloatingBox(alphabeticalIndex);
            alertTheUserAboutTheFloatingBox(_roughString[_roughString.length-1],alphabeticalIndex, rotations);
            _roughString="";

            setCharacters(_characters);
            }
            else{
                setGameErrorStatement("The word cannot be placed since there is no free cell");
                setTimeout(()=>setGameErrorStatement(""), 1000);
                  
                currentPlayer*=-1;
                _roughString="";
                if(route.params.type==1) giveTheChanceToComputer();
                else setSubmitBtnEnabled(true);
            } 
        }
        else{
          for(let i=0;i<selectedGrids.length;i++){
            const characterToLookFor=_characters[selectedGrids[i]-1];
            if(characterToLookFor=="")
              _characters[selectedGrids[i]-1]=_roughString[i];
            else if(characterToLookFor!=roughString[i]){
              validPositioningOfWord=false;
              break;
            }
            }
          
        if(!validPositioningOfWord){
          setGameErrorStatement("The word cannot be placed in this grid since there is a mismatch in the letters");
          setTimeout(()=>setGameErrorStatement(""), 1000);
          
          _roughString="";
          currentPlayer*=-1;
          if(route.params.type==1) giveTheChanceToComputer();
          else setSubmitBtnEnabled(true);
        }
        else{
            let alphabeticalIndex=_roughString[_roughString.length-1].toUpperCase().charCodeAt(0)-64;
            let rotations=0;
            while(_characters[alphabeticalIndex-1]!=''){
                    alphabeticalIndex+=26;
                    rotations++;
                    if(alphabeticalIndex>81) {
                      noNewPositionFound=true;
                      break;}
            }    
            if(!noNewPositionFound){
            setRoughString("");
            setTheNewPositionOfTheFloatingBox(alphabeticalIndex);
            alertTheUserAboutTheFloatingBox(_roughString[_roughString.length-1],alphabeticalIndex, rotations);
            _roughString="";

            setCharacters(_characters);
            }
            else{
                setGameErrorStatement("The word cannot be placed since there is no free cell");
                setTimeout(()=>setGameErrorStatement(""), 1000);
              }
            }
        }
      }
    else {
          setGameErrorStatement("You need to select a grid");
          setTimeout(()=>setGameErrorStatement(""), 1000);
    }
  }
  else {
    setGameErrorStatement("Not a valid word");
    setTimeout(()=>setGameErrorStatement(""), 1000);
    _roughString="";
    currentPlayer*=-1;
    
    if(route.params.type==1) giveTheChanceToComputer();
    else setSubmitBtnEnabled(true);

  }
}

function endtheMatch(prompt: string){
  if(player1Words.length>player2Words.length&&route.params.type==1){
    const _profileData=profileData;
    _profileData.playerXP+=xp;
    _profileData.playerCoins+=coins;
    setProfileData(_profileData);
    updateXpsAndCoinsInPreviousProfileFile(_profileData.playerXP, _profileData.playerCoins);
  }

  setGameEndString(prompt);
  setGameEndModalVisibility(true);
}


function giveTheChanceToComputer(){
  if(currentlySelectedBlock==0){
        const probableSubGrids=[[1,2,3], [7,8,9], [1,4,7], [3,6,9]];
        const startingOfTheBlock = cols*colsRepeat*(Math.floor(Math.random()*9));
        const verticalOrHorizontal = Math.floor(Math.random() * 2);

        const __characters=[...characters];
        
        probableSubGrids.forEach((subArr, i) => {
          subArr.forEach((subSubArr, j) => {
            probableSubGrids[i][j] = subSubArr + startingOfTheBlock;
            });
          });
        
        let subSelectedGrids: number[]=[];    

        if(verticalOrHorizontal==0)
           subSelectedGrids=probableSubGrids[Math.floor(Math.random()*2)];
        else
           subSelectedGrids=probableSubGrids[2+Math.floor(Math.random()*2)];

          let aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];

          while(player1Words.includes(aRandomWord)||player2Words.includes(aRandomWord))
            aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];

            aRandomWord=aRandomWord.toUpperCase();

          let computerRoughString="";
          let z=0;
          let noNewPositionFound=false;

          let alphabeticalIndex=aRandomWord[aRandomWord.length-1].charCodeAt(0)-64;
          let rotations=0;
            while(__characters[alphabeticalIndex-1]!=''){
                    alphabeticalIndex+=26;
                    rotations++;
                    if(alphabeticalIndex>81) {
                      noNewPositionFound=true;
                      break;
                    }
          }

          if(!noNewPositionFound) typeCharacter();
            
            else{
                computerTries++;
                if(computerTries==1500){
                  setGameErrorStatement("Computer could not be place a word in any of the grids.");
                  setTimeout(()=>setGameErrorStatement(""), 1000);
                  setSubmitBtnEnabled(true); 
                  return; 
                }
                giveTheChanceToComputer();
            }

          function typeCharacter() {
            if (z < aRandomWord.length) {
                computerRoughString += aRandomWord[z];
                setRoughString(computerRoughString);
                z++;
              setTimeout(typeCharacter, 400);
            }
            else {
            _roughString="";
            
            for(let i=0;i<subSelectedGrids.length;i++)
                  __characters[subSelectedGrids[i]-1]=aRandomWord[i].toUpperCase();
            
            setRoughString("");
            setPlayer2Words(prev=>[...prev, aRandomWord]);
            alertTheUserAboutTheFloatingBox(aRandomWord[aRandomWord.length-1], alphabeticalIndex, rotations);
            setTheNewPositionOfTheFloatingBox(alphabeticalIndex);
            setSubmitBtnEnabled(true);
            setCharacters(__characters);
            }
          } 
  }
  else{
        const probableSubGrids=[[1,2,3], [7,8,9], [1,4,7], [3,6,9]];
        const startingOfTheBlock = cols*colsRepeat*(currentlySelectedBlock-1);
        let aRandomWord="";

        const __characters=[...characters];
        

        probableSubGrids.forEach((subArr, i) => {
          subArr.forEach((subSubArr, j) => {
            probableSubGrids[i][j] = subSubArr + startingOfTheBlock;
            });
          });
        
        const probableSubSelectedGrids: number[][]=[];    
        const charactersGroupToConsider=[];
        const finalCharactersToConsider=[];

        let noWordsCouldBePicked=false;

        for(let i=0; i<probableSubGrids.length; i++)
          charactersGroupToConsider.push([__characters[probableSubGrids[i][0]-1], __characters[probableSubGrids[i][1]-1], __characters[probableSubGrids[i][2]-1]]);

        for(let i=0; i<charactersGroupToConsider.length;i++){
          if(charactersGroupToConsider[i].join('').length!=3){
            finalCharactersToConsider.push(charactersGroupToConsider[i]);
            probableSubSelectedGrids.push(probableSubGrids[i]);
          }
        }

          if(finalCharactersToConsider[0].join('')==""){
            aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];
          while(player1Words.includes(aRandomWord)||player2Words.includes(aRandomWord))
            aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];
          
          for(let j=0; j<aRandomWord.length; j++)
            __characters[probableSubSelectedGrids[0][j]-1]=aRandomWord[j].toUpperCase();
          }
          else{
            let thePreviouslySetWord=finalCharactersToConsider[0];
            
            //The first Character is not empty, but the last one is...
            
            if(thePreviouslySetWord[0]!=''){
            let wordPickingCount=0;
              
               aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];

          while(player1Words.includes(aRandomWord)||player2Words.includes(aRandomWord)||aRandomWord[0].toUpperCase()!=thePreviouslySetWord[0].toUpperCase()){
              aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];
              wordPickingCount++;
              if(wordPickingCount==1500){
                setGameErrorStatement("Computer could not find a word to be placed in any of the grids.");
                setTimeout(()=>setGameErrorStatement(""), 1000);
                setConfettiAnimation(true);
                endtheMatch("Computer could not find a word to be placed in any of the grids.");
                noWordsCouldBePicked=true;
                break;
              }
          }
          for(let j=0; j<aRandomWord.length; j++)
              __characters[probableSubSelectedGrids[0][j]-1]=aRandomWord[j].toUpperCase();
            }

            //The last Character is not empty, but the last one is...

            else{
            let wordPickingCount=0;
              
               aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];
               aRandomWord=aRandomWord.toUpperCase();
          while(player1Words.includes(aRandomWord)||player2Words.includes(aRandomWord)||aRandomWord[aRandomWord.length-1]!=thePreviouslySetWord[thePreviouslySetWord.length-1].toUpperCase()){
              aRandomWord=allWords[Math.floor(Math.random()*allWords.length)];
              
              aRandomWord=aRandomWord.toUpperCase();
              wordPickingCount++;
              if(wordPickingCount==1500){
                setGameErrorStatement("Computer could not find a word to be placed in any of the grids.");
                setTimeout(()=>setGameErrorStatement(""), 1000);
                setConfettiAnimation(true);
                endtheMatch("Computer could not find a word to be placed in any of the grids.");
                noWordsCouldBePicked=true;
                break;
              }
          }
          for(let j=0; j<aRandomWord.length; j++)
              __characters[probableSubSelectedGrids[0][j]-1]=aRandomWord[j];
            }
          }

        if(noWordsCouldBePicked||aRandomWord.length==0) return;
          
          let computerRoughString="";
          let z=0;
          let noNewPositionFound=false;

          let alphabeticalIndex=aRandomWord[aRandomWord.length-1].toUpperCase().charCodeAt(0)-64;
          let rotations=0;
            while(__characters[alphabeticalIndex-1]!=''){
                    alphabeticalIndex+=26;
                    rotations++;
                    if(alphabeticalIndex>81) {
                      noNewPositionFound=true;
                      break;
                    }
          }

          if(!noNewPositionFound) typeCharacter();
            
            else{
                computerTries++;
                if(computerTries==1500){
                  setGameErrorStatement("Computer could not place a word in any of the grids.");
                  setTimeout(()=>setGameErrorStatement(""), 1000);
                  setSubmitBtnEnabled(true);
                  return;
                }
                giveTheChanceToComputer();
            }

          function typeCharacter() {
            
            if (z < aRandomWord.length) {
                computerRoughString += aRandomWord[z];
                setRoughString(computerRoughString);
                z++;
              setTimeout(typeCharacter, 400);
            }
            else {

            setRoughString("");
            alertTheUserAboutTheFloatingBox(aRandomWord[aRandomWord.length-1], alphabeticalIndex, rotations);
            setPlayer2Words(prev=>[...prev, aRandomWord]);
            setTheNewPositionOfTheFloatingBox(alphabeticalIndex);
            setCharacters(__characters);
            setSubmitBtnEnabled(true);
            }
          } 
  }
}

function alertTheUserAboutTheFloatingBox(lastStr: string, index: number, rotations: number){
  let cardinal="";  
  let gridNoCardinal="";

  if(index%10==1&&index!=11) cardinal=index+"st";
  else if(index%10==2&&index!=12) cardinal=index+"nd";
  else if(index%10==3&&index!=13) cardinal=index+"rd";
  else cardinal=index+"th";


  let gridNo=Math.ceil(index/9);

  if(gridNo%10==1&&gridNo!=11) gridNoCardinal=gridNo+"st";
  else if(gridNo%10==2&&gridNo!=12) gridNoCardinal=gridNo+"nd";
  else if(gridNo%10==3&&gridNo!=13) gridNoCardinal=gridNo+"rd";
  else gridNoCardinal=gridNo+"th";


  if(floatingboxtimeOut) clearTimeout(floatingboxtimeOut);

    setGameInstructions("Found "+lastStr.toUpperCase()+" as the last letter. Found the "+cardinal+" square in the "+gridNoCardinal+" grid after "+rotations+" rotation(s).");
    floatingboxtimeOut=setTimeout(()=>setGameInstructions(""), 4000);
}

function keyPressed(key: string){
  if(key!='0'){
    _roughString+=key;
    setTimeout(()=>(
      setRoughString(_roughString)
    ),0);
  }
  else{
  if(_roughString.length>0){
    _roughString=_roughString.slice(0, -1);
    setTimeout(()=>(
      setRoughString(_roughString)
    ),0);
  }
  }
}

useEffect(() => { if (gameError!="") {startShake(shakeAnim);}}, [gameError]);
const hiddenKeys:number[]=[5, 14, 23, 32, 41, 50, 59, 68, 77];

function boxPressed(key: number){
    if(selectedGrids.includes(key))
      verticalOrHorizontal=Math.abs(1-verticalOrHorizontal);
    if(hiddenKeys.includes(key-1)||hiddenKeys.includes(key+1))
      verticalOrHorizontal=0;
    else if(hiddenKeys.includes(key-3)||hiddenKeys.includes(key+3))
      verticalOrHorizontal=1;

          let subSelectedGrids:number[]=[];
          let fallsIntoHiddenKeys=false;
          const blockPosition=Math.ceil(key/(cols*colsRepeat));
          
          if(currentlySelectedBlock!=0&&blockPosition!=currentlySelectedBlock) return;
          const startingOfTheBlock=1+cols*colsRepeat*(blockPosition-1);
          const difference=key-startingOfTheBlock;

        if(verticalOrHorizontal==0){
          if(difference>=0&&difference<=2)
            subSelectedGrids=[key, key+3, key+6];
          else if(difference>2&&difference<=5) 
            subSelectedGrids=[key-3, key, key+3];
          else subSelectedGrids=[key-6, key-3, key];

          hiddenKeys.forEach((item)=>{
            if(subSelectedGrids.includes(item)) fallsIntoHiddenKeys=true; 
          })

        }
        else{
          if(difference==0||difference==3||difference==6)
            subSelectedGrids=[key, key+1, key+2];
          else if(difference==1||difference==4||difference==7) 
            subSelectedGrids=[key-1, key, key+1];
          else subSelectedGrids=[key-2, key-1, key];

          hiddenKeys.forEach((item)=>{
            if(subSelectedGrids.includes(item)) fallsIntoHiddenKeys=true; 
          })
        }
  
          if(!fallsIntoHiddenKeys)
            setSelectedGrids(subSelectedGrids);
}

/*
useEffect(()=>{
  if(profileDataRead&&readRouteParameters&&wordsPrepared){
    setTheNewPositionOfTheFloatingBox(index);
    }
  },
[profileDataRead,readRouteParameters,wordsPrepared, index]);
*/

  if(!profileDataRead||!readRouteParameters||!wordsPrepared) {
   return(
   <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
          <GameLoadingAnimation gameLoadingAnimationPrompt={_gameLoadingAnimationPrompt}/>  
    </ImageBackground>
   )   
  }
  

  return(
    <View style={{ flex: 1 }}>
    <ImageBackground
          source={SettingsData.background}
          style={styles.background}
          resizeMode="cover">
<ScrollView style={{ flex: 1}} contentContainerStyle={{flexGrow: 1}}>

      <HeaderInMatch
      xp={(profileData.playerLevel).toString()}
      coins={profileData.playerCoins}
      gameName={gameName}
      gameMode={""}
      />
    <View style={{backgroundColor: '#fcdec7c0', alignSelf: 'center', paddingVertical: 4, marginVertical: 10, paddingHorizontal: 10, borderRadius: 4}}>
        <WordleText style={{fontSize: 16}}>{currentPlayer==1?"Player 1's turn":route.params.type==1?"Computer's turn":"Player 2's turn"}
        </WordleText>
    </View>  


    <View style={{alignSelf: 'center'}}>    
    {
      Array.from({ length: rowsRepeat }).map((_, k) => (
        <View key={`row-${k}`} style={{ flexDirection: 'row', gap: 3, marginBottom: 3 }}>
          {
            Array.from({ length: colsRepeat }).map((_, g) => (
              <View key={`grid-${k}-${g}`} style={{borderRadius: 5, overflow: 'hidden', borderWidth: 1}}>
                {
                  Array.from({ length: rows }).map((_, i) => (
                    <View key={`grid-${k}-${g}-row-${i}`} style={{ flexDirection: 'row' }}>
                      {
                        Array.from({ length: cols }).map((_, j) => {
                          const key=rows*cols*(k*colsRepeat+g)+i*cols+j+1;
                          return (
                          <Pressable
                            key={key}
                            onPress={()=>boxPressed(key)}
                          >
                          <View
                            style={[{ width: boxWidth, height: boxWidth, alignItems: 'center', justifyContent: 'center'}, selectedGrids.includes(key)?{backgroundColor: '#b4cccb', borderWidth: 0.5 }:!hiddenKeys.includes(key)?{backgroundColor: '#fcf4e3', borderWidth: 0.5 } :null,]}
                          >
                            <WordleText style={{ fontSize: 18 }}>{characters[key-1]}</WordleText>
                          </View>
                          </Pressable>
                        )})
                      }
                    </View>
                  ))
                }
              </View>
            ))
          }
        </View>
      ))
    }
    
    {
      <Animated.View style={[styles.floatingWindow, {pointerEvents: 'none', width: boxWidth*3-5, height: boxWidth*3-5, top:0, left: 0, transform: [{scale: floatingBoxScale}, {translateY: topPosition}, {translateX: leftPosition}]}]}></Animated.View>
    }
    </View>

{gameError!=""&&<Animated.View style={{transform: [{ translateX: shakeAnim }], marginHorizontal: 20, backgroundColor: '#24242470', marginVertical: 10, borderRadius: 3}} >
  <WordleText style={styles.errorText}>{gameError}</WordleText>
</Animated.View>}

{gameInstructions!=""&&<Animated.View style={{marginHorizontal: 20, backgroundColor: '#24242470', marginVertical: 10, borderRadius: 3}} >
  <WordleText style={[styles.errorText, {lineHeight: 20}]}>{gameInstructions}</WordleText>
</Animated.View>}

{wordBoxVisibility&&<View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
  {player1Words.length>0&&<View style={styles.wordBox}>
    <WordleText style={styles.wordBoxHeading}>Player 1's Words</WordleText>
    {
      player1Words.map((item, index)=>(
        <WordleText key={"player-1-"+index} style={styles.wordsInTheBox}>{item}</WordleText>
      ))
    }
  </View>}
  {player2Words.length>0&&<View style={styles.wordBox}>
    <WordleText style={styles.wordBoxHeading}>{route.params.type==1?'Computer':'Player 2'}'s Words</WordleText>
    {
      player2Words.map((item, index)=>(
        <WordleText key={"player-2-"+index} style={styles.wordsInTheBox}>{item}</WordleText>
      ))
    }
  </View>}
  
  </View>}

<View style={{flexDirection: 'row', marginHorizontal: 20, alignItems: 'center'}}>
    <Animated.View style={{transform: [{scale: eyeBtnScale}]}}>
    <Pressable
    onPressIn={()=>buttonPressIn(eyeBtnScale)}
    onPressOut={()=>buttonPressOut(eyeBtnScale)}
    onPress={()=>setWordBoxVisibilty(prev=>!prev)/*setIndex(index+9)*/}
    >
      <ImageBackground
      source={buttons.redButton}
      style={{width: 35, height: 35, alignItems: 'center', justifyContent: 'center'}}
      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
        <Image
        source={icons.eye}
        style={{width: 22, height: 22}}
        ></Image>
      </ImageBackground>
    </Pressable>

  </Animated.View>
<View style={{flex: 1}}>
  <View style={styles.theRoughString}>
    {roughString.split('').map((item, index)=>(
      <WordleText key={index} style={styles.lettersInListOfWords}>{item.toUpperCase()}</WordleText>
    ))
    }
  </View>
</View>

  <Animated.View style={{transform: [{scale: submitBtnScale}]}}>
    <Pressable
    onPressIn={()=>buttonPressIn(submitBtnScale)}
    onPressOut={()=>buttonPressOut(submitBtnScale)}
    onPress={()=>checkForSubmission()}
    disabled={!submitBtnEnabled}
    >
      <ImageBackground
      source={buttons.tealButton}
      style={{width: 35, height: 35, alignItems: 'center', justifyContent: 'center'}}
      imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
      >
        <Image
        source={icons.rightUpArrow}
        style={{width: 22, height: 22}}
        ></Image>
        {!submitBtnEnabled&&<View style={styles.disabledButton}></View>}
      </ImageBackground>
    </Pressable>

  </Animated.View>
</View>
<View>
    <WordLadderKeyBoard onKeyPress={keyPressed}/>
    {!submitBtnEnabled&&<View style={{width: '100%', backgroundColor: '#00000060', height: 150, position: 'absolute'}}></View>}
</View>
</ScrollView>
    {
    confettiAnimation&&
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position:'absolute', top: 0, left: 0, right:0, bottom: 0, zIndex: 999 }}>
    <LottieView
        source={require('./../../assets/animations/confetti.json')} 
        autoPlay
        style={{ width: '100%', height: '100%' }}/>
    </View>
    }

    <Modal
            transparent
            visible={gameEndModalVisibility}
            onRequestClose={() => setGameEndModalVisibility(false)}
          >
            <View style={styles.container}>
              <ImageBackground 
              source={modalBackgrounds.whiteModalBackgroundImg}
              style={styles.backgroundImage}
              imageStyle={{resizeMode: 'stretch'}}
              >
            <View style={styles.modalBackground}>
                <WordleText>Its Game Over, Chief!</WordleText>
                <WordleText style={styles.matchEndTextPrompts}>{gameEndString}</WordleText>
                <WordleText style={{fontSize: 16, marginVertical: 5}}>Words Created by Player 1</WordleText>
                <View style={{marginBottom: 5, height: 3, width: '80%', alignSelf: 'center', backgroundColor: '#04806b'}}></View>
                <View style={styles.matchEndWordBox}>
                {
                  player1Words.map((item, index)=>(<WordleText key={index} style={{fontSize: 15, color: '#222222'}}>{item}</WordleText>))
                }
                </View>
                <WordleText style={{fontSize: 16, marginVertical: 5}}>Words Created by {route.params.type==2?"Player 2":"Computer"}</WordleText>
                <View style={{marginBottom: 5, height: 3, width: '80%', alignSelf: 'center', backgroundColor: '#04806b'}}></View>
                <View style={styles.matchEndWordBox}>
                {
                  player2Words.map((item, index)=>(<WordleText key={index}  style={{fontSize: 15, color: '#222222'}}>{item}</WordleText>))
                }
                </View>
                <WordleText style={[styles.matchEndTextPrompts, {backgroundColor: '#a9fcdb', color: '#002919'}]}>
                  {player1Words.length==player2Words.length?`Both of them has created equal number of words. The match is tied`:`Player 1 has created ${Math.abs(player1Words.length-player2Words.length)} words ${player1Words.length>player2Words.length?'more': 'less'} than ${route.params.type==1?'Computer':'Player 2'}
                 `}
                   </WordleText>
                  <View style={{flexDirection: 'row', gap: 20, marginTop: 10}}>
                    <Animated.View style={{transform: [{scale: returnToHomeBtnScale}]}}>
                      <Pressable
                      onPressIn={()=>buttonPressIn(returnToHomeBtnScale)}
                      onPressOut={()=>buttonPressOut(returnToHomeBtnScale)}
                      onPress={()=>{navigation.navigate("MoreGames")}}
                      >
                       <ImageBackground
                        source={buttons.yellowButton}
                        style={{width: 100, aspectRatio: 3, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{resizeMode: 'stretch'}}
                       >
                        <WordleText>Return Home</WordleText>
                        </ImageBackground> 
                      </Pressable>
    
                    </Animated.View>
                    <Animated.View style={{transform: [{scale: replayMatchBtnScale}]}}>
                      <Pressable
                      onPressIn={()=>buttonPressIn(replayMatchBtnScale)}
                      onPressOut={()=>buttonPressOut(replayMatchBtnScale)}
                      onPress={()=>{navigation.replace("WicWacWoeMatch", {type: route.params.type})   
                      }}
                      >
                       <ImageBackground
                        source={buttons.blueButton}
                        style={{width: 100, aspectRatio: 3, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{resizeMode: 'stretch'}}
                       >
                        <WordleText>Play Again</WordleText>
                        </ImageBackground> 
                      </Pressable>
                    </Animated.View>
                  </View>
            </View>
              </ImageBackground>
            </View>
        </Modal>

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


export default App;