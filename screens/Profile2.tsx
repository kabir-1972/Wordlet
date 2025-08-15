import React, { useRef, useState } from 'react';
import { View, Modal, ImageSourcePropType, StyleSheet, TextProps, Text, ScrollView, ImageBackground, Animated, Pressable, Image, Button, ImageProps } from 'react-native';
import { profileModalStyles as styles} from '../source/styles/header-modal-styles';
import { buttons, modalBackgrounds, avatars } from '../source/styles/assets';
import { WordleText } from './Skip-Game-Modal';
import { icons } from '../source/styles/assets';
import { SettingsHeader } from './Settings';
import { OutlinedText } from '../source/styles/outlinedText';
import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations';
//import { ProfileData } from './AccessProfileData';

const  ProfileModal=()=>{
    const [visible, setVisible]=useState(true);
    const changeAvatarBtnScale=useRef(new Animated.Value(1)).current;
    const changeStatusBtnScale=useRef(new Animated.Value(1)).current;
    const changeNameBtnScale=useRef(new Animated.Value(1)).current;

    const gameDataBtnScale=useRef(new Animated.Value(1)).current;
    const achievementsBtnScale=useRef(new Animated.Value(1)).current;
    const tournamentsBtnScale=useRef(new Animated.Value(1)).current;

    const [currentTabIndex, setCurrentTabIndex]=useState(4);

function daysFromToday(dateStr: string): number {
  const dateObjects=dateStr.split(' ');
  let month: number;


  switch(dateObjects[0]){
    case 'Jan': month=1; break;
    case 'Feb': month=2; break;
    case 'Mar': month=3; break;
    case 'Apr': month=4; break;
    case 'May': month=5; break;
    case 'Jun': month=6; break;
    case 'Jul': month=7; break;
    case 'Aug': month=8; break;
    case 'Sep': month=9; break;
    case 'Oct': month=10; break;
    case 'Nov': month=11; break;
    case 'Dec': month=12; break;
    default: month=1; break;
  }
  const parsedDate=dateObjects[2]+'-'+month+'-'+dateObjects[1].slice(0, -1);  


  const givenDate = new Date(parsedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  givenDate.setHours(0, 0, 0, 0);
  const diffMs =  today.getTime()-givenDate.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

function lastSeenTime(dateStr: string): string {
const dateObjects=dateStr.split(' ');
  let month: number;


  switch(dateObjects[0]){
    case 'Jan': month=1; break;
    case 'Feb': month=2; break;
    case 'Mar': month=3; break;
    case 'Apr': month=4; break;
    case 'May': month=5; break;
    case 'Jun': month=6; break;
    case 'Jul': month=7; break;
    case 'Aug': month=8; break;
    case 'Sep': month=9; break;
    case 'Oct': month=10; break;
    case 'Nov': month=11; break;
    case 'Dec': month=12; break;
    default: month=1; break;
  }
  const parsedDate=dateObjects[2]+'-'+month+'-'+dateObjects[1].slice(0, -1);  


  const givenDate = new Date(parsedDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  givenDate.setHours(0, 0, 0, 0);
  const diffMs =  today.getTime()-givenDate.getTime();
  const day=diffMs/(1000 * 60 * 60 * 24);
  if(day==0) return 'Today';
  else if(day==1) return 'Yesterday';
  else if(day==2) return 'Day before Yesterday';
  else if(day>2&&day<=7) return 'This Week';
  else if(day>7&&day<=14) return 'Last Week';
  else if(day>15&&day<=30) return 'This Month';
  else if(day>30&&day<90) return 'Less Three Months Ago';
  else if(day>90&&day<365) return 'More Three Months Ago';
  else return 'More than a Year Ago';
}

    const statusBtnScaleArray=Array.from({length: 20}).map((_, item)=>useRef(new Animated.Value(1)).current);
    const [selectedStatus, setSelectedStatus]=useState<number|undefined>();

    const setStatusBtnScale=useRef(new Animated.Value(1)).current;
    const cancelStatusBtnScale=useRef(new Animated.Value(1)).current;

    const updatePreviousStatus=(status: number|undefined)=>{
        if(status) AdditionalProfileData.status=status;
    }

    return (
        <ImageBackground
        source={SettingsData.background}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
        >
            <Button title='Clicks' onPress={()=>setVisible(true)}></Button>
        <Modal
                        visible={visible}
                        onRequestClose={()=>setVisible(false)}
                        transparent={true}
                        >
                    <View style={styles.modalContainer}>
                        <ImageBackground 
                        source={modalBackgrounds.whiteModalBackgroundImg}
                        style={styles.backgroundImage}
                        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                        >  
                        <View style={styles.modalBackground}>
                          <View style={styles.modalContent}>
                            <View style={styles2.modalHeading}>
                                <Image source={icons.profileIcon} style={{width: 20, height: 20}}/>
                                <WordleText style={{paddingHorizontal: 5, paddingVertical: 4, fontSize: 15}}>Account</WordleText>
                            </View>
                            <ScrollView>
                            <SettingsHeader header='Player Info' headerBgColor='#ffa6b5'/>
                            <View style={{borderRadius: 4, borderWidth: 1, borderColor: '#777777', marginHorizontal: 20, flexDirection: 'row', padding: 5, gap: 4}}>
                                <View style={{justifyContent: 'center'}}>
                                <View style={{backgroundColor: '#f7fffd', justifyContent:'center', borderWidth: 0.8, borderStyle: 'dashed', borderRadius: 4}}>
                                    <Image source={avatarData[AdditionalProfileData.avatar]} style={{width: 80, height: 80}}/>
                                </View>
                                    <View style={{alignSelf: 'center', marginVertical: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image source={statusData[AdditionalProfileData.status].emote} style={{width: 25, height: 25, zIndex: 2}}/>
                                        <WordleText style={{backgroundColor: '#e9cafc', paddingHorizontal: 10, marginLeft: -10, paddingVertical: 2, borderRadius: 4, fontSize: 14}}>{statusData[AdditionalProfileData.status].status}</WordleText>
                                    </View>
                                    <Animated.View style={{transform: [{scale: changeStatusBtnScale}]}}>
                                    <Pressable
                                    onPressIn={()=>buttonPressIn(changeStatusBtnScale)}
                                    onPressOut={()=>buttonPressOut(changeStatusBtnScale)}
                                    onPress={()=>{setCurrentTabIndex(1)}}
                                    >
                                        <ImageBackground
                                            source={buttons.pinkButton}
                                            imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}    
                                        >
                                            <WordleText style={{paddingVertical: 6, paddingHorizontal: 4, fontSize: 13}}>Change Status</WordleText>    
                                        </ImageBackground>

                                    </Pressable>
                                </Animated.View>
                                </View>
                                <View style={{justifyContent: 'center', flex: 1}}>
                                    <View style={{alignSelf: 'center', marginVertical: 10, flexDirection: 'row', gap: 5}}>
                                        <ImageBackground
                                        source={icons.xp}
                                        style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}
                                        imageStyle={{resizeMode: 'stretch'}}
                                        >
                                            <OutlinedText text={ProfileData.playerLevel.toString()}/>
                                        </ImageBackground>
                                        
                                        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                                        <Image source={icons.trophyIcon} style={{width: 27, height: 27, zIndex: 2}}/>
                                            <View style={styles2.trophy}>
                                            <WordleText style={{color: '#242424', fontSize: 14, paddingHorizontal: 10, paddingVertical: 2, marginLeft: 5, marginTop: 2}}>100</WordleText>
                                            </View>
                                        </View>
                                    </View>
                                    <WordleText style={{fontSize: 16}}>{ProfileData.profileName}</WordleText>
                                    <View style={{width: '90%', height: 1, backgroundColor: '#a2a2a2'}}/>
                                    <AdditionalDataComponent info={AdditionalProfileData.joinDate} title='Playing Since'/>
                                    <AdditionalDataComponent info={(AdditionalProfileData.multiplayerMatches).toString()} title='Multiplayer Matches'/>
                                    <AdditionalDataComponent info={AdditionalProfileData.multiplayerWin.toString()} title='Multiplayer Match Wins'/>
                                    <AdditionalDataComponent info={AdditionalProfileData.multiplayerDraw.toString()} title='Multiplayer Match Draw'/>
                                    <AdditionalDataComponent info={AdditionalProfileData.winPercentage.toString()} title='Win Percentage'/>
                                </View>
                            </View>

                                <View style={{flexDirection: 'row', marginTop: 5, alignSelf: 'center', gap: 4}}>
                                <Animated.View style={{transform: [{scale: changeAvatarBtnScale}]}}>
                                    <Pressable
                                    onPressIn={()=>buttonPressIn(changeAvatarBtnScale)}
                                    onPressOut={()=>buttonPressOut(changeAvatarBtnScale)}
                                    onPress={()=>{}}
                                    >
                                        <ImageBackground
                                            source={buttons.goldenButton}
                                            imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}    
                                        >
                                            <WordleText style={{padding: 5}}>Change Avatar</WordleText>    
                                        </ImageBackground>

                                    </Pressable>
                                </Animated.View>

                                <Animated.View style={{transform: [{scale: changeNameBtnScale}]}}>
                                    <Pressable
                                    onPressIn={()=>buttonPressIn(changeNameBtnScale)}
                                    onPressOut={()=>buttonPressOut(changeNameBtnScale)}
                                    onPress={()=>{}}
                                    >
                                        <ImageBackground
                                            source={buttons.blueButton}
                                            imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}    
                                        >
                                            <WordleText style={{padding: 5}}>Change Name</WordleText>    
                                        </ImageBackground>

                                    </Pressable>
                                </Animated.View>
                                </View>

                            <View style={{borderRadius: 4, borderStyle: 'dashed', borderWidth: 1, flexDirection:'row', gap: 4, alignSelf: 'center', padding: 5, backgroundColor: '#e6fff4', marginVertical: 5}}>
                                <View>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 14, textAlign: 'center'}}>Account Age</WordleText>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 15, textAlign: 'center'}}>{daysFromToday(AdditionalProfileData.joinDate)+' days'}</WordleText>
                                </View>
                                <View style={{width: 1, height: '90%', alignSelf: 'center', backgroundColor: '#272727'}}/>
                                <View>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 14, textAlign: 'center'}}>Last Seen</WordleText>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 15, textAlign: 'center'}}>{lastSeenTime(AdditionalProfileData.joinDate)}</WordleText>
                                </View>
                                <View style={{width: 1, height: '90%', alignSelf: 'center', backgroundColor: '#272727'}}/>
                                <View>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 14, textAlign: 'center'}}>Login Streak</WordleText>
                                    <WordleText style={{color: '#5d5e5e', fontSize: 15, textAlign: 'center'}}>{AdditionalProfileData.loginStreak+' days'}</WordleText>
                                </View>
                            </View>
                                
                                <View style={{flexDirection: 'row', marginVertical: 5, alignSelf: 'center', gap: 3}}>
                                    <View>
                                        <Animated.View style={{transform:[{scale: gameDataBtnScale}]}}>
                                        <Pressable 
                                        onPressIn={()=>buttonPressIn(gameDataBtnScale)}
                                        onPressOut={()=>buttonPressOut(gameDataBtnScale)}
                                        onPress={()=>{setCurrentTabIndex(4)}}
                                        style={{backgroundColor: '#e6fffa', alignSelf: 'center', borderRadius: 4, borderWidth: 1}}>
                                            <WordleText style={{textAlign: 'center', padding: 4}}>Game Data</WordleText>
                                        </Pressable>
                                        </Animated.View>
                                    </View>
                                    <View>
                                        <Animated.View style={{transform:[{scale: achievementsBtnScale}]}}>
                                        <Pressable 
                                        onPressIn={()=>buttonPressIn(achievementsBtnScale)}
                                        onPressOut={()=>buttonPressOut(achievementsBtnScale)}
                                        onPress={()=>{setCurrentTabIndex(5)}}
                                        style={{backgroundColor: '#fca9b8', alignSelf: 'center', borderRadius: 4, borderWidth: 1}}>
                                            <WordleText style={{textAlign: 'center', padding: 4}}>Achievements</WordleText>
                                        </Pressable>
                                        </Animated.View>    
                                    </View>
                                    <View>
                                        <Animated.View style={{transform:[{scale: tournamentsBtnScale}]}}>
                                        <Pressable 
                                        onPressIn={()=>buttonPressIn(tournamentsBtnScale)}
                                        onPressOut={()=>buttonPressOut(tournamentsBtnScale)}
                                        onPress={()=>{setCurrentTabIndex(6)}}
                                        style={{backgroundColor: '#ffebb5', alignSelf: 'center', borderRadius: 4, borderWidth: 1}}>
                                            <WordleText style={{textAlign: 'center', padding: 4}}>Tournaments</WordleText>
                                        </Pressable>
                                        </Animated.View>    
                                    </View>
                                </View>

                                    {currentTabIndex==4&&<View style={{marginHorizontal: 10, backgroundColor: '#fae8c5'}}>
                                        <SettingsHeader header='Wordle' headerBgColor='#fcc556'/>
                                        <CompleteGameComponentForBothSingleAndMultiplayer gameName='Basic Wordle' singleData={ProfileGameData.basicWordle.single} multiplayerData={ProfileGameData.basicWordle.multiplayer}/> 
                                        <CompleteGameComponentForBothSingleAndMultiplayer gameName='Reversed Wordle' singleData={ProfileGameData.reversedWordle.single} multiplayerData={ProfileGameData.reversedWordle.multiplayer}/> 
                                        <CompleteGameComponentForBothSingleAndMultiplayer gameName='Shifted Wordle' singleData={ProfileGameData.shiftedWordle.single} multiplayerData={ProfileGameData.shiftedWordle.multiplayer}/> 
                                        <CompleteGameComponentForBothSingleAndMultiplayer gameName='PreSolved Wordle' singleData={ProfileGameData.preSolvedWordle.single} multiplayerData={ProfileGameData.preSolvedWordle.multiplayer}/> 
                                    
                                        <SettingsHeader header='Crossword' headerBgColor='#d0faa0'/>
                                    </View>}

                                    {currentTabIndex==1&&<View style={{marginHorizontal: 10, padding: 5}}>
                                        <WordleText style={{fontSize: 14, color: '#454545'}}>Select Your Status</WordleText>
                                        <View style={{width: '90%', height: 1, backgroundColor: '#565656'}}/>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderRadius: 4, borderWidth: 1, borderStyle: 'dashed', marginVertical: 5}}>
                                            {Object.entries(statusData).map(([key, value]) => (   
                                                <Animated.View key={key} style={{backgroundColor: '#dedede', marginHorizontal: 2, marginVertical: 3, minWidth: 80, transform: [{scale: statusBtnScaleArray[parseInt(key)-1]}]}}>
                                                <Pressable
                                                    onPressIn={()=>buttonPressIn(statusBtnScaleArray[parseInt(key)-1])}
                                                    onPressOut={()=>buttonPressOut(statusBtnScaleArray[parseInt(key)-1])}
                                                    onPress={()=>{setSelectedStatus(parseInt(key))}}
                                                >
                                                <View style={{marginVertical: 2, padding: 3, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Image source={value.emote} style={{width: 45, height: 45}}/>
                                                    {selectedStatus==parseInt(key)&&<Image source={icons.greenTickIcon} style={{width: 10, height: 10, position: 'absolute', top: 3, right: 3}}/>}
                                                    <WordleText style={{fontSize: 14, backgroundColor: value.color, padding: 5, borderRadius: 4, width: '100%', textAlign: 'center', marginVertical: 3}}>{value.status}</WordleText>
                                                </View>
                                                </Pressable>
                                                </Animated.View>
                                            ))}
                                        </ScrollView>
                                            <WordleText style={{fontSize: 14, color: '#454545', textAlign: 'center'}}>Currently Selected Status: {statusData[AdditionalProfileData.status].status}</WordleText>
                                            <View style={{flexDirection: 'row', alignSelf: 'center', gap: 4}}>
                                                <Animated.View style={{transform: [{scale: setStatusBtnScale}]}}>
                                                    <Pressable 
                                                    onPressIn={()=>buttonPressIn(setStatusBtnScale)}
                                                    onPressOut={()=>buttonPressOut(setStatusBtnScale)}
                                                    onPress={()=>{}}
                                                    >
                                                        <ImageBackground
                                                        source={buttons.blueButton}
                                                        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                                        >
                                                            <WordleText style={{paddingHorizontal: 15, paddingVertical: 8}}>Set Status</WordleText>
                                                        </ImageBackground>
                                                    </Pressable>
                                                </Animated.View>

                                                <Animated.View style={{transform: [{scale: cancelStatusBtnScale}]}}>
                                                    <Pressable 
                                                    onPressIn={()=>buttonPressIn(cancelStatusBtnScale)}
                                                    onPressOut={()=>buttonPressOut(cancelStatusBtnScale)}
                                                    onPress={()=>setCurrentTabIndex(4)}
                                                    >
                                                        <ImageBackground
                                                        source={buttons.redButton}
                                                        imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
                                                        >
                                                            <WordleText style={{paddingHorizontal: 15, paddingVertical: 8}}>Cancel</WordleText>
                                                        </ImageBackground>
                                                    </Pressable>
                                                </Animated.View>    
                                            </View>
                                        
                                        </View>
                                    }
                            </ScrollView>
                
                          </View>
                        </View>
                        </ImageBackground>
                    </View>
                </Modal>
        </ImageBackground>
    );
}

