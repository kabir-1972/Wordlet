import React, {useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, ImageBackground, Animated, Dimensions, Image, UIManager, findNodeHandle, InteractionManager } from 'react-native';
import {styles} from "../source/styles/wordle-match-styles"
import { buttons } from '../source/styles/assets';
import { buttonPressIn,buttonPressOut } from '../source/styles/allAnimations';
const ALPHABETS = 'QWERTYUIOPASDFGHJKLZXCVBNM0'.split('');

const screenWidth = Dimensions.get('window').width;
const numKeysPerRow = 10;
const paddingHorizontalMax = 12;

//there can be 30 keys at max in a screen of 360 pixels
//so the minimum keywidth is 12
//start with keywidth set to 12 and set the padding to max
//then keep reducing padding until 10 keys fill the screen
let keyWidth = 12;
let padding = paddingHorizontalMax;

// Reduce padding/keyWidth until everything fits

while ((keyWidth + padding * 2) * numKeysPerRow > screenWidth) {
  if (padding > 2) 
    padding -= 1;
   else break; 
}

const dynamicPaddingHorizontal = padding;
const dynamicPaddingVertical = padding;
const dynamicFontSize =20;

type keySetProps={
  onKeyPress: (key: string) => void;
  correctlyPlacedLetters: string[];
  misPlacedLetters: string[];
  notToBePlacedLetters: string[];
}

type crossWordkeySetProps={
  onKeyPress: (key: string, selectedGrids: number[]) => void;
  selectedGrids: number[]
}


type wordLadderKeySetProps={
  onKeyPress: (key: string) => void;
}

type shiftedKeySetProps={
  onKeyPress: (key: string) => void;
  correctlyPlacedLetters: string[];
  notToBePlacedLetters: string[];
  prePlacedLetters: string[];
  postPlacedLetters: string[];
}

export interface KeyMeasurements {
  width: number,
  height: number,
  positionX: number,
  positionY: number
};

export const firstRowKeyMeasurements: KeyMeasurements = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
};

export const secondRowKeyMeasurements: KeyMeasurements = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
};

export const thirdRowKeyMeasurements: KeyMeasurements = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
};

export const AlphabetKeyboard:React.FC<keySetProps>=({
  onKeyPress, correctlyPlacedLetters, misPlacedLetters, notToBePlacedLetters
  })=> {
  
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const allLetters = [...row1, ...row2, ...row3];
  const scaleRefs = useRef<Record<string, Animated.Value>>({});
  allLetters.forEach(letter => {
  if (!scaleRefs.current[letter]) {
    scaleRefs.current[letter] = new Animated.Value(1);
  }
});

  const firstRowRef=useRef(null);
  const secondRowRef=useRef(null);
  const thirdRowRef=useRef(null);

useEffect(() => {
  if (firstRowRef.current) {
    const nodeHandle = findNodeHandle(firstRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          firstRowKeyMeasurements.width=width;
          firstRowKeyMeasurements.height=height;
          firstRowKeyMeasurements.positionX=pageX;
          firstRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }

  if (secondRowRef.current) {
    const nodeHandle = findNodeHandle(secondRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          secondRowKeyMeasurements.width=width;
          secondRowKeyMeasurements.height=height;
          secondRowKeyMeasurements.positionX=pageX;
          secondRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }

  if (thirdRowRef.current) {
    const nodeHandle = findNodeHandle(thirdRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          thirdRowKeyMeasurements.width=width;
          thirdRowKeyMeasurements.height=height;
          thirdRowKeyMeasurements.positionX=pageX;
          thirdRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }


}, []);

  const renderRow = (letters: string[]) => (
    <View style={styles.keyboardRow}>{
      letters.map(letter => {
        const scale = scaleRefs.current[letter];
        let theRenderedKey;
        if(letter!='0')
        theRenderedKey=(
          <ImageBackground
          source={
            correctlyPlacedLetters.includes(letter.toLowerCase())
            ?buttons.greenKey:
            misPlacedLetters.includes(letter.toLowerCase())
            ?buttons.yellowKey:
            notToBePlacedLetters.includes(letter.toLowerCase())
            ?buttons.blackKey:
            buttons.whiteKey
          }
          imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 1,}}
        >
        <Pressable
        onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)} style={[styles.key,
        {paddingHorizontal: dynamicPaddingHorizontal, paddingVertical: dynamicPaddingVertical}
        ]}>
        <Text style={[styles.keyText,{fontSize: dynamicFontSize},
          notToBePlacedLetters.includes(letter.toLowerCase()) && {color: "white"}
        ]}>{letter}</Text>
        </Pressable>
        </ImageBackground>)

        else theRenderedKey=(
        <Pressable onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)}>
        <Image source={buttons.backButton}
          style={{
            height: 30+dynamicPaddingVertical,
            resizeMode: 'stretch',
            aspectRatio: 1.288,

            borderWidth: 1,
            borderRadius: 4
            
          }}
          ></Image>
          </Pressable>)
        return(
        <Animated.View key={letter}
        ref={letter === 'Q' ? firstRowRef : letter ==='A'? secondRowRef: letter ==='Z'? thirdRowRef: undefined}
        style={{transform: [{ scale }] }}>
        {theRenderedKey}
        </Animated.View>)
        })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};

