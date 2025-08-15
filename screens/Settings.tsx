import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, Button, Animated, ImageBackground, Dimensions, StyleSheet, ViewStyle, Linking, Pressable, Image, DimensionValue, ImageProps } from 'react-native';
import { styles } from '../source/styles/header-modal-styles';
import { buttons, modalBackgrounds, icons } from '../source/styles/assets';
import { WordleText } from './Skip-Game-Modal';
import DeviceInfo from 'react-native-device-info';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';

import {deleteAccount} from '../backend-functions';
import RNFS from 'react-native-fs';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView
} from 'react-native-gesture-handler';

import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**/
export const SLIDER_WIDTH = SCREEN_WIDTH * 0.5;
export const THUMB_SIZE = 22;
export const TRACK_HEIGHT=18;

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const StudioLinks={
  studioPage: '',
  ytPage: '',
  telegramPage: '',
  twitterPage: '',
  fbPage: ''
}

let settingsDataSavingTimeout:NodeJS.Timeout;

type SettingsModalProps={
    visible: boolean
    onclose: ()=> void;
}

const SettingsModal = (props: SettingsModalProps) => {
  const [modalVis, setModalVis] = useState(true);
  
  
  const sound = useSharedValue(1);
  const music = useSharedValue(1);
  const voice = useSharedValue(1);

  const checkAndClearSettingsUpdateTimeOut=()=>{

    if(settingsDataSavingTimeout) clearTimeout(settingsDataSavingTimeout);
    settingsDataSavingTimeout = setTimeout(()=>updateSettingsData(), 1000);
  }

  const onSoundChange = (value: number) => {sound.value=value; SettingsData.sound=Number.parseFloat(value.toFixed(2)); checkAndClearSettingsUpdateTimeOut();};
  const onMusicChange = (value: number) => {music.value=value; SettingsData.music=Number.parseFloat(value.toFixed(2)); checkAndClearSettingsUpdateTimeOut();};
  const onVoiceChange = (value: number) => {voice.value=value; SettingsData.voice=Number.parseFloat(value.toFixed(2)); checkAndClearSettingsUpdateTimeOut();};

  const [soundInfoVisible, setSoundInfoVisible]=useState(false);
  const [musicInfoVisible, setMusicInfoVisible]=useState(false);
  const [voiceInfoVisible, setVoiceInfoVisible]=useState(false);

  const [gameInfoModalVisible, setGameInfoModalVisible]=useState(false);

  const goToLink=(url: string| boolean)=>{
    if(typeof(url)=='boolean') return;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
         else console.log("Don't know how to open URI: " + url); 
      })
      .catch((err) => console.error('An error occurred', err));
  }

  const [selectedLanguage, setSelectedLanguage]=useState(1);
  const modalCloseButton=useRef(new Animated.Value(1)).current;
  const deleteAccButton=useRef(new Animated.Value(1)).current;

const updateLanguage=(option: number)=>{
  if(settingsDataSavingTimeout) clearTimeout(settingsDataSavingTimeout);

  if(option==selectedLanguage) return;
  
  if(option==2){
    SettingsData.dictionary='English (U.K.)';
    setSelectedLanguage(2);    
  }
  else{
    SettingsData.dictionary='English (U.S.)';
    setSelectedLanguage(1); 
  }
  settingsDataSavingTimeout=setTimeout(()=>updateSettingsData(), 1000);
}

