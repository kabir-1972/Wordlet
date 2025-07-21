import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

export default function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const flipCard = () => {
    setFlipped((prev) => !prev);
    rotation.value = withTiming(flipped ? 0 : 180, { duration: 600 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
    };
  });

  return (
    <Pressable onPress={flipCard}>
      <View style={styles.container}>
        <Animated.View style={[styles.card, styles.front, frontAnimatedStyle]}>
          <Text style={styles.text}>Front</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.back, backAnimatedStyle]}>
          <Text style={styles.text}>Back</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 300,
    alignSelf: 'center',
    marginTop: 100,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  front: {
    backgroundColor: '#4A90E2',
  },
  back: {
    backgroundColor: '#D0021B',
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});
