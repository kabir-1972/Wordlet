import React, { useRef } from 'react';
import { View, Modal, ImageBackground, Text, Pressable, TextProps, Animated, StyleSheet, Image } from 'react-native';
import { styles } from "../source/styles/header-inmatch-styles"
import { modalStyles } from '../source/styles/wordle-header-inmatch-modals-style';
import { buttons, icons, modalBackgrounds } from '../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateCoinsInPreviousProfileFile } from './AccessProfileData';

import { RootStackParamList } from '../types';
type SkipGameModalProps={
    visible: boolean;
    skippingCost: number;
    playerCoins: number;
    onclose: ()=> void;
}

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const SkipGameModal=(props: SkipGameModalProps)=>{
    const noButtonInSkipModal= useRef(new Animated.Value(1)).current;
    const yesButtonInSkipModal= useRef(new Animated.Value(1)).current;
    
    const navigation = useNavigation<NavigationProp>();
    const returnToWordleWindow = () => {
        //Reduce player coins by 150 for skipping back to that data
        //and update it in the file
        updateCoinsInPreviousProfileFile(props.playerCoins-150);
        navigation.navigate('Wordle');
    };

    return (
        <Modal
                visible={props.visible}
                onRequestClose={props.onclose}
                transparent={true}
                >
            <View style={modalStyles.container}>
                <ImageBackground 
                source={modalBackgrounds.whiteModalBackgroundImg}
                style={skipGameStyles.backgroundImage}
                imageStyle={{resizeMode: 'stretch',}}
                >  
                <View style={modalStyles.modalBackground}>
                  <View style={modalStyles.modalContent}>
                    <WordleText style={{fontSize: 20, marginHorizontal: 25, lineHeight: 25, textAlign: 'center'}}>Are you sure you want to skip the game?</WordleText>
                    <View style={skipGameStyles.warningTextContainer}>
                    <WordleText style={skipGameStyles.warningText}>
                        If you skip the Game, you won't be able to know the word. Moreover, the word won't be added to the WordleList and you may face the word again in another match.
                    </WordleText>
                    </View>
                    <View style={modalStyles.btnRow}>
                        <Animated.View style={{transform: [{ scale:noButtonInSkipModal }], flex: 1 }}
                        >
                            <Pressable
                            onPressIn={()=>buttonPressIn(noButtonInSkipModal)}
                            onPressOut={()=>buttonPressOut(noButtonInSkipModal)}
                            onPress={props.onclose}
                            >
                                <ImageBackground
                                source={buttons.greenButton}
                                style={modalStyles.button}
                                imageStyle={modalStyles.bgImage}
                                >
                                <WordleText style={{color: '#2e2e2e', fontSize: 18}}>Keep Playing</WordleText>
                                </ImageBackground>
                            </Pressable>
                        </Animated.View>

                        <Animated.View style={{transform: [{ scale:yesButtonInSkipModal }], flex: 1 }} >
                            <Pressable
                            onPressIn={()=>buttonPressIn(yesButtonInSkipModal)}
                            onPressOut={()=>buttonPressOut(yesButtonInSkipModal)}
                            onPress={returnToWordleWindow}
                            >
                                <ImageBackground
                                source={buttons.redButton}
                                style={modalStyles.button}
                                imageStyle={modalStyles.bgImage}
                                >
                                <WordleText style={{color: '#2e2e2e', marginBottom: 5}}>Skip It</WordleText>
                                <View style={{flexDirection: 'row', gap: 4,}}>
                                <WordleText style={{ fontSize: 15, ...props.playerCoins>=150?{color: 'white'}:{color: 'red'}}}>{props.skippingCost}</WordleText>
                                <Image source={icons.coin} style={{width: 15, height: 15}}></Image>
                                </View>
                                </ImageBackground>
                            </Pressable>
                        </Animated.View>

                    </View>

                  </View>
                </View>
                </ImageBackground>
            </View>
                </Modal>
    );
}

export const WordleText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[styles.wordleText, style]} {...rest}>
      {children}
    </Text>
    
  );
};


export const SmallerWhiteWordleText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[skipGameStyles.smallerWhiteWordleText, style]} {...rest}>
      {children}
    </Text>
    
  );
};


const skipGameStyles=StyleSheet.create({
    backgroundImage:{
    width: '100%',

    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    paddingVertical: 20,
    paddingBottom: 50,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 18,

    },
    warningTextContainer:{
        paddingVertical: 5,
        backgroundColor: '#e1fbfb',
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 10
    },

    warningText:{
        fontSize: 16,
        marginHorizontal: 5,
        lineHeight: 22,
        textAlign: 'center',
        color: '#034a49'
    },

    smallerWhiteWordleText:{
        color: 'white',
        fontFamily: 'Wordlet-Regular',
        fontSize: 15
    }

})