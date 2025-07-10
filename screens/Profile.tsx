import React, { useRef, useState } from 'react';
import { View, Modal, ImageSourcePropType, ImageBackground, Text, Pressable } from 'react-native';
import { styles } from "../source/styles/header-inmatch-styles"
import { modalStyles } from '../source/styles/wordle-header-inmatch-modals-style';
import { modalBackgrounds } from '../source/styles/assets';

type ProfileModalProps={
    visible: boolean
    onclose: ()=> void;
}

export const ProfileModal=(props: ProfileModalProps)=>{
    return (
        <Modal
                visible={props.visible}
                onRequestClose={props.onclose}
                transparent={true}
                >
            <View style={styles.container}>
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