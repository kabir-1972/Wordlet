import React, { useRef, useState } from 'react';
import { View, Modal, ImageSourcePropType, ImageBackground, Pressable } from 'react-native';
import { styles } from '../source/styles/header-modal-styles';
import { modalBackgrounds } from '../source/styles/assets';
import { WordleText } from './Skip-Game-Modal';

type SettingsModalProps={
    visible: boolean
    onclose: ()=> void;
}

/*export default*/ const  SettingsModal=(/*props: SettingsModalProps*/)=>{
    return (
        <ImageBackground
        source={SettingsData.background}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        >
        <Modal
                visible={true}
                onRequestClose={/*props.onclose*/()=>{}}
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
                    <WordleText style={{textAlign: 'center', fontSize: 20}}>Game Settings</WordleText>
                    </View>
                </View>
                </ImageBackground>
            </View>
        </Modal>
        </ImageBackground>
    );
}

export default SettingsModal;

const gameBackgrounds={
    defaultBackground: require('../source/images/background.png')
}

export const SettingsData={
    //read from the files and set things here...
    background: gameBackgrounds.defaultBackground,
    dictionary: "English (U.S.)"
};

