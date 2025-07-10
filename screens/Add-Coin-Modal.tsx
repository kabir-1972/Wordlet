import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextProps, ImageBackground, Animated, Image, Pressable, Modal, ImageSourcePropType, ScrollView } from 'react-native';
import { styles } from "../source/styles/header-inmatch-styles"
import { modalStyles } from '../source/styles/wordle-header-inmatch-modals-style';
import { buttons, icons, modalBackgrounds } from '../source/styles/assets';
import { buttonPressIn,buttonPressOut } from '../source/styles/allAnimations';

type addCoinModalProps={
    visible: boolean
    onclose: ()=> void;
}


export const AddCoinModal=(props: addCoinModalProps)=>{
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
                  <View style={modalStyles.modalContent}>
                    <Text>Hello</Text>
                    <Pressable onPress={props.onclose}><Text>Close the Modal</Text></Pressable>
                  </View>
                </View>
                </ImageBackground>
            </View>
                </Modal>
    );
}