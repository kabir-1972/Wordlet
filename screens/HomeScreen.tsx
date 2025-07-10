import React, {useRef, useState} from 'react';
import { View, Text, ImageBackground, Pressable, Image } from 'react-native';
import { MainGameButton } from '../source/styles/home-page-styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { styles } from '../source/styles/home-page-styles';

export type NavigationProp =NativeStackNavigationProp<RootStackParamList, 'Home'>;

const App = () => {
    return(
    <ImageBackground
      source={require('../source/images/background.png')}
      style={styles.background}
      resizeMode="stretch"
    > 
    <View style={styles.container}>
    <TheThreeButtons></TheThreeButtons>
    </View>
    </ImageBackground> 
)};

const TheThreeButtons = () => {
    
const wordleButton= require('../source/images/buttons/wordle-button.png');
const crosswordsButton= require('../source/images/buttons/crosswords-button.png');
const moreGamesButton= require('../source/images/buttons/more-games-button.png');

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
        <Pressable
        onPress={()=>{
        }}
        style={{
            padding: 15,
            backgroundColor: 'salmon'
        }}    
        >
            <Text>CLick me For Wordle Match End</Text>
        </Pressable>  
    <View style={styles.twoButtons}>
        <MainGameButton name="Wordle" image={wordleButton} onPress = {showWorldeWindow} buttonStyle={styles.button}/>
        <MainGameButton name="Crosswords" image={crosswordsButton} onPress = {showCrosswordsWindow} buttonStyle={styles.button}/>
    </View>
    <View  style={styles.oneButton}>
        <MainGameButton name="MoreGames" image={moreGamesButton} onPress = {showMoreGamesWindow} buttonStyle={styles.SingleButton}/>
    </View>
    </View>   
)
}

export default App;
