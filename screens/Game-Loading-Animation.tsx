import React, { useRef } from 'react';
import { View, Modal, ImageBackground, Text, Pressable, TextProps, Animated, StyleSheet, Image } from 'react-native';
import { styles } from "../source/styles/header-inmatch-styles"
import { modalStyles } from '../source/styles/wordle-header-inmatch-modals-style';
import { buttons, icons, modalBackgrounds } from '../source/styles/assets';
import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GameLoadingAnimationProps={
    gameLoadingAnimationPrompt: string
}

export const GameLoadingAnimation =(props: GameLoadingAnimationProps)=>{
    return(
        <View>
            <Text style={{fontFamily: 'Wordlet-Regular'}}>{props.gameLoadingAnimationPrompt}...</Text>
        </View>
    )
}