export default ProfileModal;

const SmallerWordleText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles2.wordleText, style]} allowFontScaling={false} {...rest}>
      {children}
    </Text>
    
  );
};

const gameBackgrounds={
    defaultBackground: require('../source/images/background.png')
}

const SettingsData={
    //read from the files and set things here...
    background: gameBackgrounds.defaultBackground,
    dictionary: "English (U.S.)"
};

type AdditionalDataComponentProps={
    title: string;
    info: string;
}

const AdditionalDataComponent=(props: AdditionalDataComponentProps)=>{
    return(
        <View style={{flexDirection: 'row', flex: 1, marginVertical: 2, borderBottomWidth: 1, borderColor: '#a0a0a0'}}>
                <SmallerWordleText style={{color: '#7a7a7a', fontSize: 13}}>{props.title}</SmallerWordleText>
                <View style={{flex: 1}}/>
                <SmallerWordleText>{props.info}</SmallerWordleText>
        </View>
    )
}

type BunchOfGameDataProps={
    name: Record<string, number>;
}

const BunchOfGameData = (props: BunchOfGameDataProps) => {
    return (
        <>
            {Object.entries(props.name).map(([key, value]) => (   
            <View key={key} style={{flexDirection: 'row', flex: 1, marginVertical: 2, borderBottomWidth: 1, borderColor: '#a0a0a0'}}>
                <SmallerWordleText style={{color: '#7a7a7a', fontSize: 13}}>{key}</SmallerWordleText>
                <View style={{flex: 1}}/>
                <SmallerWordleText>{value}</SmallerWordleText>
            </View>
            ))}
        </>
    );
};

