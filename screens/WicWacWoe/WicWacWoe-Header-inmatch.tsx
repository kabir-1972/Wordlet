/**
 * Header to be shown in Wordle Matches...
**/

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextProps, ImageBackground, Animated, Image, Pressable, Modal, ImageSourcePropType, ScrollView } from 'react-native';
import { styles } from "../../source/styles/header-inmatch-styles"
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { buttons, icons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn,buttonPressOut } from '../../source/styles/allAnimations';
import { OutlinedText } from '../../source/styles/outlinedText';
import { WordChains} from './WicWacWoe-GameInfo-SubScreen';
import { AddCoinModal } from '../Add-Coin-Modal'
import { SettingsData, SettingsModal } from '../Profile2';
import { ProfileModal } from '../Profile';


type HeaderDataProps={
    xp: string,
    gameName: string,
    gameMode: string,
    coins: number,
}

export const HeaderInMatch=(props: HeaderDataProps)=>{
    const headerGameInfoBtnScale = useRef(new Animated.Value(1)).current;
    const settingsBtnScale = useRef(new Animated.Value(1)).current;
    const profileBtnScale = useRef(new Animated.Value(1)).current;
    const coinBtnScale = useRef(new Animated.Value(1)).current;

    const [settingsModalVisibility,setSettingsModalVisibility]=useState(false);
    const [profileSettingsModalVisiblity,setProfileSettingsModalVisiblity]=useState(false);
    const [addCoinModalVisiblity,setAddCoinModalVisiblity]=useState(false);
    const [gameInfoModalVisiblity,setGameInfoModalVisiblity]=useState(false);


    const hideSettingsModal = () => {setSettingsModalVisibility(false)};
    const hideProfileSettingsModal = () => {setProfileSettingsModalVisiblity(false)};
    const hideAddCoinModal = () => {setAddCoinModalVisiblity(false)};
    const hideGameInfoModal = ()=> {setGameInfoModalVisiblity(false)};

    const headerForPlayer=()=>(
    <View style={styles.container}>
        <View style={styles.upperRow}>
            <View style={{flexDirection: 'row', gap: 5}}>    
            <Animated.View style={{transform:[{scale: settingsBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(settingsBtnScale)}}
                onPressOut={()=>{buttonPressOut(settingsBtnScale)}}
                onPress={settingsBtnPressed}
                >
                    <ImageBackground
                    source={buttons.blueButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.settingsIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>

            <Animated.View style={{transform:[{scale: profileBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(profileBtnScale)}}
                onPressOut={()=>{buttonPressOut(profileBtnScale)}}
                onPress={settingsBtnPressed}
                >
                    <ImageBackground
                    source={buttons.grayButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.profileIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>        
            </View>

            <View>
            <ImageBackground
            source={icons.xp}
            style={styles.xpImage}
            imageStyle={styles.xpImageStyle}>
            {<OutlinedText text={props.xp}/>}
            </ImageBackground>
            </View>

            <Animated.View style={{transform:[{scale: coinBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(coinBtnScale)}}
                onPressOut={()=>{buttonPressOut(coinBtnScale)}}
                onPress={addCoinsBtnPressed}
                >
            <View style={styles.inGameCoin}>
                <View style={styles.coinContainer}>
                <View style={styles.coinContainerInline}></View>
                <Text style={styles.coinText}>{props.coins}</Text>
                </View>
                <Image 
                source={icons.coin}
                style={styles.coinImage}>
                </Image>
            </View></Pressable>
        </Animated.View>
        </View>
        <View style={styles.lowerRow}>

            <Animated.View style={{transform:[{scale: headerGameInfoBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(headerGameInfoBtnScale)}}
                onPressOut={()=>{buttonPressOut(headerGameInfoBtnScale)}}
                onPress={gameInfoHeaderBtnPressed}
                >
                    <ImageBackground
                    source={buttons.pinkButton}
                    style={styles.button}
                    imageStyle={styles.buttonStyle}
                    >
                    <View style={styles.headerInfoBtnContent}>
                        <View style={styles.headerInfoBtnText}>
                            <HeaderText style={{color: 'black', fontSize: 15, textAlign: 'center'}}>{props.gameName}</HeaderText>
                            <HeaderText style={{color: 'white', fontSize: 12, textAlign: 'center'}}>{props.gameMode}</HeaderText>
                        </View>
                        <View style={{paddingVertical: 3, paddingRight: 7, paddingLeft: 2}}>
                            <View style={styles.headerInfoBtn}>
                                <HeaderText style={styles.infoText}>i</HeaderText>
                            </View>
                        </View>
                    </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>
        </View>
        <SettingsModal
        visible={settingsModalVisibility}
        onclose={hideSettingsModal}
        />

        <AnagrammistGameInfoModal
        bgImage={modalBackgrounds.blackModalBackgroundImg}
        visible={gameInfoModalVisiblity}
        onclose={hideGameInfoModal}
        gameName={props.gameName}
        />

        <AddCoinModal
        visible={addCoinModalVisiblity}
        onclose={hideAddCoinModal}
        />

        <ProfileModal
        visible={profileSettingsModalVisiblity}
        onclose={hideProfileSettingsModal}
        />

    </View>
    )
    return headerForPlayer();
    
function gameInfoHeaderBtnPressed(){
    setGameInfoModalVisiblity(true);
}

function settingsBtnPressed(){
    setSettingsModalVisibility(true);
    
}

function addCoinsBtnPressed(){
    setAddCoinModalVisiblity(true);
}

}


const HeaderText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.headerText, style]} {...rest}>
      {children}
    </Text>
    
  );
};

const WordleText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.wordleText, style]} {...rest}>
      {children}
    </Text>
    
  );
};


export const ParagraphText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.paragraphText, style]} {...rest}>
      {children}
    </Text>
    
  );
};