const updateSettingsData = async()=>{
  console.log(SettingsData);
  const profileDataFileName = "settings-data.json";
  const path = `${RNFS.DocumentDirectoryPath}/${profileDataFileName}`;
  await RNFS.writeFile(path, JSON.stringify(SettingsData), 'utf8');
}

  const otherButtonsScale=Array.from({length: 6}).map(()=>
      useRef(new Animated.Value(1)).current
  )

  const descriptionText={
    music: "Includes sound created while showing level up animation, victory in multiplayer matches, league promotion and daily reward completion",
    sound: "Includes button clicks",
    voice: "Includes sound played during phonetic pronunciation"
  }

  const toggleGameInfoWithThisModal=(value: boolean| string)=>{
    if(typeof(value)=='string') return;
    setModalVis(!value);
    setTimeout(()=>setGameInfoModalVisible(value), 500);
  }

  const checkIfSettingsDataIsInitialized=()=>{
  if(SettingsData
    &&SettingsData.background
    &&SettingsData.dictionary!=""
    &&SettingsData.music
    &&SettingsData.sound
    &&SettingsData.voice
  )  
    return true;
  else return false;
 }

  const navigation=useNavigation<NavigationProp>();
  const isSettingsDataInitialized=checkIfSettingsDataIsInitialized();

  if(!isSettingsDataInitialized) return null;
   else return (
    props.visible&&<>
      <Modal
        visible={modalVis}
        onRequestClose={props.onclose}
        transparent={true}
      >
        <GestureHandlerRootView>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={modalBackgrounds.whiteModalBackgroundImg}
            style={styles.backgroundImage}
            imageStyle={{ resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
          >
            <View style={[styles.modalBackground, {aspectRatio: 0.9}]}>
              <View style={[styles.modalContent]}>
                <Animated.View style={{position: 'absolute', top: -25, right: 5, transform: [{scale: modalCloseButton}]}}>
                  <Pressable 
                  onPressIn={()=>buttonPressIn(modalCloseButton)}
                  onPressOut={()=>buttonPressOut(modalCloseButton)}
                  onPress={props.onclose}
                  >
                    <Image source={buttons.closeModalButton}
                    style={{width: 25, height: 25, transform: [{scaleY: 0.98}]}}
                    />
                  </Pressable>
                </Animated.View>
                <WordleText style={styles.settingsMenuTitle}>Game Settings</WordleText>
                <ScrollView>
                <SettingsHeader header='Audio and SFX' headerBgColor='#b0ebc4'/>
                <Sliders option='Sound' makeTheVariableChange={onSoundChange} initialValue={SettingsData.sound} trackColor='#b7a4db' progressColor='#896dbf' thumbColor='#584185' infoBtnFunction={setSoundInfoVisible} visiblityParameter={soundInfoVisible} descriptionText={descriptionText.sound} infoSectionWidth='50%'/>
                <Sliders option='Music' makeTheVariableChange={onMusicChange} initialValue={SettingsData.music} trackColor='#a4bcdb' progressColor='#6d9bbf' thumbColor='#416f85' infoBtnFunction={setMusicInfoVisible} visiblityParameter={musicInfoVisible} descriptionText={descriptionText.music} infoSectionWidth='80%'/>
                <Sliders option='Voice' makeTheVariableChange={onVoiceChange} initialValue={SettingsData.voice} trackColor='#dba4c6' progressColor='#bf6da2' thumbColor='#85416a' infoBtnFunction={setVoiceInfoVisible} visiblityParameter={voiceInfoVisible} descriptionText={descriptionText.voice} infoSectionWidth='60%'/>
                <SettingsHeader header='Account' headerBgColor='#ebb0c7'/>
                <WordleText style={styles.accountConnectPrompt}>Keep your profile linked with an account so that you can continue playing in other devices</WordleText>
                  <View style={{alignItems: 'center', gap: 4}}>
                    <Pressable>
                      <ImageBackground source={buttons.wideWhiteButton} imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}} style={{flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 5}}>
                        <Image source={icons.googleIcon} style={{width: 15, height: 15}}/>
                        <WordleText style={{paddingHorizontal: 8, paddingVertical: 6, fontSize: 17}}>Sign in with Google</WordleText>
                      </ImageBackground>
                    </Pressable>

                    <Pressable>
                      <ImageBackground source={buttons.wideWhiteButton} imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}} style={{flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 5}}>
                        <Image source={icons.facebookIcon} style={{width: 18, height: 18}}/>
                        <WordleText style={{paddingHorizontal: 8, paddingVertical: 6, fontSize: 17}}>Sign in with Facebook</WordleText>
                      </ImageBackground>
                    </Pressable>
                  </View>
                  <WordleText style={[styles.accountConnectPrompt, {backgroundColor: '#ffe7bd'}]}>You can only have one device per account. You can delete the account anytime you want.</WordleText>
                  <WordleText style={[styles.accountConnectPrompt, {backgroundColor: '#f2bfda'}]}>Deleting the account deletes every data from our database and cannot be restored.</WordleText>
                  <Animated.View style={{transform: [{scale: deleteAccButton }]}}>
                  <Pressable style={{alignSelf: 'center', marginBottom: 6}}
                  onPressIn={()=>buttonPressIn(deleteAccButton)}
                  onPressOut={()=>buttonPressOut(deleteAccButton)}
                  onPress={()=>{deleteAccount(); navigation.navigate("Home");}}
                  >
                      <ImageBackground source={buttons.wideWhiteButton} imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}} style={{paddingHorizontal: 5}}>
                        <WordleText style={{paddingHorizontal: 8, paddingVertical: 6, fontSize: 17}}>Delete Account</WordleText>
                      </ImageBackground>
                  </Pressable>
                  </Animated.View>
                  <SettingsHeader header='Notifications' headerBgColor='#ebbdff'/>
                    <View style={{marginHorizontal: 10, marginVertical: 5}}>
                      <Notifications notifyText="Inform me when I receive system messages" value={SettingsData.notifications[1]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when I receive messages from players" value={SettingsData.notifications[2]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when I receive friendly challenges" value={SettingsData.notifications[3]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when my bet is matched" value={SettingsData.notifications[4]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when any new tournament is available" value={SettingsData.notifications[5]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when my crosswords are attempted by others" value={SettingsData.notifications[6]} updateSettingsInFile={updateSettingsData}/>
                      <Notifications notifyText="Inform me when my flashcards are saved by others" value={SettingsData.notifications[7]} updateSettingsInFile={updateSettingsData}/>
                    </View>
                    <SettingsHeader header='Others' headerBgColor='#f79586'/>
                    <View style={{marginHorizontal: 15, backgroundColor: '#d9e0fc', paddingHorizontal: 10, paddingVertical: 5, marginBottom: 5}}>
                      <WordleText style={{marginVertical: 4}}>Dictionary Language</WordleText>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>  
                          <CheckerBoxes text='U.S. English' onClick={updateLanguage} selected={selectedLanguage==1} checker={1}/>
                          <CheckerBoxes text='U.K. English' onClick={updateLanguage} selected={selectedLanguage==2} checker={2}/>
                        </View>
                    </View>
                    <View style={styles.twoButtonsTogether}>
                        <OtherSectionsBtns text='About' onClick={toggleGameInfoWithThisModal} value={!gameInfoModalVisible} animatedValue={otherButtonsScale[0]}/>
                        <OtherSectionsBtns text='Terms' onClick={goToLink} value={"https://funwithpasswords.com/terms"} animatedValue={otherButtonsScale[1]}/>
                    </View>

                    <View style={styles.twoButtonsTogether}>
                        <OtherSectionsBtns text='Contact' onClick={goToLink} value={"https://funwithpasswords.com/contact"} animatedValue={otherButtonsScale[2]}/>
                        <OtherSectionsBtns text='Privacy Policy' onClick={goToLink} value={"https://funwithpasswords.com/privacy-policy"} animatedValue={otherButtonsScale[3]}/>
                    </View>
                </ScrollView>
              </View>
            </View>
            </ImageBackground>
        </View>
        </GestureHandlerRootView>
      </Modal>

      <Modal
        visible={gameInfoModalVisible}
        onRequestClose={()=> setGameInfoModalVisible(false)}
        transparent={true}
      >
       <View style={styles.modalContainer}>
          <ImageBackground
            source={modalBackgrounds.whiteModalBackgroundImg}
            style={styles.backgroundImage}
            imageStyle={{ resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
          >
            <View style={[styles.modalBackground, {aspectRatio: 0.9}]}>
              <View style={[styles.modalContent]}>
                <WordleText style={styles.aboutSectionTitle}>About</WordleText>
                <ScrollView>
                <SettingsHeader header={'Development'} headerBgColor='#b5ffea'/>
                <View style={{marginHorizontal: 10}}>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>The game was developed as my first project using React Native, within a span of three months from May to August, 2025 under the banner of Fiddler Studio.</WordleText>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>It is a completely indie project, under sole development by me.</WordleText>
                </View>
                <SettingsHeader header={'The Game'} headerBgColor='#b5b8ff'/>
                <View style={{marginHorizontal: 10}}>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>The Game is a word game, a set of puzzles, that can be completely played offline (excluding multiplayer features) that has over 1500 puzzles ready for you. Except the usual game modes, like Wordlet and Crosswords, I have my own special type, the WicWacWoe that surely deserves to occupy a firm place in the domain of puzzle games. Except for that, I have made and adopted thousands of other never-ending puzzles to make you addictive to the game.</WordleText>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>The Game can be a good source for vocabulary enrichment. Necessary flashcards and Wordlet Bucket with an attached online Dictionary is there to help you out.</WordleText>         
                </View>
                <SettingsHeader header={'The Assets'} headerBgColor='#b5b8ff'/>
                <View style={{marginHorizontal: 10}}>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>I have managed assets from different sources. The font has been inspired from that of Clash of Clans' Supercell Magic Font, developed using FontForge. Moreover, for the buttons, I was inspired from the same game too, though I edited most of the buttons by myself. Furthermore, the animations has been taken from Lottiefiles. Except one, rest of them are made by others.</WordleText>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>Some icons have been made using Leonardo AI. And few I have gathered from the net. Besides, the splash screen, the game icon and the studio logo are all my own efforts.</WordleText>
                </View>
                <SettingsHeader header={'Credits'} headerBgColor='#ffb5cc'/>
                <View style={{marginHorizontal: 10}}>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>It is not possible to acknowledge everyone who has actively or passively helped me develop the game. But after all, my heartfelt gratitude and wishes to all who has shared innovative arts on the internet and therefore, helping me pick some for this project.</WordleText>
                </View>

                <SettingsHeader header={'Conclusion'} headerBgColor='#ffd3b5'/>
                <View style={{marginHorizontal: 10}}>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>I do not like speaking too much about myself. However, here is a link that can help you reach me out.</WordleText>
                  <OtherSectionsBtns text='About the Developer' onClick={goToLink} value='https://funwithpasswords.com/about' animatedValue={otherButtonsScale[0]}/>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>Also, you might want to contribute for the game. Here is the source code:</WordleText>
                  <OtherSectionsBtns text='Github Repo' onClick={goToLink} value='https://github.com/kabir-1972/Wordlet' animatedValue={otherButtonsScale[0]}/>
                  <WordleText style={{fontSize: 17, lineHeight: 20}}>To know more about our studio</WordleText>
                  <OtherSectionsBtns text='Fiddler Studio' onClick={goToLink} value="" animatedValue={otherButtonsScale[1]}/>
                        
                  <View style={styles.twoButtonsTogether}>
                        <StudioMediaPageBtns icon={icons.youtubeIcon} onClick={goToLink} value={StudioLinks.ytPage} animatedValue={otherButtonsScale[2]}/>
                        <StudioMediaPageBtns icon={icons.facebookIcon} onClick={goToLink} value={StudioLinks.fbPage} animatedValue={otherButtonsScale[3]}/>                    
                        <StudioMediaPageBtns icon={icons.telegramIcon} onClick={goToLink} value={StudioLinks.telegramPage} animatedValue={otherButtonsScale[4]}/>
                        <StudioMediaPageBtns icon={icons.xIcon} onClick={goToLink} value={StudioLinks.twitterPage} animatedValue={otherButtonsScale[5]}/>                    
                  </View>
                </View>

                <WordleText style={{marginRight: 10, fontSize: 16, color: '#202020', textAlign: 'right'}}>Version: {DeviceInfo.getVersion()}</WordleText>

                <Animated.View style={{alignSelf: 'center',  transform: [{scale: modalCloseButton}]}}>
                  <Pressable
                  onPressIn={()=>buttonPressIn(modalCloseButton)}
                  onPressOut={()=>buttonPressOut(modalCloseButton)}
                  onPress={()=>{toggleGameInfoWithThisModal(false)}}
                  >
                    <ImageBackground
                    source={buttons.redButton}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                    >
                      <WordleText style={{paddingVertical: 10, paddingHorizontal: 24, color: 'white'}}>Close</WordleText>
                    </ImageBackground>
                  </Pressable>

                </Animated.View>
                </ScrollView>


              </View>
            </View>
          </ImageBackground>
       </View>       
      </Modal>
    </>
  );


};

export default SettingsModal;

const gameBackgrounds = {
  defaultBackground: require('../source/images/background.png'),
};

type SettingsType = {
  background: string;
  dictionary: string;
  sound: number;
  music: number;
  voice: number;
  notifications: Record<number, number>;
};

export let SettingsData : SettingsType;

type SLiderOptionsProps={
  makeTheVariableChange:(value: number)=>void;
  option: string;
  initialValue: number;
  trackColor: string;
  progressColor: string;
  thumbColor: string;
  infoBtnFunction: (value: boolean)=>void;
  visiblityParameter: boolean;
  descriptionText: string;
  infoSectionWidth: DimensionValue;
}

const Sliders=(props:SLiderOptionsProps)=>{
  const translateX = useSharedValue(props.initialValue*SLIDER_WIDTH);
  const startX = useSharedValue(props.initialValue*SLIDER_WIDTH);

const clickGesture = Gesture.Tap()
  .onStart((event) => {
    const tappedValue = Math.min(Math.max(event.x / SLIDER_WIDTH, 0), 0.9);
    translateX.value = tappedValue * SLIDER_WIDTH;
    runOnJS(props.makeTheVariableChange)(Math.min(Math.max(tappedValue, 0), 1));
  });

const panGesture = Gesture.Pan()
  .onStart(()=>{
    startX.value=translateX.value;
  })
  .onUpdate((event) => {
    
    const newPosition = startX.value + event.translationX;
    const clampedPosition = Math.min(Math.max(newPosition, 0), SLIDER_WIDTH - THUMB_SIZE/1.2);
    translateX.value = clampedPosition;
    const volumeValue = clampedPosition / (SLIDER_WIDTH - THUMB_SIZE/1.2);
    runOnJS(props.makeTheVariableChange)(volumeValue);
  });

const sliderGesture = Gesture.Race(panGesture, clickGesture);

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - THUMB_SIZE / 2 }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  return (
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginVertical: 5}}>
                    <WordleText>{props.option}</WordleText>
                    <GestureDetector gesture={sliderGesture}>
                        <View style={styles.sliderContainer}>
                            <View style={[styles.track, {backgroundColor: props.trackColor}]} />
                            <Reanimated.View style={[styles.progress, progressStyle, {backgroundColor: props.progressColor}]} />
                            <Reanimated.View style={[styles.thumb,  thumbStyle, {backgroundColor: props.thumbColor}]} />
                        </View>
                    </GestureDetector>
                    <Pressable onPress={()=>props.infoBtnFunction(!props.visiblityParameter)}>
                      <Image source={buttons.infoButton} style={{width: 22, height: 22, borderRadius: 4, borderWidth: 1}}/>
                    </Pressable>
                    {props.visiblityParameter&&<View style={{position: 'absolute', right: 20, top: 25, zIndex: 2, backgroundColor: props.trackColor, width: props.infoSectionWidth}}>
                      <WordleText style={styles.infoText}>
                        {props.descriptionText}</WordleText>
                    </View>}
                  </View>
  )
}

