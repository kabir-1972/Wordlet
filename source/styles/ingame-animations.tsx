import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

type LightSweepProps = {
  width?: number;
  startingPoint: number;
  height?: number | `${number}%` | 'auto';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  trigger: boolean;
  sweepHorizontal: number;
  onSweepEnd?: () => void;
};

export default function LightSweep({
  width = 10,
  height = '150%' as `${number}%`,
  duration = 1000,
  delay = 0,
  style,
  trigger,
  sweepHorizontal,
  onSweepEnd,
  startingPoint
}: LightSweepProps) {
  const anim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (trigger) {
      anim.setValue(-startingPoint);
      Animated.timing(anim, {
        toValue: sweepHorizontal,
        duration,
        delay,
        useNativeDriver: true,
      }).start(() => {
        onSweepEnd?.();
        requestAnimationFrame(() => {
        anim.setValue(-startingPoint);
      });
      });
    }
  }, [trigger]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sweep,
        {
          width,
          height,
          opacity: trigger ? 1 : 0,
          transform: [
            { rotate: '45deg' },
            { translateX: 0 },
            { translateY: 0 },
            { translateX: anim },
            { translateY: anim }
        ]},
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sweep: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: []
  },
});

export function HorizontalLightSweep({
  width = 10,
  height = '150%' as `${number}%`,
  duration = 1000,
  delay = 0,
  style,
  trigger,
  sweepHorizontal,
  onSweepEnd,
  startingPoint
}: LightSweepProps) {
  const anim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (trigger) {
      anim.setValue(-startingPoint);
      Animated.timing(anim, {
        toValue: sweepHorizontal,
        duration,
        delay,
        useNativeDriver: true,
      }).start(() => {
        onSweepEnd?.();
        requestAnimationFrame(() => {
        anim.setValue(-startingPoint);
      });
      });
    }
  }, [trigger]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sweep,
        {
          width,
          height,
          opacity: trigger ? 1 : 0,
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { translateX: anim },
            { rotate: '45deg' },
        ]},
        style,
      ]}
    />
  );
}
