import React, { useState } from 'react';
import { View, TextInput, Animated, Pressable, Keyboard, ImageBackground } from 'react-native';
import { buttonPressIn, buttonPressOut } from '../../source/styles/allAnimations';
import { buttons } from '../../source/styles/assets';
import { styles } from '../../source/styles/flashcard-create-styles';
import { WordleText } from '../Skip-Game-Modal';
import { checkTheName } from './FlashCard-Data-Files';

const App =()=>{
    const [nameOfFlashCardPacket, setNameOfFlashCardPacket]=useState("");
    const scale=new Animated.Value(1);
    const [flashCardNamePortionVisible, setFlashCardNamePortionVisible]=useState(true);
    const [isCheckingName, setIsCheckingName]=useState(false);

    const create = async () => {
   
  if (isCheckingName) return;
  setIsCheckingName(true);

  console.log(4);
  if (nameOfFlashCardPacket.length === 0) {
    //setErrorStatement("Name of The Flash Card Packet cannot be Empty");
    //setTimeout(() => setErrorStatement(""), 1000);
    setIsCheckingName(false);
    return;
  }
  console.log(nameOfFlashCardPacket);
  const checkedResult = await checkTheName(nameOfFlashCardPacket);
  console.log(checkedResult);
  if (checkedResult) {
    //setErrorStatement("A Flash Card Packet with that name already exists");
    //setTimeout(() => setErrorStatement(""), 1000);
    setIsCheckingName(false);
    return;
  }
    /* */
  setFlashCardNamePortionVisible(false);
  //setFlashCardPortionVisible(true);
  console.log(5);
  setIsCheckingName(false);
};

    return (
    <View>
    {flashCardNamePortionVisible && (<View>  
        <TextInput
            style={styles.input}
            placeholder="Name of the Flash Card"
            value={nameOfFlashCardPacket}
            onChangeText={setNameOfFlashCardPacket}
        />
          <View style={{ alignSelf: 'center' }}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <Pressable
                onPressIn={() => buttonPressIn(scale)}
                onPressOut={() => buttonPressOut(scale)}
                onPress={() => {
                  //console.log(0);
                  create();
                }}
              >
                <ImageBackground
                  source={buttons.goldenButton}
                  style={{
                    width: 135,
                    aspectRatio: 3.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}
                  imageStyle={{
                    resizeMode: 'stretch',
                    borderRadius: 6,
                    borderWidth: 1,
                  }}
                >
                  <WordleText>Create</WordleText>
                </ImageBackground>
              </Pressable>
            </Animated.View>
          </View>
        </View>)}
    </View>
)
}

export default App;