type SettingsHeaderProps={
  header: string
  headerBgColor: string
}

export const SettingsHeader=(props: SettingsHeaderProps)=>{
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginVertical: 5}}>
        <WordleText style={{fontSize: 16, backgroundColor: props.headerBgColor, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 4}}>{props.header}</WordleText>
        <View style={{flex: 1, marginRight: 30, height: 1.5, backgroundColor: '#444444'}}/>
    </View>
  )
}

type NotificationsProps={
  notifyText: string;
  value: number;
  updateSettingsInFile: ()=>void;
}

const Notifications=(props: NotificationsProps)=>{
  const isOn=useSharedValue(props.value);
  const switchColors=['#505251', '#214739'];
  const containerColors=['#a7abaa', '#418c6f'];

  const left=useSharedValue(props.value==0? 0: 20);
  const rotation=useSharedValue(props.value==0?0: 180);

  const rollTheSwitch=useAnimatedStyle(()=>{
    return {left: left.value, transform: [{rotate: rotation.value+'deg'}]}
  })

  const animatedContainerColor=useAnimatedStyle(()=>{
    const currentContainerColor=interpolateColor(
      isOn.value, [0, 1], containerColors
    );
    return {backgroundColor: currentContainerColor}
  })

    const animatedSwitchColor=useAnimatedStyle(()=>{
    const currentSwitchColor=interpolateColor(
      isOn.value, [0, 1], switchColors
    );
    return {backgroundColor: currentSwitchColor}
  })

  const toggleSwitch=()=>{
    isOn.value=Math.abs(1-isOn.value);
    left.value=withTiming(isOn.value === 0 ? 20 : 0, { duration: 300 });
    rotation.value=withTiming(isOn.value === 0 ? 180 : 0, { duration: 300 });
    if(settingsDataSavingTimeout) clearTimeout(settingsDataSavingTimeout);
    settingsDataSavingTimeout=setTimeout(()=>props.updateSettingsInFile(), 1000);
  }


  return (
    <ImageBackground
        source={buttons.wideWhiteButton}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1, marginVertical: 1}}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 5}}>
        <WordleText style={{fontSize: 15, color: '#444444', paddingHorizontal: 4, paddingVertical: 10, flex: 1, flexShrink: 1}}>{props.notifyText}</WordleText>
        <Pressable onPress={()=>{toggleSwitch()}}>
          <Reanimated.View style={[styles.switchContainer, animatedSwitchColor]}>
            <Reanimated.View style={[styles.switch, animatedContainerColor, rollTheSwitch]}/>
          </Reanimated.View>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

