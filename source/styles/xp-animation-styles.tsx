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

type ExperiencePointAnimationProps={
  animationStart1: Coordinate;
  animationStart2: Coordinate;
  animationStart3: Coordinate;

  animationEnd1: Coordinate;
  animationEnd2: Coordinate;
  animationEnd3: Coordinate;
}

export type ExperiencePointAnimationRef={
  startAnimation:(maxScale:number, makeTransparent?:boolean)=>void
}

export const ExperiencePointAnimation = forwardRef<ExperiencePointAnimationRef, ExperiencePointAnimationProps>((props, ref) => {
  const experiencePointIcon=icons.xp;

  const experiencePoint1 = useRef(new Animated.ValueXY({ x: props.animationStart1.x, y: props.animationStart1.y })).current;
  const experiencePoint2 = useRef(new Animated.ValueXY({ x: props.animationStart2.x, y: props.animationStart2.y })).current;
  const experiencePoint3 = useRef(new Animated.ValueXY({ x: props.animationStart3.x, y: props.animationStart3.y })).current;

  const scale1= useRef(new Animated.Value(0)).current;
  const scale2= useRef(new Animated.Value(0)).current;
  const scale3= useRef(new Animated.Value(0)).current;

  const animate=(maxScale: number, makeTransparent:boolean=false)=>{
    maxScale=0.8;
   return Animated.sequence([
      Animated.parallel([
        Animated.timing(experiencePoint1, {
          toValue: { x: props.animationStart1.x-30, y: props.animationStart1.y+10 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(experiencePoint2, {
          toValue: { x: props.animationStart1.x+30, y: props.animationStart1.y+10 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(experiencePoint3, {
          toValue: { x: props.animationStart1.x, y: props.animationStart1.y },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale1,{
          toValue: maxScale,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale2,{
          toValue: maxScale,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale3,{
          toValue: maxScale,
          duration: 1000,
          useNativeDriver: true,
        }),  
      ]),

      Animated.delay(0),

      Animated.parallel([
        Animated.timing(experiencePoint1, {
          toValue: { x: props.animationEnd1.x, y: props.animationEnd1.y },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(experiencePoint2, {
          toValue: { x: props.animationEnd2.x, y: props.animationEnd2.y },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(experiencePoint3, {
          toValue: { x: props.animationEnd3.x, y: props.animationEnd3.y },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale1,{
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale2,{
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale3,{
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ])};

  useImperativeHandle(ref, ()=>({
    startAnimation(maxScale: number, makeTransparent?: boolean){
      makeTransparent = makeTransparent ?? false;
      animate(maxScale, makeTransparent).start(()=>{
        scale1.setValue(0);
        scale2.setValue(0);
        scale3.setValue(0);
        experiencePoint1.setValue({x: props.animationStart1.x, y: props.animationStart1.y});
        experiencePoint2.setValue({x: props.animationStart2.x, y: props.animationStart2.y});
        experiencePoint3.setValue({x: props.animationStart3.x, y: props.animationStart3.y});
      });
    }
  }));    
  return (
      <View style={[styles.experiencePointAnimationContainer,
      ]}>
        <Animated.Image
          source={experiencePointIcon}
          style={[
            styles.experiencePoint,
            {
              transform: [
                ...experiencePoint1.getTranslateTransform(),
                { scale: scale1 }
              ],
            },
          ]}
        />
        <Animated.Image
          source={experiencePointIcon}
          style={[
            styles.experiencePoint,
            {
              transform: [
                ...experiencePoint2.getTranslateTransform(),
                { scale: scale2 }
              ],
            },
          ]}
        />
        <Animated.Image
          source={experiencePointIcon}
          style={[
            styles.experiencePoint,
            {
              transform: [
                ...experiencePoint3.getTranslateTransform(),
                { scale: scale3 }
              ],
            },
          ]}
        />
      </View>
  );
});


const styles = StyleSheet.create({
  experiencePointAnimationContainer:{
  },
  experiencePoint: {
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