type CompleteGameComponentForBothSingleAndMultiplayerProps={
    gameName: string,
    singleData: Record<string, number>;
    multiplayerData: Record<string, number>;
}

const CompleteGameComponentForBothSingleAndMultiplayer=(props: CompleteGameComponentForBothSingleAndMultiplayerProps)=>{
    return(
        
                                        <View style={{borderRadius: 4, borderWidth: 1, borderStyle: 'dashed', padding: 5, marginHorizontal: 4, marginVertical: 2}}>
                                            <WordleText style={{color: '#300f03'}}>{props.gameName}</WordleText>
                                            <View style={{height: 1, width: '100%', backgroundColor: '#966400', marginBottom: 4}}/>
                                            <View style={{flexDirection: 'row', gap: 4}}>
                                                <View style={{flex: 1}}>
                                                <WordleText style={{textAlign: 'center', paddingVertical: 3, paddingHorizontal: 10, backgroundColor: '#dead6d', alignSelf: 'center', borderRadius: 4, fontSize: 15}}>Single</WordleText>
                                                <BunchOfGameData name={props.singleData}/>
                                                </View>

                                                <View style={{flex: 1}}>
                                                <WordleText style={{textAlign: 'center', paddingVertical: 3, paddingHorizontal: 10, backgroundColor: '#dead6d', alignSelf: 'center', borderRadius: 4, fontSize: 15}}>Multiplayer</WordleText>
                                                <BunchOfGameData name={props.multiplayerData}/>
                                                </View>
                                            </View>
                                        </View>
    )
}


