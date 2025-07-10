//A short file to handle the button animation for the app
// This file contains the animation functions for the button press in and press out events.
import { Animated, StyleSheet, TextStyle } from 'react-native';
import { useState, useEffect, useRef } from 'react';

export const buttonPressIn = (scale: Animated.Value) => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  export const buttonPressOut = (scale: Animated.Value) => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

type FadeCountUpProps = {
  targetNumber: number;
  style?: TextStyle;
  allowAnimation: boolean
  onComplete?: (finalValue: number) => void;
  maxXp?: number
};

export default function CountUp({ targetNumber, 
  style, allowAnimation, onComplete, maxXp}: FadeCountUpProps) {

useEffect(() => {
  if (!allowAnimation && maxXp) {
    const _xpPercent = parseFloat((targetNumber / maxXp).toFixed(2));
    onComplete?.(_xpPercent);
  }
}, [allowAnimation, targetNumber, maxXp]);
  
if (!allowAnimation) {
  return (
    <Animated.Text style={[style, {}]}>
      {targetNumber}
    </Animated.Text>
  );
}

  const [currentNumber, setCurrentNumber] = useState(targetNumber);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animationDuration = 0;

  useEffect(() => {
    if (targetNumber > currentNumber) {
      let next = currentNumber + 1;

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentNumber(next);
      });
    } else if (targetNumber < currentNumber) {
      let next = currentNumber - 1;

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentNumber(next);
      });
    }  
    if(maxXp){
    const _xpPercent = parseFloat((currentNumber/maxXp).toFixed(2)) * 100;
    onComplete?.(_xpPercent);
  }
  }, [targetNumber, currentNumber]);

  return (
    <Animated.Text style={[style, {}]}>
      {currentNumber}
    </Animated.Text>
  );
}