type OtherSectionBtnsProps={
  onClick: (value: boolean|string)=>void;
  text: string;
  value: boolean|string;
  animatedValue: Animated.Value
}

const OtherSectionsBtns=(props: OtherSectionBtnsProps)=>{
  return(
  <Animated.View style={{transform: [{scale: props.animatedValue}]}}>
  <Pressable 
    style={{alignSelf: 'center', marginBottom: 6}} 
    onPress={()=>props.onClick(props.value)}
    onPressIn={()=>buttonPressIn(props.animatedValue)}
    onPressOut={()=>buttonPressOut(props.animatedValue)}
  >
        <ImageBackground source={buttons.wideWhiteButton} imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}} style={{paddingHorizontal: 5}}>
          <WordleText style={{paddingHorizontal: 8, paddingVertical: 6, fontSize: 17}}>{props.text}</WordleText>
        </ImageBackground>
  </Pressable>
  </Animated.View>
  )
}

type CheckerBoxesProps={
    text: string;
    onClick: (value: number)=>void;
    selected: boolean;
    checker: number;
}

const CheckerBoxes=(props: CheckerBoxesProps)=>{
  return(
  <View style={{flexDirection: 'row', gap: 5}}>
      <Pressable onPress={()=>{props.onClick(props.checker)}}>
        <View style={styles.checkerBoxContainer}>
        <View style={{width: 12, height: 12, backgroundColor: props.selected? '#464685': 'transparent', borderRadius: 2, marginTop: 0.5}}/>
        </View>
      </Pressable>
      <WordleText style={{fontSize: 16, color: '#444444'}}>{props.text}</WordleText>
  </View>)
}

