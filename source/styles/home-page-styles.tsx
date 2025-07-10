//Everything in this file is related to the home page styles and components
// and should be imported into the home page component. This is to ensure that the code is clean and easy to read.
import { useRef } from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { Pressable, Animated, ImageBackground, StyleProp, ViewStyle} from "react-native"
import { buttonPressIn, buttonPressOut } from "./allAnimations";

export const styles = StyleSheet.create({
    container:{},
    text:{
        fontSize: 30,
        color: '#ffffff',
        fontFamily: 'Wordlet-Regular'
    },
    image: {
        width: '100%',
        borderRadius: 10,
    },
    button: {
        width: 150,
        aspectRatio: 1.95,
        justifyContent: 'center',
        alignItems: 'center',
    },

    SingleButton: {
        width: 200,
        aspectRatio: 2.71,
        justifyContent: 'center',
        alignItems: 'center',
    },

    background:{
        width: '100%',
        flex: 1,
        margin: 0
    },

    bgImage:{
        resizeMode: 'stretch',
        width: '100%',
    },

    twoButtons : {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        alignSelf: 'center',
        gap: 5
    },

    oneButton:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },

    btnContent:{
        padding: 10,
        paddingBottom: 25
    }
});

type theThreeButtonsStringsProps = {
    name: string;
    image: ImageSourcePropType;
    onPress: () => void;
    buttonStyle?: StyleProp<ViewStyle>;
} 


export const MainGameButton = (props:theThreeButtonsStringsProps)=>{
    const scale = useRef(new Animated.Value(1)).current;
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
            onPressIn={()=>{buttonPressIn(scale);}}
            onPressOut={() => {buttonPressOut(scale);}}
            onPress={props.onPress} 
             >
            <ImageBackground
            source={props.image}
            style={props.buttonStyle}
            imageStyle={styles.bgImage} 
            >
            </ImageBackground>
            </Pressable>
        </Animated.View>
    );
}
