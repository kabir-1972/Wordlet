/**
 * Header to be shown in Wordle Matches...
**/

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextProps, ImageBackground, Animated, Image, Pressable, Modal, ImageSourcePropType, ScrollView } from 'react-native';
import { styles } from "../../source/styles/header-inmatch-styles"
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { buttons, icons, modalBackgrounds } from '../../source/styles/assets';
import { buttonPressIn,buttonPressOut } from '../../source/styles/allAnimations';
import { OutlinedText, ScoreOutlinedText } from '../../source/styles/outlinedText';
import { StarAnimation, StarAnimationRef } from '../../source/styles/star-animation-styles';
import LightSweep from '../../source/styles/ingame-animations';
import { BasicWordle, ReverseWordle, MultiplayerWordle, ShiftedWordle, PreSolvedWordle,
         BasicWordleExample, ReverseWordleExample, MultiplayerWordleExample, ShiftedWordleExample, PreSolvedWordleExample 

 } from './Wordle-GameInfo-SubScreen';
import { AddCoinModal } from '../Add-Coin-Modal'
import { SettingsModal } from '../Profile2';
import { ProfileModal } from '../Profile';


type HeaderDataProps={
    xp: string,
    gameName: string,
    gameMode: string,
    coins: number,
    score: string,
    winStreak: string
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

                    <ImageBackground
                    source={buttons.tealButton}
                    style={styles.button}
                    imageStyle={styles.buttonStyle}
                    >
                    <View style={styles.scoreCardContainer}>
                        <View style={{alignItems: 'center'}}><HeaderText style={{color:'black'}}>Score</HeaderText><ScoreOutlinedText text={props.score}/></View>
                        <View style={{height: '80%', width: 1, backgroundColor: 'black', marginTop: -3}}></View>
                        <View style={{alignItems: 'center'}}><HeaderText style={{color:'black'}}>Win Streak</HeaderText><ScoreOutlinedText text={props.winStreak}/></View>
                    </View>
                    </ImageBackground>
        </View>
        <SettingsModal
        visible={settingsModalVisibility}
        onclose={hideSettingsModal}
        />

        <WordleGameInfoModal
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

interface StarAnimationValues {
    vertical: number;
    horizontal: number;
}


function toggleValue(starAnimationValues: StarAnimationValues): StarAnimationValues{
  const vertical = - starAnimationValues.vertical;
  const horizontal = - starAnimationValues.horizontal;
  return {vertical, horizontal};
}


const WordleGameInfoModal=(props: GameInfoModalProps)=>{

    const starAnimationBtnRef = useRef<View>(null);
    const StarAnimRef = useRef<StarAnimationRef>(null); 

    const [triggerLightSweep, setTriggerLightSweep]=useState(true);

    const [starAnimationValues1, setStarAnimationValues1]=useState<StarAnimationValues>({
        vertical: 70,
        horizontal: 20
    });

        const [starAnimationValues2, setStarAnimationValues2]=useState<StarAnimationValues>({
        vertical: -80,
        horizontal: 15
    });

        const [starAnimationValues3, setStarAnimationValues3]=useState<StarAnimationValues>({
        vertical: 60,
        horizontal: -15
    });

    useEffect(() => {
    const interval = setInterval(() => {
      setStarAnimationValues1(prev => toggleValue(prev));
      setStarAnimationValues2(prev => toggleValue(prev));
      setStarAnimationValues3(prev => toggleValue(prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
    StarAnimRef.current?.startAnimation(0.7, true);
  }, [starAnimationValues1, starAnimationValues2, starAnimationValues3]);
 
    setTimeout(()=>{
        setTriggerLightSweep(!triggerLightSweep);},550);
        
    let subScreen;
    let titleWidth;
    let exampleScreen;

    switch(true){
        case props.gameName.includes("Basic"): subScreen=BasicWordle; titleWidth=110; exampleScreen=BasicWordleExample; break;
        case props.gameName.includes("Reverse"): subScreen=ReverseWordle; titleWidth=120; exampleScreen=ReverseWordleExample; break;
        case props.gameName.includes("Shifted"): subScreen=ShiftedWordle; titleWidth=110; exampleScreen=ShiftedWordleExample; break;
        case props.gameName.includes("Solved"): subScreen=PreSolvedWordle; titleWidth=160; exampleScreen=PreSolvedWordleExample; break;
        case props.gameName.includes("Multiplayer"): subScreen=MultiplayerWordle; titleWidth=150; exampleScreen=MultiplayerWordleExample; break;
        default: subScreen=BasicWordle; exampleScreen=BasicWordleExample; break;
    }

    //The width for the title at the head of the GameInfoModal....
    
    return (
        <Modal
                visible={props.visible}
                onRequestClose={props.onclose}
                transparent={true}
                >   
            <View style={modalStyles.container}>
                <ImageBackground 
                source={props.bgImage}
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
                        <ModalContentText>Guess the secret word within the specified number of tries.</ModalContentText>
                    </View>
                    <WordleText style={{textAlign: 'center', fontSize: 20, marginTop: 10, marginBottom: 3, color: 'wheat'}}>Guidelines</WordleText>
                    <View style={modalStyles.horizontalBar}></View>
                    {subScreen()}
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Guess the word before the wordle window gets filled up</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>   
                            <ModalContentText>  You receive experience points and coins for each correct guess. The fewer attempts you use, the higher your score and rewards will be.
                            </ModalContentText>
                        </View>
                    <View style={modalStyles.horizontalBar}></View>
                    {exampleScreen()}    
                    <ParagraphText style={{color: '#dcf9f5'}}>4. Assistance</ParagraphText>
                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: '#e1fbeb'}]}>
                            <View style={modalStyles.colorRow}>
                            <ImageBackground
                                        source={buttons.starsThrowButton}
                                        style={[modalStyles.stars]}
                                        imageStyle={modalStyles.starsThrowImage}
                                        ref={starAnimationBtnRef}
                                      >
                                        <StarAnimation
                                          ref={StarAnimRef}
                                          animationStart1={{ x: 0, y: 0 }}
                                          animationStart2={{ x: 0, y: 0 }}
                                          animationStart3={{ x: 0, y: 0 }}
                                          animationEnd1={{ 
                                            x: starAnimationValues1.horizontal?starAnimationValues1.horizontal:0,
                                            y: starAnimationValues1.vertical?starAnimationValues1.vertical:0 }}
                                          animationEnd2={{ 
                                            x: starAnimationValues2.horizontal?starAnimationValues2.horizontal:0,
                                            y: starAnimationValues2.vertical?starAnimationValues2.vertical:0 }}
                                          animationEnd3={{
                                            x: starAnimationValues3.horizontal?starAnimationValues3.horizontal:0,
                                            y: starAnimationValues3.vertical?starAnimationValues3.vertical:0 }}
                                        />
                                      </ImageBackground>
                            <ModalContentText>
                               Three stars are shot at a time to three letters on the keyboard that are not in the secret word and the corresponding keys are painted in black. Remains locked if there are less than three not-in-the-secret-word letters.
                            </ModalContentText>
                            </View>
                            <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                            <ModalContentText>Cost: 120</ModalContentText>
                            <Image
                            source={icons.coin}
                            style={{width: 15, height: 15}}
                            ></Image>
                            </View>
                            <ModalContentText style={{marginTop: -1}}>Cooldown: 1s</ModalContentText>
                            </View>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: '#e1fbeb'}]}>
                            <View style={modalStyles.colorRow}>
                                        <ImageBackground
                                            source={buttons.wandRotate}
                                            style={modalStyles.wandRotate}
                                            imageStyle={modalStyles.wandRotateImage}
                                        >       
                                        <LightSweep trigger={triggerLightSweep} sweepHorizontal={50} startingPoint={30} />
                                        </ImageBackground>
                            <ModalContentText>
                               The wand fills an empty box in the wordle window with a correctly-positioned letter. It only works if there is at least one empty box in the currently active row.
                            </ModalContentText></View>
                            <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                            <ModalContentText>Cost: 50</ModalContentText>
                            <Image
                            source={icons.coin}
                            style={{width: 15, height: 15}}
                            ></Image>
                            </View>
                            <ModalContentText style={{marginTop: -1}}>Cooldown: 1s</ModalContentText>
                            </View>
                            </View>
                            <View style={{alignItems: 'center'}}>
                            <HeaderText style={{fontSize: 15, lineHeight: 24}}>Currently Set Dictionary Language:</HeaderText>
                            <HeaderText style={{fontSize: 15, lineHeight: 24}}>English (U.S.)</HeaderText>
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