type StudioMediaPageBtnsProps={
  onClick: (value: string)=>void;
  icon: ImageProps;
  value: string;
  animatedValue: Animated.Value
}

const StudioMediaPageBtns=(props: StudioMediaPageBtnsProps)=>{
  return(
  <Animated.View style={{transform: [{scale: props.animatedValue}]}}>
  <Pressable 
    style={{alignSelf: 'center', marginBottom: 6}} 
    onPress={()=>props.onClick(props.value)}
    onPressIn={()=>buttonPressIn(props.animatedValue)}
    onPressOut={()=>buttonPressOut(props.animatedValue)}
  >
        <ImageBackground source={buttons.wideWhiteButton} imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}} style={{paddingHorizontal: 5}}>
          <View style={{paddingHorizontal: 2, paddingVertical: 6}}>
          <Image style={{width: 25, height: 25}} source={props.icon}/>
          </View>
        </ImageBackground>
  </Pressable>
  </Animated.View>
  )
}

export const createSettingsFunctionAtBeginning=async()=>{
  const rawSettingsData={
  background: 0,
  dictionary: 'English (U.S.)',
  sound: 0.9,
  music: 0.9,
  voice: 0.9,
  notifications: {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
  }
  };
  const profileDataFileName = "settings-data.json";
  const path = `${RNFS.DocumentDirectoryPath}/${profileDataFileName}`;
  await RNFS.writeFile(path, JSON.stringify(rawSettingsData), 'utf8');
}

export const fetchSettingsDataAtBeginning=async()=>{

  const profileDataFileName = "settings-data.json";
  const path = `${RNFS.DocumentDirectoryPath}/${profileDataFileName}`;
  const exists=await RNFS.exists(path);
  if(!exists) await createSettingsFunctionAtBeginning();
  const fileData=await RNFS.readFile(path);
  const previousSettingsData=JSON.parse(fileData);
  SettingsData=previousSettingsData;
  switch(Number(SettingsData.background)){
    case 0: SettingsData.background=gameBackgrounds.defaultBackground;
  }

  console.log(SettingsData);
}
