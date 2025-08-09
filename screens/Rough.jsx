import React from 'react';
import { StyleSheet, View, Modal, ImageBackground } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { modalBackgrounds } from '../source/styles/assets';
//import  from 'react-native-gesture-handler';

export default function App() {
  // Position values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Create a pan gesture
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      // Optional: snap back to center
      translateX.value = 0;
      translateY.value = 0;
    });

  // Apply animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
        <Modal visible={true} onRequestClose={()=>{}} transparent={true}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                    <View style={styles.modalContainer}>
                      <ImageBackground
                        source={modalBackgrounds.whiteModalBackgroundImg}
                        style={styles.backgroundImage}
                        imageStyle={{ resizeMode: 'stretch', borderRadius: 4, borderWidth: 1 }}
                      >
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
            </ImageBackground>
            </View>
            </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'tomato',
    borderRadius: 8,
  },

      modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
    },

        backgroundImage:{
    width: '100%',

    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    paddingVertical: 20,
    paddingBottom: 50
    },
});
