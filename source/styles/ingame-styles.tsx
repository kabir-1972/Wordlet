import {Animated} from 'react-native'
export const startShake = (shakeAnim: Animated.Value) => {
  Animated.sequence([
    Animated.timing(shakeAnim, { toValue: -10, duration: 30, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 10, duration: 30, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 30, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 10, duration: 30, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
  ]).start();
};
