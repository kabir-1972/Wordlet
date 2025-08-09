import React, {useRef, useState, useEffect} from 'react';
import { View, ImageBackground, Pressable, Image, Animated, Modal, LayoutChangeEvent, Dimensions, StyleProp, ImageSourcePropType, TextStyle} from 'react-native';
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
import { DailyRewards, HomeScreenRewards } from './Rewards';
import LottieView from 'lottie-react-native';
import { getTheCurrentDate, getTheDailyRewardData, setMarkedToZeroAfterSlideIn, updateTheRewardData } from './HomeScreen-Data-Files';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const bucketIconScale = new Animated.Value(1);
        const diceIconScale = new Animated.Value(1);
        const chestIconScale = new Animated.Value(1);

        
        const enhanceVocabBtn= new Animated.Value(1);
        const wordOfTheDayBtn= new Animated.Value(1);
        const noButtonInSkipModal = new Animated.Value(1);
        const yesButtonInSkipModal =new Animated.Value(1);


        const [wotdModalVisibility, setWotdModalVisibility]=useState(false);
        const [messageModalVisibilty, setMessageModalVisibilty]=useState(false);
        const [dailyRewardsModalVisibilty, setDailyRewardsModalVisibilty]=useState(false);


        const [wordOfTheDay, setWordOfTheDay]=useState<{index: number, word: string, partsOfSpeech: string, meaning: string}>();
        const [wordAddedToBucket, setWordAddedToBucket]=useState("");

        const bottomButtonsAnimatedValues=useRef(
            Array.from({length: 5}, ()=>new Animated.Value(1))).current;


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
                index: currentIndexNumber,
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
        //console.log(width);
    };

  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now:Date = new Date();
      const tomorrow:Date = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = [
        hours.toString(),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ];

      const _formatted=`${formatted[0]}h ${formatted[1]}m ${formatted[2]}s`;

      setRemainingTime(_formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const [rewardsSectionShown, setRewardsSectionShown]=useState(true);
  const [tasksSectionShown, setTasksSectionShown]=useState(false);

  const rewardsBtnScale=useRef(new Animated.Value(1));
  const tasksBtnScale=useRef(new Animated.Value(1));
  const closeTheDailyRewardsBtnScale=useRef(new Animated.Value(1));

  const rewardArray = Object.entries(HomeScreenRewards);
  const [theRewardData, setTheRewardData]=useState<any>(null);
  const [unnoticedRewardData, setUnnoticedRewardData]=useState(false);
  const [completedTasks, setCompletedTasks]=useState(0);
  const [completedTaskIndex, setCompletedTaskIndex]=useState<number|undefined>(1);

  const leftPositionOfRewardedData=useSharedValue(-200);
  const slideInRewardedDataStyle=useAnimatedStyle(()=>{
    return {left: withTiming(leftPositionOfRewardedData.value, {duration: 100})};
  })


  useEffect(()=>{
    const retrieveDailyRewardData=async()=>{
        const theDailyRewardData=await getTheDailyRewardData();
        let _completedTasks=0;
        for(let i=1; i<=25; i++){
            if(theDailyRewardData[`task${i}`].marked==1){
                setCompletedTaskIndex(i);
                setTimeout(()=>leftPositionOfRewardedData.value=0, 500);
                setTimeout(()=>leftPositionOfRewardedData.value=-200, 1500);
                break;
            }
        }
        
        for(let i=1; i<=25; i++){
            if(theDailyRewardData[`task${i}`].toBeShown==1)
                _completedTasks++;
        }
        
        setTheRewardData(theDailyRewardData);
        setCompletedTasks(_completedTasks);
    }

    retrieveDailyRewardData();
  }, []);

useEffect(()=>{
    if(!theRewardData) return;
        const theDailyRewardData = theRewardData;
        console.log(theDailyRewardData);

        let _completedTasks=0;
        for(let i=1; i<=25; i++){
            if(theDailyRewardData[`task${i}`].marked==1){
                setCompletedTaskIndex(i);
                setTimeout(()=>leftPositionOfRewardedData.value=0, 500);
                setTimeout(()=>leftPositionOfRewardedData.value=-200, 2000);
                setMarkedToZeroAfterSlideIn(i);
                break;
            }
        }
        
        for(let i=1; i<=25; i++){
            if(theDailyRewardData[`task${i}`].done==1)
                _completedTasks++;
        }
        setCompletedTasks(_completedTasks);
        
},[theRewardData])


const getTheRewardBarWidth=(points: any)=>{
    return parseFloat((points/1000).toFixed(2))*1150;
}

useEffect(()=>{
    const workWithTheLoginInfo=async()=>{
        const lastLoginDate=await AsyncStorage.getItem('loginDate');
        if(lastLoginDate==null) {
            await AsyncStorage.setItem('loginDate', getTheCurrentDate());
        }
    }

    workWithTheLoginInfo();
}, [])


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
            onPressIn={()=>buttonPressIn(bucketIconScale)}
            onPressOut={()=>buttonPressOut(bucketIconScale)}
            onPress={()=>{}}
            >
                <Animated.View style={{transform: [{scale: bucketIconScale}]}}>
                <ImageBackground
                source={buttons.violetButton}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
                >
                    <Image source={icons.bucketIcon} style={{width: 23, height: 23}}></Image>
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
                    <Image source={icons.chest} style={{width: 27, height: 27}}/>
                    {unnoticedRewardData&&<ExclamationMark/>}
                </ImageBackground>
                </Animated.View>
            </Pressable>
    </View>
    {wordOfTheDay?.word.length!=0&&<View style={{alignSelf: 'center'}}>
            <Pressable
            onPressIn={()=>buttonPressIn(wordOfTheDayBtn)}
            onPressOut={()=>buttonPressOut(wordOfTheDayBtn)}
            onPress={()=>{
                const wordOfTheDayRead=async ()=>{
                    setWotdModalVisibility(true);
                    const theDailyRewardData=await updateTheRewardData(25, 1);
                    setTheRewardData(theDailyRewardData);
                }

                wordOfTheDayRead();
            }}
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
                        <WordleText style={{fontSize: 15, color:'#444444', marginHorizontal: 25, textAlign: 'center'}}>{'word#'+wordOfTheDay?.index}</WordleText>
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
                                    //console.log(wordOfTheDay?.word);
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
                                style={styles.modalCloseBtn}
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
                    style={[styles.backgroundImage, {paddingTop: 40, paddingBottom: 0}]}
                    imageStyle={{resizeMode: 'stretch'}}
                    >  
                    <View style={[styles.modalBackground, {maxHeight: 400}]}>
                        <View style={{flexDirection: 'row', marginBottom: 8, marginHorizontal: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 4, flex: 1}}>
                            <Animated.View style={{transform: [{scale: rewardsBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(rewardsBtnScale.current)}
                            onPressOut={()=>buttonPressOut(rewardsBtnScale.current)}
                            onPress={()=>{setRewardsSectionShown(true); setTasksSectionShown(false)}}
                            >
                                <ImageBackground
                                source={buttons.goldenButton}
                                imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                    <WordleText style={{paddingHorizontal: 6, paddingVertical: 8}}>Rewards</WordleText>
                                </ImageBackground>
                            </Pressable>    
                            </Animated.View>

                            <Animated.View style={{transform: [{scale: tasksBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(tasksBtnScale.current)}
                            onPressOut={()=>buttonPressOut(tasksBtnScale.current)}
                            onPress={()=>{setTasksSectionShown(true); setRewardsSectionShown(false);}}
                            >
                                <ImageBackground
                                source={buttons.pinkButton}
                                imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                    <WordleText style={{paddingHorizontal: 12, paddingVertical: 8}}>Tasks</WordleText>
                                </ImageBackground>
                            </Pressable>    
                            </Animated.View>     
                        </View>
                                <Animated.View style={{transform: [{scale: closeTheDailyRewardsBtnScale.current}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(closeTheDailyRewardsBtnScale.current)}
                            onPressOut={()=>buttonPressOut(closeTheDailyRewardsBtnScale.current)}
                            onPress={()=>setDailyRewardsModalVisibilty(false)}
                            >
                                <Image
                                source={buttons.closeModalButton}
                                style={styles.modalCloseBtn}
                                />
                            </Pressable>    
                            </Animated.View>
                        </View>
                        {rewardsSectionShown&&<View>
                            <View style={{flexDirection: 'row', marginHorizontal: 20, alignItems:'center'}}>
                                <LottieView 
                                source={require('../assets/animations/happy-gift.json')}
                                style={{width: 80, marginLeft: 5, height: 80, transform: [{scale: 1.3}]}} autoPlay={true} loop/>
                                <View style={{flex: 1}}>
                                <WordleText style={{fontSize: 22, textAlign: 'center'}}>Daily Rewards</WordleText>
                                <WordleText style={{fontSize: 15, backgroundColor: '#fac19d', lineHeight: 18, padding: 5, borderRadius: 4, borderWidth: 1, borderColor: '#444444', marginVertical: 5}}>Complete Tasks and Earn Tokens</WordleText>
                                <WordleText style={{fontSize: 18, textAlign: 'center', color: '#444444'}}>Resets in</WordleText>
                                <View style={{width: '90%', height: 2, alignSelf: 'center', backgroundColor: '#555555', marginBottom: 3, marginTop: 1}}/>
                                <WordleText style={{fontSize: 15, textAlign:'center', lineHeight: 18, color: '#32024f'}}>{remainingTime}</WordleText>
                                </View>    
                            </View>
                            <ScrollView horizontal style={{marginHorizontal: 20}}>
                         <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                <View style={{marginLeft: 8, flexDirection: 'row', backgroundColor: '#444444', alignItems: 'center', borderRadius: 4, paddingHorizontal: 4}}>
                                    <WordleText style={styles.dailyRewardPointText}>{theRewardData?theRewardData.points:-1}</WordleText>
                                    <Image source={icons.dailyTaskToken} style={{width: 15, height: 15, marginTop: -3}}/>
                                </View>
                                <View style={styles.rewardBarCover}>
                                    <View style={styles.rewardBarHighlight}/>
                                    <View style={[styles.rewardBar, {width: getTheRewardBarWidth(theRewardData?theRewardData.points:1)}]}/>
                                </View>

                            </View>
                        <View style={{flexDirection: 'row', marginHorizontal: 5, marginBottom: 5}}>
                            <View style={{gap: 4, alignItems: 'center', padding: 4}}>
                                
                                <View style={{flexDirection: 'row'}}>
                                    <Image source={icons.colorfulStarIcon}
                                    style={{width: 40, height: 49}}
                                    />
                                </View>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <ImageBackground
                                    source={modalBackgrounds.blueModalBackgroundImg}
                                    style={{width: 80, height: 55, alignItems: 'center', justifyContent: 'center'}}
                                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1, borderColor: '#444444'}}
                                    >
                                    <WordleText style={{fontSize: 16, textAlign: 'center'}}>{"Free\nRewards"}</WordleText>
                                    </ImageBackground>
                                </View>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <ImageBackground
                                    source={modalBackgrounds.orangeModalBackgroundImg}
                                    style={{width: 80, height: 55, alignItems: 'center', justifyContent: 'center'}}
                                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1, borderColor: '#444444'}}
                                    >
                                    <WordleText style={{fontSize: 16, textAlign: 'center', lineHeight: 20}}>{"Golden Pass\nRewards"}</WordleText>
                                    </ImageBackground>
                                </View>
                            </View>
                            
                            {Array.from({length: 20}).map((_, index)=>
                                <View style={styles.dailyRewardPointContainer} key={index}>
                                    <View style={{height: 10, width: 2, backgroundColor: '#222222', marginTop: -5}}/>
                                    <View style={styles.pointTag}>
                                        <WordleText style={{fontSize: 15}}>{DailyRewards.points[index]}</WordleText>
                                        <Image source={icons.dailyTaskToken} style={{width: 15, height: 15, marginTop: -3}}/>
                                    </View>
                                    <Image source={icons.closedChest} style={{width: 25, height: 21.5}}/>
                                <View style={styles.normalRewardContainer}>
                                    <Image source={icons.coin} style={{width: 22, height: 22, resizeMode: 'stretch'}}/>
                                    <WordleText style={{fontSize: 15, textAlign: 'center'}}>{DailyRewards.free[index]}</WordleText>
                                </View>
                                <View style={styles.premiumRewardContainer}>
                                    <Image source={icons.coin} style={{width: 22, height: 22, resizeMode: 'stretch'}}/>
                                    <WordleText style={{fontSize: 15, textAlign: 'center'}}>{DailyRewards.golden[index]}</WordleText>
                                </View>
                            </View>)
                            }
                        </View>
                        </View>
                            </ScrollView>
                        </View>}

                        {tasksSectionShown&&<View>
                            <WordleText style={{textAlign: 'center', marginHorizontal: 10, fontSize: 18, color: '#444444'}}>Task Completed</WordleText>
                            <WordleText style={{textAlign: 'center', fontSize: 15, color: '#676767'}}>{completedTasks}/25</WordleText>
                            <View style={{height: 2, width: '80%', alignSelf: 'center', backgroundColor: '#660419', marginVertical: 3}}/>
                            <ScrollView style={{marginHorizontal: 10, marginBottom: 90}}>
                        { 
                            rewardArray.map(([id, task])=>
                            <View key={id}>
                                <ImageBackground 
                                source={buttons.wideWhiteButton}
                                style={{marginVertical: 1, flexDirection: 'row', paddingHorizontal: 4, alignItems: 'center'}}
                                imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                >
                                    <View>
                                        <WordleText style={{fontSize: 14, color: '#454545', textAlign: 'center'}}>{theRewardData[`task${id}`].activity}/{task.fill}</WordleText>
                                        <View style={styles.taskRewardBarCover}>
                                            <View style={styles.taskRewardBarHighlight}/>
                                            <View style={[styles.taskRewardBar, {width: parseFloat((theRewardData[`task${id}`].activity/task.fill).toFixed(2))*50}]}/>
                                        </View>
                                    </View>
                                    <WordleText style={{paddingVertical: 10, paddingHorizontal: 6, flex: 1, lineHeight: 22}}>{task.taskString}</WordleText>
                                    <View style={{flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 4, width: 60}}>
                                        <View style={{width: 1, backgroundColor: '#232323', height: 30, marginRight: 5}}/>
                                        <WordleText style={{fontSize: 15, color: '#444444'}}>{task.reward}</WordleText>
                                        <Image source={icons.dailyTaskToken} style={{width: 15, height: 15, marginTop: -4}}/>
                                    </View>
                                </ImageBackground>
                            </View>)
                        }    

                        </ScrollView>
                        </View>}
                        
                    </View>
                   </ImageBackground>
        </View>                
    </Modal>

{rewardArray&&completedTaskIndex&&<Reanimated.View style={[{position: 'absolute', width:200, top: 0.7*Dimensions.get('window').height, left: -200}, slideInRewardedDataStyle]}>
    <View
    style={{backgroundColor:'#e6e6e6', width: 200, borderRadius: 4, borderWidth: 1}}
    >
        <View style={{ padding: 5, flexDirection: 'row'}}>
        <View>
        <WordleText style={{textAlign: 'center', color: '#666666', fontSize: 15}}>Task Completed</WordleText>
        <WordleText style={{fontSize: 16, textAlign: 'center'}}>{rewardArray[completedTaskIndex-1][1].taskString}</WordleText>
        </View>
        <LottieView source={require("../assets/animations/task-complete-tick-mark.json")}
        style={{width: 30, height: 30, transform: [{scale: 1.33}]}} autoPlay loop/>
        </View>
    </View>
</Reanimated.View>}

 <View style={{flex: 1}}/>
    <View style={{flexDirection: 'row'}}>
<BottomButtons imageIcon={icons.searchIcon} buttonImage={buttons.yellowButton} onPress={()=>{}} text={"Search"} animatedScaleValue={bottomButtonsAnimatedValues[0]}/> 
<BottomButtons imageIcon={icons.globalChatIcon} buttonImage={buttons.redButton} onPress={()=>{}} text={"Global"} animatedScaleValue={bottomButtonsAnimatedValues[1]}/> 
<BottomButtons imageIcon={icons.gameIcon} buttonImage={buttons.blueButton} onPress={()=>{}} text={"Game"} animatedScaleValue={bottomButtonsAnimatedValues[2]}/> 
<BottomButtons imageIcon={icons.storeIcon} buttonImage={buttons.tealButton} onPress={()=>{}} text={"Store"} animatedScaleValue={bottomButtonsAnimatedValues[3]}/> 
<BottomButtons imageIcon={icons.leaderBoardIcon} buttonImage={buttons.pinkButton} onPress={()=>{}} text={"Rank"} animatedScaleValue={bottomButtonsAnimatedValues[4]}/> 
    </View>
    </ImageBackground> 
)};

type BottomButtonsProps={
    imageIcon: ImageSourcePropType;
    buttonImage: ImageSourcePropType;
    onPress: ()=>void;
    text: string;
    textStyle?: StyleProp<TextStyle>;
    animatedScaleValue: Animated.Value
}

export const BottomButtons=(props: BottomButtonsProps)=>{
    return(
    <View style={{ 
    width: props.text.toLowerCase()=="game"?0.25*Dimensions.get('window').width:0.188*Dimensions.get('window').width,
    marginTop: props.text.toLowerCase()=="global"||props.text.toLowerCase()=="store"?-6: props.text.toLowerCase()=="game"?-10: 0
    }}>
        <Pressable
        onPressIn={()=>buttonPressIn(props.animatedScaleValue)}
        onPressOut={()=>buttonPressOut(props.animatedScaleValue)}
        onPress={()=>props.onPress}
>
    <ImageBackground
        source={props.buttonImage}
        imageStyle={{resizeMode: 'stretch', borderWidth: 1, borderRadius: 4}}
        style={{}}
    >
        <Animated.View style={{transform: [{scale: props.animatedScaleValue}], paddingVertical: props.text.toLowerCase()=="global"||props.text.toLowerCase()=="store"?13: props.text.toLowerCase()=="game"? 15: 10}}>
            <Image source={props.imageIcon} style={{width: 30, height: 30, alignSelf: 'center'}}/>
            <WordleText style={[styles.bottomButtonsText, props.textStyle]}>{props.text}</WordleText>
        </Animated.View>
    </ImageBackground>
        </Pressable>
    </View>
    )
}



const TheThreeButtons = () => {
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

type ExclamationMarkProps={
    bottom?: number,
    right?: number
}


const ExclamationMark=({bottom = -5, right = -5}: ExclamationMarkProps)=>{
    return (
    <View style={{position: 'absolute', bottom: bottom, right: right, backgroundColor: '#222222c0', borderRadius: 3}}>
        <LottieView source={require("../assets/animations/dancing-exclamation-mark.json")}
        style={{width: 20, height: 20, transform: [{scaleX: 3}, {scaleY: 3}]}} autoPlay={true} loop={true}/>
    </View>
    )
}
