import React, {useRef, useState, useEffect} from 'react';
import { View, Text, ImageBackground, Pressable, Image, Animated, Modal, LayoutChangeEvent} from 'react-native';
import { MainGameButton } from '../source/styles/home-page-styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { styles } from '../source/styles/home-page-styles';
import { ProfileData } from './AccessProfileData';

import { readProfileDataFile,saveProfileDataToFile, getTheMaxXpForNextLevel } from './AccessProfileData';
import { HeaderForMatchEnd } from './Components-For-End-Match';
import { WordleText } from './Skip-Game-Modal';

import { buttons, icons, modalBackgrounds, miscellaneous} from '../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations';
import RNFS from 'react-native-fs';
import { addWordQuicker } from './Wordlet-Bucket';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';


export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const App = () => {
    const [profileData, setProfileData]=useState<ProfileData>({
        profileName: "Wordleteer",
        playerXP: 1,
        playerCoins: 500,
        playerLevel: 1,
        lastMatch: "",
    });

    const [maxXp, setMaxXp]=useState(60);
    const [xpPercent, setXpPercent]=useState("0%");
    const experiencePointsBarRef=useRef<View>(null);
    const coinsBarRef=useRef<View>(null);
    const [xps, setXps]=useState(0);

    useEffect(()=>{
          async function loadProfileData() {
          const savedData = await readProfileDataFile();
          if(savedData){
    
            const _profileData={
                profileName: savedData.profileName,
                playerXP: savedData.playerXP,
                playerCoins: savedData.playerCoins,
                playerLevel: savedData.playerLevel,
                lastMatch: savedData.lastMatch,
            }
            setProfileData(_profileData);
            let _maxXp=getTheMaxXpForNextLevel(_profileData.playerLevel);
            setMaxXp(_maxXp);
        }
        else{
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
        },[])

        const messageIconScale= new Animated.Value(1);
        const achievementIconScale = new Animated.Value(1);
        const diceIconScale = new Animated.Value(1);
        const chestIconScale = new Animated.Value(1);

        
        const enhanceVocabBtn= new Animated.Value(1);
        const wordOfTheDayBtn= new Animated.Value(1);
        const noButtonInSkipModal = new Animated.Value(1);
        const yesButtonInSkipModal =new Animated.Value(1);


        const [wotdModalVisibility, setWotdModalVisibility]=useState(false);
        const [messageModalVisibilty, setMessageModalVisibilty]=useState(false);
        const [dailyRewardsModalVisibilty, setDailyRewardsModalVisibilty]=useState(false);


        const [wordOfTheDay, setWordOfTheDay]=useState<{word: string, partsOfSpeech: string, meaning: string}>();
        const [wordAddedToBucket, setWordAddedToBucket]=useState("");



useEffect(()=>{
    async function getTheWordOfTheDay(){
        try{
            const content = await RNFS.readFileAssets("wordOfTheDay.json");
            const words=JSON.parse(content);
            let currentIndexNumber=1;
            const statusPath=RNFS.DocumentDirectoryPath+"wotd-state.json";
            const fileExists= await RNFS.exists(statusPath);

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = (`0${date.getMonth() + 1}`).slice(-2);
                const day = (`0${date.getDate()}`).slice(-2);
                return `${year}-${month}-${day}`;
            };

            if(fileExists){
                const statusContent=await RNFS.readFile(statusPath);
                const status=JSON.parse(statusContent);
                const todayDate=formatDate(new Date());

                if(todayDate==status.date)
                    currentIndexNumber=status.index;
                else{
                    const newStatus={
                        index: (status.index)%550+1,
                        date: todayDate
                    }
                    await RNFS.writeFile(statusPath, JSON.stringify(newStatus), 'utf8');
                }
            }
            else{
                const todayDate=formatDate(new Date());
                const newStatus={
                        index: 1,
                        date: todayDate
                    }
                    await RNFS.writeFile(statusPath, JSON.stringify(newStatus), 'utf8');
            }
            const wordData=words[currentIndexNumber];
            const wordDataObject={
                word: wordData.word,
                partsOfSpeech: wordData.partsOfSpeech,
                meaning: wordData.meaning
            }
            setWordOfTheDay(wordDataObject);
        }
        catch (e){
            console.log("Error " + e);
        }
    }
    getTheWordOfTheDay();
},[])
    const navigation = useNavigation<NavigationProp>();

  const moveX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: moveX.value }],
    };
  });

    const [currentTabForMessages, setCurrentTabForMessages]=useState(0);
    const markAllReadBtnScale=useRef(new Animated.Value(1));

    const [widthOfTheMessageTab, setWidthOfTheMessageTab] = useState(0);
    
    const handleLayoutForTabsInMessages = (event:LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
        setWidthOfTheMessageTab(width);
        console.log(width);
    };

    return(
    <ImageBackground
      source={require('../source/images/background.png')}
      style={styles.background}
      resizeMode="stretch"
    > 
    <View style={styles.container}>
    
    <HeaderForMatchEnd
            profileData={profileData}
            setXpPercent={setXpPercent}
            xpPercent={xpPercent}
            maxXp={maxXp}
            experiencePointsBarRef={experiencePointsBarRef}
            coinsBarRef={coinsBarRef}
            _xps={xps}
    />

    <View style={styles.messageAndTrophyContainer}>
        <View style={styles.message}>
            <Pressable
            onPressIn={()=>buttonPressIn(messageIconScale)}
            onPressOut={()=>buttonPressOut(messageIconScale)}
            onPress={()=>{setMessageModalVisibilty(true)}}
            >
                <Animated.Image
                source={icons.message}
                style={{width: 35, height: 35, transform: [{scale: messageIconScale}]}}

                ></Animated.Image>

            </Pressable>
        </View>
        <View>
            <View style={styles.trophy}>
            <WordleText style={{color: '#dddddd', fontSize: 16, textAlign: 'right', marginRight: 7}}>100</WordleText>
            </View>
        </View>
    </View>

<View style={styles.messageAndTrophyContainer}>
            <Pressable
            onPressIn={()=>buttonPressIn(diceIconScale)}
            onPressOut={()=>buttonPressOut(diceIconScale)}
            onPress={()=>{}}
            >
                <Animated.View style={{transform: [{scale: diceIconScale}]}}>
                <ImageBackground
                source={buttons.pinkButton}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <Image source={icons.dice} style={{width: 25, height: 25}}></Image>
                </ImageBackground>
                </Animated.View>

            </Pressable>
            <Pressable
            onPressIn={()=>buttonPressIn(achievementIconScale)}
            onPressOut={()=>buttonPressOut(achievementIconScale)}
            onPress={()=>{}}
            >
                <Animated.View style={{transform: [{scale: achievementIconScale}]}}>
                <ImageBackground
                source={buttons.goldenButton}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <Image source={icons.achive} style={{width: 27, height: 27}}></Image>
                </ImageBackground>
                </Animated.View>

            </Pressable>
    </View>

    <View style={styles.messageAndTrophyContainer}>
            <Pressable
            onPressIn={()=>buttonPressIn(chestIconScale)}
            onPressOut={()=>buttonPressOut(chestIconScale)}
            onPress={()=>{setDailyRewardsModalVisibilty(true)}}
            >
                <Animated.View style={{transform: [{scale: chestIconScale}]}}>
                <ImageBackground
                source={buttons.tealButton}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <Image source={icons.chest} style={{width: 27, height: 27}}></Image>
                </ImageBackground>
                </Animated.View>
            </Pressable>
    </View>
    {wordOfTheDay?.word.length!=0&&<View style={{alignSelf: 'center'}}>
            <Pressable
            onPressIn={()=>buttonPressIn(wordOfTheDayBtn)}
            onPressOut={()=>buttonPressOut(wordOfTheDayBtn)}
            onPress={()=>{setWotdModalVisibility(true)}}
            >
                <Animated.View style={{transform: [{scale: wordOfTheDayBtn}]}}>
                <ImageBackground
                source={buttons.blueButton}
                style={{width: 120, height: 40, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <WordleText>{wordOfTheDay?.word}</WordleText>
                    <WordleText style={{color: '#ffffff', fontSize: 14}}>Word of The Day</WordleText>
                </ImageBackground>
                </Animated.View>
            </Pressable>     
    </View>
    }
    
    <View style={{alignSelf: 'center', marginTop: 5}}>
            <Pressable
            onPressIn={()=>buttonPressIn(enhanceVocabBtn)}
            onPressOut={()=>buttonPressOut(enhanceVocabBtn)}
            onPress={()=>navigation.navigate("VocabularyGames")}
            >
                <Animated.View style={{transform: [{scale: enhanceVocabBtn}]}}>
                <ImageBackground
                source={buttons.pinkButton}
                style={{width: 130, height: 30, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <WordleText style={{color: '#111111', fontSize: 15}}>Enhance Vocabulary</WordleText>
                </ImageBackground>
                </Animated.View>
            </Pressable>     
    </View>

    <TheThreeButtons/>
    </View>
    <Modal
                    visible={wotdModalVisibility}
                    onRequestClose={()=>setWotdModalVisibility(false)}
                    transparent={true}
                    >
                <View style={styles.modalContainer}>
                    <ImageBackground 
                    source={modalBackgrounds.whiteModalBackgroundImg}
                    style={styles.backgroundImage}
                    imageStyle={{resizeMode: 'stretch',}}
                    >  
                    <View style={styles.modalBackground}>
                      <View style={styles.modalContent}>
                        <WordleText style={{fontSize: 20, marginHorizontal: 25, lineHeight: 25, textAlign: 'center'}}>{wordOfTheDay?.word.toUpperCase()}</WordleText>
                        <View style={{width: '85%', height: 2, backgroundColor: '#444444', alignSelf: 'center', marginVertical: 3}}></View>
                        <View style={[styles.wotdContainer, {backgroundColor: '#ccffda'}]}>
                        <WordleText style={{fontSize: 18, marginHorizontal: 10, lineHeight: 25, textAlign: 'center'}}>{wordOfTheDay?.partsOfSpeech}</WordleText>
                        </View>
                        <View style={styles.warningTextContainer}>
                        <WordleText style={styles.warningText}>
                            {wordOfTheDay?.meaning}</WordleText>
                        </View>
                        {wordAddedToBucket.length>0&&<View style={[styles.wotdContainer, {backgroundColor: '#fccfe1', borderColor: '#821541'}]}>
                            <WordleText style={{fontSize: 16, marginHorizontal: 10, lineHeight: 20, textAlign: 'center', color: '#821541'}}>{wordAddedToBucket}</WordleText>
                        </View>}

                        <View style={styles.btnRow}>
                            <Animated.View style={{transform: [{ scale:noButtonInSkipModal }], flex: 1 }}
                            >
                                <Pressable
                                onPressIn={()=>buttonPressIn(noButtonInSkipModal)}
                                onPressOut={()=>buttonPressOut(noButtonInSkipModal)}
                                onPress={()=>{
                                    const addTheWordToBucket= async()=>{
                                    console.log(wordOfTheDay?.word);
                                        if(wordOfTheDay?.word) {
                                        const status= await addWordQuicker(wordOfTheDay.word);
                                        if(status==1)
                                            setWordAddedToBucket("Word has been added\nto Wordlet Bucket");
                                        else setWordAddedToBucket("Word is already\nin the Bucket");
                                        setTimeout(()=>setWordAddedToBucket(""), 1000);
                                    }   
                                    }
                                    addTheWordToBucket();
                                }}
                                >
                                    <ImageBackground
                                    source={buttons.tealButton}
                                    style={styles.button}
                                    imageStyle={styles.bgImage}
                                    >
                                    <WordleText style={{color: '#2e2e2e', fontSize: 16, textAlign: 'center', lineHeight: 18}}>{"Add to\nWordlet Bucket"}</WordleText>
                                    </ImageBackground>
                                </Pressable>
                            </Animated.View>
    
                            <Animated.View style={{transform: [{ scale:yesButtonInSkipModal }], flex: 1 }} >
                                <Pressable
                                onPressIn={()=>buttonPressIn(yesButtonInSkipModal)}
                                onPressOut={()=>buttonPressOut(yesButtonInSkipModal)}
                                onPress={()=>setWotdModalVisibility(false)}
                                >
                                    <ImageBackground
                                    source={buttons.redButton}
                                    style={styles.button}
                                    imageStyle={styles.bgImage}
                                    >
                                    <WordleText style={{color: '#ffffff', marginBottom: 5, fontSize: 20}}>Close</WordleText>
                                    </ImageBackground>
                                </Pressable>
                            </Animated.View>
    
                        </View>
    
                      </View>
                    </View>
                    </ImageBackground>
                </View>
    </Modal>

    <Modal
    visible={messageModalVisibilty}
    transparent={true}
    onRequestClose={()=>setMessageModalVisibilty(false)}                            
    >
        <View style={[styles.modalContainer]}>
                    <ImageBackground 
                    source={modalBackgrounds.whiteModalBackgroundImg}
                    style={[styles.backgroundImage, {paddingBottom: 0}]}
                    imageStyle={{resizeMode: 'stretch'}}
                    >  
                    <View style={styles.modalBackground}>
                        <View style={{height: 22, width: '100%'}}/>
                        <View style={{flexDirection: 'row', marginTop: -8, justifyContent: 'space-between', alignItems: 'center'}}>
                            <WordleText style={{textAlign: 'center', flex: 1, fontSize: 20, marginLeft: 30, marginTop: 5}}>Messages</WordleText>
                            <Pressable style={{ marginRight: 8}} onPress={()=>setMessageModalVisibilty(false)}>
                                <Image source={buttons.closeModalButton}
                                style={{width: 25, height: 25, transform: [{scaleY: 0.95}]}}
                                />
                            </Pressable>
                        </View>
                      <View style={{width: '90%', height: 1, backgroundColor: '#444444', alignSelf: 'center', marginTop: 5}}/>  

                      <View style={[styles.modalContent, {marginHorizontal: 20}]}>
                        <View style={{flexDirection: 'row', gap: 2}}>
                             <Pressable style={styles.messageModalTabs} onPress={()=>{moveX.value = withTiming(widthOfTheMessageTab*0, { duration: 300 }); setCurrentTabForMessages(0)}}><WordleText style={styles.messageModalTabsText}>System</WordleText></Pressable>
                             <Pressable style={styles.messageModalTabs} onPress={()=>{moveX.value = withTiming(widthOfTheMessageTab*1+12, { duration: 300 }); setCurrentTabForMessages(1)}}><WordleText style={styles.messageModalTabsText}>Private</WordleText></Pressable>
                             <Pressable style={styles.messageModalTabs} onPress={()=>{moveX.value = withTiming(widthOfTheMessageTab*2+20, { duration: 300 }); setCurrentTabForMessages(2)}}><WordleText style={styles.messageModalTabsText}>Events</WordleText></Pressable>
                        </View>
                        
                        <View style={{flexDirection: 'row', gap: 2, marginVertical: 2}}>
                             <Reanimated.View onLayout={handleLayoutForTabsInMessages} style={[styles.messageModalTabSelector, animatedStyle]}/>
                        </View>

                        <View style={styles.messages}>
                            <View style={styles.theMessage}>
                            <WordleText style={{marginLeft: 3}}>Welcome to The Game</WordleText>
                            <WordleText style={{fontSize: 16, color: '#777777', lineHeight: 20, marginLeft: 10}}>MRK Studio warmly welcomes you to our game.</WordleText>
                            <WordleText style={{fontSize: 14, color: '#888888', textAlign: 'right'}}>Aug 2, 2025 | 14: 09</WordleText>
                            </View>    
                        </View>

                        <Animated.View style={{alignSelf:'flex-end', marginTop: 3, marginRight: 10, transform: [{scale: markAllReadBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(markAllReadBtnScale.current)}
                            onPressOut={()=>buttonPressOut(markAllReadBtnScale.current)}
                            onPress={()=>{}}
                            >
                                <ImageBackground
                                source={buttons.blueButton}
                                style={{padding: 6}}
                                imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                  <WordleText>Mark all Read</WordleText>
                                </ImageBackground>
                            </Pressable>
                        </Animated.View>
                       </View>
                    </View>
                   </ImageBackground>
        </View>                
    </Modal>

    <Modal
    visible={dailyRewardsModalVisibilty}
    transparent={true}
    onRequestClose={()=>setDailyRewardsModalVisibilty(false)}                            
    >
        <View style={[styles.modalContainer]}>
                    <ImageBackground 
                    source={modalBackgrounds.whiteModalBackgroundImg}
                    style={[styles.backgroundImage, {paddingBottom: 0}]}
                    imageStyle={{resizeMode: 'stretch'}}
                    >  
                    <View style={styles.modalBackground}>
                        {/* <View style={{height: 22, width: '100%'}}/> */}
                            <Pressable style={{ flexDirection: 'row', marginTop: -8, alignSelf: 'flex-end', marginRight: 8}} onPress={()=>setMessageModalVisibilty(false)}>
                                <Image source={buttons.closeModalButton}
                                style={{width: 25, height: 25, transform: [{scaleY: 0.95}]}}
                                />
                            </Pressable>
                            <WordleText style={styles.dailyRewardPointText}>300/ 1000</WordleText>
                        <ScrollView horizontal style={{marginHorizontal: 20}}>
                         <View style={{flexDirection: 'column'}}>   
                        <View style={{width: 1000, height: 15, backgroundColor: '#ccc', borderRadius: 4}}>
                            <View style={[styles.rewardBar, {width: 300}]}/>
                        </View>

                        <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 5}}>
                            <View style={styles.dailyRewardPointContainer}>
                                <View style={styles.dayTag}>
                                <WordleText style={{transform: [{rotate: '-45deg'}], paddingHorizontal: 11, paddingVertical: 5, color: '#3d011c'}}>1</WordleText>
                                </View>
                                <View style={styles.normalRewardContainer}>
                                    <Image source={icons.coin} style={{width: 22, height: 22, resizeMode: 'stretch'}}/>
                                    <WordleText style={{fontSize: 15, textAlign: 'center'}}>60</WordleText>
                                </View>
                                <View style={styles.premiumRewardContainer}>
                                    <Image source={icons.coin} style={{width: 22, height: 22, resizeMode: 'stretch'}}/>
                                    <WordleText style={{fontSize: 15, textAlign: 'center'}}>120</WordleText>
                                </View>
                            </View>    
                        </View>
                        </View>
                        </ScrollView>    
                        
                    </View>
                   </ImageBackground>
        </View>                
    </Modal>

    </ImageBackground> 
)};



const TheThreeButtons = () => {
    
const wordleButton= require('../source/images/buttons/wordle-button.png');
const crosswordsButton= require('../source/images/buttons/crosswords-button.png');
const moreGamesButton= require('../source/images/buttons/more-games-button.png');

    const navigation = useNavigation<NavigationProp>();
    const showWorldeWindow = () => {
        navigation.navigate('Wordle');
    };

    const showCrosswordsWindow = () => {
        navigation.navigate('Crosswords');
    };

    const showMoreGamesWindow = () => {
        navigation.navigate('MoreGames');
    };

    return (
    <View>
    <View style={styles.twoButtons}>
        <MainGameButton name="Wordle" image={buttons.tealButton} onPress = {showWorldeWindow} buttonStyle={styles.button}/>
        <MainGameButton name="Crosswords" image={buttons.yellowButton} onPress = {showCrosswordsWindow} buttonStyle={styles.button}/>
    </View>
    <View  style={styles.oneButton}>
        <MainGameButton name="MoreGames" image={buttons.redButton} onPress = {showMoreGamesWindow} buttonStyle={styles.SingleButton}/>
    </View>
    </View>   
)
}
/**/
export default App;