const styles2=StyleSheet.create({
    modalHeading: {
      backgroundColor: '#ffebba',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#91793d',
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 5
    },

    trophy:{
        backgroundColor: '#c2c3c4',
        borderRadius: 4,
        borderWidth: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -18
    },

    wordleText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 13
    },

    selectedBtn:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 4
    },



})

const ProfileData={
    profileName: 'Michael',
    playerXP: 7,
    playerCoins: 150,
    playerLevel: 5,
}

const avatarData: { [key: number]: any } = {
    1: avatars.avatar1
};


const AdditionalProfileData={
    avatar: 1,
    profileId: 197225,
    trophy: 100,
    joinDate: 'Aug 12, 2025',
    multiplayerMatches: 20,
    multiplayerWin: 15,
    multiplayerDraw: 1,
    winPercentage: 5,
    status: 2,
    lastSeen: 'Aug 12, 2025',
    loginStreak: 1
}

const statusData: { [key: number]: any }={
    1: {
        status: 'energized',
        emote: require("../source/images/emoticons/energized.png"),
        color: '#ccffee'

    },
    2: {
        status: 'teacher',
        emote: require("../source/images/emoticons/teacher.png"),
        color: '#fff7cc'
    },
    3: {
        status: 'relaxed',
        emote: require("../source/images/emoticons/relaxed.png"),
        color: '#ccffde'
    },
    4: {
        status: 'on vacation',
        emote: require("../source/images/emoticons/on-vacation.png"),
        color: '#ffcceb'
    },
    5: {
        status: 'exercising',
        emote: require("../source/images/emoticons/exercising.png"),
        color: '#e6ccff'
    },
    6: {
        status: 'playing',
        emote: require("../source/images/emoticons/playing.png"),
        color: '#ffd8cc'
    },
    7: {
        status: 'resting',
        emote: require("../source/images/emoticons/resting.png"),
        color: '#d4ffcc'
    },
    8: {
        status: 'disconnected',
        emote: require("../source/images/emoticons/disconnected.png"),
        color: '#fbccff'
    },
    9: {
        status: 'busy',
        emote: require("../source/images/emoticons/busy.png"),
        color: '#ffccec'
    },
    10: {
        status: 'sleeping',
        emote: require("../source/images/emoticons/sleeping.png"),
        color: '#ffccd8'
    },
    11: {
        status: 'sunshine',
        emote: require("../source/images/emoticons/sunshine.png"),
        color: '#ffe0bd'
    },
    12: {
        status: 'exhausted',
        emote: require("../source/images/emoticons/exhausted.png"),
        color: '#ffbde0'
    },
    13: {
        status: 'bored',
        emote: require("../source/images/emoticons/bored.png"),
        color: '#ffc7bd'
    },
    14: {
        status: 'depressed',
        emote: require("../source/images/emoticons/depressed.png"),
        color: '#ffbdea'
    },
    15: {
        status: 'healing',
        emote: require("../source/images/emoticons/healing.png"),
        color: '#f0cafc'
    },
    16: {
        status: 'wow',
        emote: require("../source/images/emoticons/wow.png"),
        color: '#fccad2'
    },
    17: {
        status: 'persistent',
        emote: require("../source/images/emoticons/persistent.png"),
        color: '#fcdeca'
    },
    18: {
        status: 'sad',
        emote: require("../source/images/emoticons/sad.png"),
        color: '#ddcafc'
    },
    19: {
        status: 'delighted',
        emote: require("../source/images/emoticons/delighted.png"),
        color: '#fccad3'
    },
    20: {
        status: 'lost',
        emote: require("../source/images/emoticons/lost.png"),
        color: '#e3fcca'
    },
}