export const ShiftedAlphabetKeyboard:React.FC<shiftedKeySetProps>=({
  onKeyPress, correctlyPlacedLetters, notToBePlacedLetters, prePlacedLetters, postPlacedLetters
  })=> {
  
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const allLetters = [...row1, ...row2, ...row3];
  const scaleRefs = useRef<Record<string, Animated.Value>>({});
  allLetters.forEach(letter => {
  if (!scaleRefs.current[letter]) {
    scaleRefs.current[letter] = new Animated.Value(1);
  }
});

  const firstRowRef=useRef(null);
  const secondRowRef=useRef(null);
  const thirdRowRef=useRef(null);

useEffect(() => {
  if (firstRowRef.current) {
    const nodeHandle = findNodeHandle(firstRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          firstRowKeyMeasurements.width=width;
          firstRowKeyMeasurements.height=height;
          firstRowKeyMeasurements.positionX=pageX;
          firstRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }

  if (secondRowRef.current) {
    const nodeHandle = findNodeHandle(secondRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          secondRowKeyMeasurements.width=width;
          secondRowKeyMeasurements.height=height;
          secondRowKeyMeasurements.positionX=pageX;
          secondRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }

  if (thirdRowRef.current) {
    const nodeHandle = findNodeHandle(thirdRowRef.current);
    if (nodeHandle != null) {
      InteractionManager.runAfterInteractions(() => {
        UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
          thirdRowKeyMeasurements.width=width;
          thirdRowKeyMeasurements.height=height;
          thirdRowKeyMeasurements.positionX=pageX;
          thirdRowKeyMeasurements.positionY=pageY;
        });
      });
    }
  }


}, []);

const renderRow = (letters: string[]) => (
    <View style={styles.keyboardRow}>{
      letters.map(letter => {
        const scale = scaleRefs.current[letter];
        let theRenderedKey;
        if(letter!='0')
        theRenderedKey=(
          <ImageBackground
          source={
            correctlyPlacedLetters.includes(letter.toLowerCase())
            ?buttons.greenKey:
            prePlacedLetters.includes(letter.toLowerCase())
            ?buttons.blueKey:
            postPlacedLetters.includes(letter.toLowerCase())
            ?buttons.redKey:
            notToBePlacedLetters.includes(letter.toLowerCase())
            ?buttons.blackKey:
            buttons.whiteKey
          }
          imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 1,}}
        >
        <Pressable
        onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)} style={[styles.key,
        {paddingHorizontal: dynamicPaddingHorizontal, paddingVertical: dynamicPaddingVertical}
        ]}>
        <Text style={[styles.keyText,{fontSize: dynamicFontSize},
          notToBePlacedLetters.includes(letter.toLowerCase()) && {color: "white"}
        ]}>{letter}</Text>
        </Pressable>
        </ImageBackground>)

        else theRenderedKey=(
        <Pressable onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)}>
        <Image source={buttons.backButton}
          style={{
            height: 30+dynamicPaddingVertical,
            resizeMode: 'stretch',
            aspectRatio: 1.288,

            borderWidth: 1,
            borderRadius: 4
            
          }}
          ></Image>
          </Pressable>)
        return(
        <Animated.View key={letter}
        ref={letter === 'Q' ? firstRowRef : letter ==='A'? secondRowRef: letter ==='Z'? thirdRowRef: undefined}
        style={{transform: [{ scale }] }}>
        {theRenderedKey}
        </Animated.View>)
        })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};