export const ModalContentText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.modalContentText, style]} {...rest}>
      {children}
    </Text>
    
  );
};


type GameInfoModalProps={
    bgImage: ImageSourcePropType,
    visible: boolean
    onclose: ()=> void;
    gameName: string
}

export const AnagrammistGameInfoModal=(props: GameInfoModalProps)=>{
    return (
        <Modal
                visible={props.visible}
                onRequestClose={props.onclose}
                transparent={true}
                >   
            <View style={modalStyles.container}>
                <ImageBackground 
                source={modalBackgrounds.blackModalBackgroundImg}
                style={modalStyles.backgroundImage}
                imageStyle={{resizeMode: 'stretch',}}
                >  
                <View style={modalStyles.modalBackground}>
                <View style={modalStyles.header}>
                    <View style={{marginTop: 3, flex: 1, marginLeft: 20}}>
                        <WordleText style={{textAlign: 'center', fontSize: 20, color: '#c8cccb'}}>{props.gameName}</WordleText>
                    </View>
                    <Pressable
                    onPressIn={()=>{buttonPressIn}}
                    onPressOut={()=>{buttonPressOut}}
                    onPress={props.onclose}
                    style={modalStyles.rightBox}
                    >
                     <Image
                     source={buttons.closeModalButton}
                     style={{
                        width: 25,
                        height: 25,
                        borderRadius: 4,
                        borderWidth: 1
                     }}
                     ></Image>   
                    </Pressable>
                </View>   
                    <ScrollView contentContainerStyle={{
                            paddingBottom: 10,
                            backgroundColor: '#808080',
                            marginLeft: 10,
                            marginRight: 8,
                            borderRadius: 5,
                            marginTop: 5
                        }}
                        style={{marginBottom: 60}}
                    > 
                  <View style={modalStyles.modalContent}>
                    <ParagraphText style={{color: '#dcf9f5'}}>Objective</ParagraphText>
                    <View style={modalStyles.modalSubContent}>
                        <ModalContentText>Create words as many as you can and fill up the board, following the rules.</ModalContentText>
                    </View>
                    <WordleText style={{textAlign: 'center', fontSize: 20, marginTop: 10, marginBottom: 3, color: 'wheat'}}>Guidelines</WordleText>
                    <View style={modalStyles.horizontalBar}></View>
                    {WordChains()}
                            <View style={{alignItems: 'center'}}>
                            <HeaderText style={{fontSize: 15, lineHeight: 24}}>Currently Set Dictionary Language:</HeaderText>
                            <HeaderText style={{fontSize: 15, lineHeight: 24}}>{SettingsData.dictionary}</HeaderText>
                            <HeaderText style={{fontSize: 15, lineHeight: 24}}>You can change the language in the settings.</HeaderText>
                            </View>
                        </View>
            </ScrollView>

                </View>
                </ImageBackground>
            </View>
                </Modal>
    );
}