const ProfileGameData={
    basicWordle : {
        single : {
        "Matches Played": 13,
        "Matches Won": 5,
        "Matches Draw" : 5,
        "Matches Lost": 3,
        "Win Percentage": 0.77 
        },

        
        multiplayer : {
        "Matches Played": 12,
        "Matches Won": 5,
        "Matches Draw" : 2,
        "Matches Lost": 5,
        "Win Percentage": 0.42 
        }
    },
    reversedWordle : {
        single : {
        "Matches Played": 13,
        "Matches Won": 5,
        "Matches Draw" : 5,
        "Matches Lost": 3,
        "Win Percentage": 0.77 
        },

        
        multiplayer : {
        "Matches Played": 12,
        "Matches Won": 5,
        "Matches Draw" : 2,
        "Matches Lost": 5,
        "Win Percentage": 0.42 
        }
    },
    shiftedWordle : {
        single : {
        "Matches Played": 13,
        "Matches Won": 5,
        "Matches Draw" : 5,
        "Matches Lost": 3,
        "Win Percentage": 0.77 
        },

        
        multiplayer : {
        "Matches Played": 12,
        "Matches Won": 5,
        "Matches Draw" : 2,
        "Matches Lost": 5,
        "Win Percentage": 0.42 
        }
    },
    preSolvedWordle : {
        single : {
        "Matches Played": 13,
        "Matches Won": 5,
        "Matches Draw" : 5,
        "Matches Lost": 3,
        "Win Percentage": 0.77 
        },

        
        multiplayer : {
        "Matches Played": 12,
        "Matches Won": 5,
        "Matches Draw" : 2,
        "Matches Lost": 5,
        "Win Percentage": 0.42 
        }
    }
}