export const CrosswordKeyboard:React.FC<crossWordkeySetProps>=({onKeyPress, selectedGrids})=> {
  
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const allLetters = [...row1, ...row2, ...row3];
  const scaleRefs = useRef<Record<string, Animated.Value>>({});
  allLetters.forEach(letter => {
  if (!scaleRefs.current[letter]) {
    scaleRefs.current[letter] = new Animated.Value(1);
  }
});

  const renderRow = (letters: string[]) => (
    <View style={styles.keyboardRow}>{
      letters.map(letter => {
        const scale = scaleRefs.current[letter];
        let theRenderedKey;
        if(letter!='0')
        theRenderedKey=(
          <ImageBackground
          source={buttons.whiteKey}
          imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 1,}}
        >
        <Pressable
        onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter, selectedGrids)} style={[styles.key,
        {paddingHorizontal: dynamicPaddingHorizontal, paddingVertical: dynamicPaddingVertical}
        ]}>
        <Text style={[styles.keyText,{fontSize: dynamicFontSize},
        ]}>{letter}</Text>
        </Pressable>
        </ImageBackground>)

        else theRenderedKey=(
        <Pressable onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter, selectedGrids)}>
        <Image source={buttons.backButton}
          style={{
            height: 30+dynamicPaddingVertical,
            resizeMode: 'stretch',
            aspectRatio: 1.288,
            borderWidth: 1,
            borderRadius: 4
          }}
          ></Image>
          </Pressable>)
        return(
        <Animated.View key={letter}
        style={{transform: [{ scale }] }}>
        {theRenderedKey}
        </Animated.View>)
        })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};

export const WordLadderKeyBoard:React.FC<wordLadderKeySetProps>=({onKeyPress})=> {
  
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const allLetters = [...row1, ...row2, ...row3];
  const scaleRefs = useRef<Record<string, Animated.Value>>({});
  allLetters.forEach(letter => {
  if (!scaleRefs.current[letter]) {
    scaleRefs.current[letter] = new Animated.Value(1);
  }
});

  const renderRow = (letters: string[]) => (
    <View style={styles.keyboardRow}>{
      letters.map(letter => {
        const scale = scaleRefs.current[letter];
        let theRenderedKey;
        if(letter!='0')
        theRenderedKey=(
          <ImageBackground
          source={buttons.whiteKey}
          imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 1,}}
        >
        <Pressable
        onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)} style={[styles.key,
        {paddingHorizontal: dynamicPaddingHorizontal, paddingVertical: dynamicPaddingVertical}
        ]}>
        <Text style={[styles.keyText,{fontSize: dynamicFontSize},
        ]}>{letter}</Text>
        </Pressable>
        </ImageBackground>)

        else theRenderedKey=(
        <Pressable onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)}>
        <Image source={buttons.backButton}
          style={{
            height: 30+dynamicPaddingVertical,
            resizeMode: 'stretch',
            aspectRatio: 1.288,
            borderWidth: 1,
            borderRadius: 4
          }}
          ></Image>
          </Pressable>)
        return(
        <Animated.View key={letter}
        style={{transform: [{ scale }] }}>
        {theRenderedKey}
        </Animated.View>)
        })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};

export const WicWacWoeKeyboard:React.FC<wordLadderKeySetProps>=({onKeyPress})=> {
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const allLetters = [...row1, ...row2, ...row3];
  const scaleRefs = useRef<Record<string, Animated.Value>>({});
  const scaleAllowed=useRef<Record<string, boolean>>({});
  allLetters.forEach(letter => {
  if (!scaleRefs.current[letter]) {
    scaleRefs.current[letter] = new Animated.Value(1);
  }
  scaleAllowed.current[letter]=true;
});

  const renderRow = (letters: string[]) => (
    <View style={styles.keyboardRow}>{
      letters.map(letter => {
        const scale = scaleRefs.current[letter];
        const _scaleAllowed=scaleAllowed.current[letter];
        let theRenderedKey;
        if(letter!='0')
        theRenderedKey=(
          <ImageBackground
          source={buttons.whiteKey}
          imageStyle={{resizeMode: 'stretch', borderRadius: 6, borderWidth: 1,}}
        >
        <Pressable
        onPressIn={()=>{
          scale.stopAnimation();
          /*
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }).start();*/

          buttonPressIn(scale);
          setTimeout(()=>{
          scale.stopAnimation();
          /*
          Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();*/
          buttonPressOut(scale);
           
          }, 200)}
        }
        //onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)}
        style={[styles.key,
        {paddingHorizontal: dynamicPaddingHorizontal, paddingVertical: dynamicPaddingVertical}
        ]}>
        <Text style={[styles.keyText,{fontSize: dynamicFontSize},
        ]}>{letter}</Text>
        </Pressable>
        </ImageBackground>)

        else theRenderedKey=(
        <Pressable onPressIn={()=>{buttonPressIn(scale);}}
        onPressOut={() => {buttonPressOut(scale);}}
        onPress={() => onKeyPress(letter)}>
        <Image source={buttons.backButton}
          style={{
            height: 30+dynamicPaddingVertical,
            resizeMode: 'stretch',
            aspectRatio: 1.288,
            borderWidth: 1,
            borderRadius: 4
          }}
          ></Image>
          </Pressable>)
        return(
        <Animated.View key={letter}
        style={{transform: [{ scale }] }}>
        {theRenderedKey}
        </Animated.View>)
        })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};
