import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {styles} from '../source/styles/ingame-screen-styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setEnabled } from 'react-native/Libraries/Performance/Systrace';

const getValue = async (key: string): Promise<string | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Retrieval error:', e);
    return null;
  }
};


const App = () => {
  const [text, setText] = useState('');
  

useEffect(()=>{
  async function getTheValueFromAsyncStorage(){
    const value = await getValue("multiplayerGameData");
    console.log(value);

  }

  getTheValueFromAsyncStorage();

},[])

  return(
  <View style={styles.container}>
    <Text style={styles.text}>Loading...</Text>  
  </View>
);}

export default App;