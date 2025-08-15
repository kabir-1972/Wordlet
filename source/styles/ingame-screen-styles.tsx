// Every kind of style that is used in the search screen should be defined here
// and imported into the search screen component. This is to ensure that the code is clean and easy to read.
import { useRef } from "react";
import { StyleSheet, View, Text, Animated, Pressable, ImageBackground, ImageSourcePropType, Image, StyleProp, ImageStyle} from 'react-native';
import { buttonPressIn, buttonPressOut } from "./allAnimations";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },

    background:{
        flex: 1,
        margin: 0
    },

    text: {
      fontSize: 18,
      lineHeight: 20,
      fontFamily: 'Wordlet-Regular'
    },

    headingText: {
        fontSize: 24,
        fontFamily: 'Wordlet-Regular',
    },

    button: {
        width: '95%',
        alignSelf: 'center',
    
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        overflow: 'hidden'
    },

    bgImage:{
        resizeMode: 'stretch',
        width: '100%',
    },

    buttonContent:{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection : 'row',
        padding: 15,
        paddingBottom: 20,
        gap: 10
    },

    buttonTextHeading:{
        flexDirection: "row",
        gap: 5
    },

    buttonImage: {
        width: '100%',
        aspectRatio: 1,
        flex: 1
    },

    buttonTextContent:{
        gap: 20,
        flex: 4
    },

})

type WordleScreenProps = {
    preHeadingColor: string,
    postHeadingColor: string,
    descriptionTextColor: string,
    preHeading: string,
    heading: string,
    description: string,
    image: ImageSourcePropType,
    bgImage: ImageSourcePropType,
    onPress: () => void;
    style?: StyleProp<ImageStyle>;
}

export const WordleScreenButtons = (props: WordleScreenProps)=>{
    const scale = useRef(new Animated.Value(1)).current;
    return(
        <View>
        <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
            onPressIn = {()=>{
                buttonPressIn(scale);
            }}
            onPressOut = {() => {
                buttonPressOut(scale);
            }}
            onPress = {props.onPress}
        >
        <ImageBackground
            source={props.bgImage}
            style={[styles.button, props.style]}
            imageStyle={styles.bgImage}
        >
            <View style={styles.buttonContent}>
                <View style={styles.buttonTextContent}>
                <View style={styles.buttonTextHeading}>
                    <Text style={[styles.headingText , {color: props.preHeadingColor}]} allowFontScaling={false}>{props.preHeading}</Text>
                    <Text style={[styles.headingText , {color: props.postHeadingColor}]} allowFontScaling={false}>{props.heading}</Text>
                </View>
                <Text style={[styles.text, {color: props.descriptionTextColor}]} allowFontScaling={false}>{props.description}</Text>
                </View>
                <Image source={props.image} style={styles.buttonImage}></Image>
            </View>
        </ImageBackground>
        </Pressable>
        </Animated.View>
        </View>
    )
}