import React from 'react';
import { View, /*Text,*/ StyleSheet, TextProps, ImageBackground, Animated, Dimensions, Image, } from 'react-native';
import { styles } from "../source/styles/header-styles"
import { icons } from '../source/styles/assets';
import Svg, {Text} from 'react-native-svg';
import { buttonPressIn,buttonPressOut } from '../source/styles/allAnimations';

export const Header=()=>{
    const headerForPlayer=()=>(
    <View style={styles.container}>
        <View style={styles.upperRow}>
            <View
            style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}
            >
            <View
            style={{
                width: 140,
                height: 26,
                borderWidth: 1.2,
                borderRadius: 6,
                alignItems: 'center'
            }}
            >
            <View
            style={{
                width: 132,
                height: 11,
                marginTop: 2,
                backgroundColor: '#ffffff99',
                borderRadius: 4,
            }}
            >
            </View>
            </View>
            <ImageBackground
            source={icons.xp}
            style={styles.xpImage}
            imageStyle={styles.xpImageStyle}>
        <Svg height="30" width="30">
        <Text
          x="15"
          y="15"
          textAnchor="middle"
          dy="3"
          fill="white"
          stroke="#3a3a3a"
          strokeWidth="0.8"
          fontSize="16"
          fontFamily="Wordlet-Regular"
        >12
        </Text>
        </Svg>
            </ImageBackground>
            
            </View>
        </View>
        <View style={styles.lowerRow}>



        </View>
    </View>

    )

    return headerForPlayer();
}