import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Animated,
  StyleSheet
} from 'react-native';

import { icons } from './assets';

type Coordinate = {
  x: number;
  y: number;
};

type StarAnimationProps={
  animationStart1: Coordinate;
  animationStart2: Coordinate;
  animationStart3: Coordinate;

  animationEnd1: Coordinate;
  animationEnd2: Coordinate;
  animationEnd3: Coordinate;
}

export type StarAnimationRef={
  startAnimation:(maxScale:number, makeTransparent?:boolean)=>void
}


export const StarAnimation = forwardRef<StarAnimationRef, StarAnimationProps>((props, ref) => {
  const starIcon=icons.grayStar;

  const star1 = useRef(new Animated.ValueXY({ x: props.animationStart1.x, y: props.animationStart1.y })).current;
  const star2 = useRef(new Animated.ValueXY({ x: props.animationStart2.x, y: props.animationStart2.y })).current;
  const star3 = useRef(new Animated.ValueXY({ x: props.animationStart3.x, y: props.animationStart3.y })).current;

  const rotation1 = useRef(new Animated.Value(0)).current;
  const rotation2 = useRef(new Animated.Value(0)).current;
  const rotation3 = useRef(new Animated.Value(0)).current;

  const scale1= useRef(new Animated.Value(0)).current;
  const scale2= useRef(new Animated.Value(0)).current;
  const scale3= useRef(new Animated.Value(0)).current;

  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;


  const animate=(maxScale: number, makeTransparent:boolean=false)=>{
   const midPoints1=[props.animationEnd1.x/2,props.animationEnd1.y/2];
   const midPoints2=[props.animationEnd2.x/2,props.animationEnd2.y/2];
   const midPoints3=[props.animationEnd3.x/2,props.animationEnd3.y/2];

   return Animated.sequence([
      Animated.parallel([
        Animated.timing(star1, {
          toValue: { x: midPoints1[0], y: midPoints1[1] },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(star2, {
          toValue: { x: midPoints2[0], y: midPoints2[1] },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(star3, {
          toValue: { x: midPoints3[0], y: midPoints3[1] },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation2, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation3, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale1,{
          toValue: maxScale,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale2,{
          toValue: maxScale,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale3,{
          toValue: maxScale,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1,{
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2,{
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3,{
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),        
      ]),

      Animated.delay(0),

      Animated.parallel([
        Animated.timing(star1, {
          toValue: { x: props.animationEnd1.x, y: props.animationEnd1.y },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(star2, {
          toValue: { x: props.animationEnd2.x, y: props.animationEnd2.y },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(star3, {
          toValue: { x: props.animationEnd3.x, y: props.animationEnd3.y },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation1, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation2, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation3, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale1,{
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale2,{
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale3,{
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1,{
          toValue: makeTransparent?0:1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2,{
          toValue: makeTransparent?0:1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity3,{
          toValue: makeTransparent?0:1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ])};

  useImperativeHandle(ref, ()=>({
    startAnimation(maxScale: number, makeTransparent?: boolean){
      makeTransparent = makeTransparent ?? false;
      animate(maxScale, makeTransparent).start(()=>{
        rotation1.setValue(0);
        rotation2.setValue(0);
        rotation3.setValue(0);
        scale1.setValue(0);
        scale2.setValue(0);
        scale3.setValue(0);
        opacity1.setValue(0);
        opacity2.setValue(0);
        opacity3.setValue(0);
        star1.setValue({x: props.animationStart1.x, y: props.animationStart1.y});
        star2.setValue({x: props.animationStart2.x, y: props.animationStart2.y});
        star3.setValue({x: props.animationStart3.x, y: props.animationStart3.y});
      });
    }
  }));  

  const rotate1 = rotation1.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });

  const rotate2 = rotation2.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });

  const rotate3 = rotation3.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });
  
  return (
      <View style={[styles.starAnimationContainer,
      ]}>
        <Animated.Image
          source={starIcon}
          style={[
            styles.star,
            {
              opacity: opacity1,
              transform: [
                ...star1.getTranslateTransform(),
                { rotate: rotate1 },
                { scale: scale1 }
              ],
            },
          ]}
        />
        <Animated.Image
          source={starIcon}
          style={[
            styles.star,
            {
              opacity: opacity2,
              transform: [
                ...star2.getTranslateTransform(),
                { rotate: rotate2 },
                { scale: scale2 }
              ],
            },
          ]}
        />
        <Animated.Image
          source={starIcon}
          style={[
            styles.star,
            {
              opacity: opacity3,
              transform: [
                ...star3.getTranslateTransform(),
                { rotate: rotate3 },
                { scale: scale3 }
              ],
            },
          ]}
        />
      </View>
  );
});


const styles = StyleSheet.create({
  starAnimationContainer:{
  },
  star: {
    width: 30,
    height: 30,
    position: 'absolute',
  },
  disabledBtn:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 5
  }
});
