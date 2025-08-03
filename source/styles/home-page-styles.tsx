//Everything in this file is related to the home page styles and components
// and should be imported into the home page component. This is to ensure that the code is clean and easy to read.
import { useRef } from "react";
import { ImageSourcePropType, StyleSheet, Text} from "react-native";
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
        width: 120,
        aspectRatio: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    SingleButton: {
        width: 140,
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
        borderRadius: 6,
        borderWidth: 1
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
    },

    messageAndTrophyContainer:{
        marginHorizontal: 18,
        flexDirection: 'row',
        justifyContent:'space-between',
        marginVertical: 2
        
    },

    trophy:{
        backgroundColor: '#535d63',
        width: 60,
        paddingVertical: 3,
        paddingTop: 5,
        borderRadius: 4,
        borderWidth: 0.8,
    },

    message:{

    },

    gameBtnText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 20
    },

    modalButton:{
      aspectRatio: 2.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 6,
      elevation: 5
    },

    backgroundImage:{
    width: '100%',

    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    paddingVertical: 20,
    paddingBottom: 50,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 18,

    },

    modalContent: {
        marginVertical: 10,
        marginHorizontal: 6,
    },
    
    modalBackground: {
        width: '100%',
    },

        warningTextContainer:{
        paddingVertical: 5,
        backgroundColor: '#e1fbfb',
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 10
    },

    warningText:{
        fontSize: 16,
        marginHorizontal: 5,
        lineHeight: 20,
        textAlign: 'center',
        color: '#034a49'
    },

     btnRow:{
      flexDirection: 'row',
      gap: 20,
      flex: 1,
      marginHorizontal: 20,
      marginTop: 20
    },

    modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  wotdContainer:{
    paddingVertical: 2,
    
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 2,
    alignSelf: 'center'
},
 
   messageModalTabs:{
    flex: 1,
    backgroundColor: '#555555',
    borderRadius: 3
    },

    messageModalTabsText: {
        textAlign: 'center',
        color: '#eeeeee',
        paddingVertical: 6
    },

    messages:{
        marginTop: 5,
        borderRadius: 4,
        minHeight: 200,
        borderStyle: 'dashed',
        borderBottomWidth: 1
    },

    messageModalTabSelector: {
        height: 3,
        width: '30%',
        marginLeft: 5,
        backgroundColor: '#555555',
        borderRadius: 3
    },

    theMessage:{
        borderRadius: 4,
        borderWidth: 1,
        padding: 3,
        marginVertical: 2,
        backgroundColor: '#fffaeb'
    },

    dailyRewardPointText: {
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#83bacc',
        paddingHorizontal: 10,
        paddingVertical: 2,
        alignSelf: 'center',
        borderRadius: 4,
        marginVertical: 5,
        letterSpacing: -0.8
    },
    
    rewardBar: {
        position: 'absolute',
        height: 15,
        top: 0,
        left: 0,
        backgroundColor: '#557865',
        borderRadius: 4
    },

    dayTag: {
        backgroundColor: '#fc6aac',
        transform: [{ rotate: '45deg' }],
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    
    normalRewardContainer: {
        backgroundColor: '#a0dee8',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 3,
        borderRadius: 3
    },

    premiumRewardContainer: {
        backgroundColor: '#fcda6a',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 3,
        borderRadius: 3
    },

    dailyRewardPointContainer: {
        alignItems: 'center',
        gap: 4,
        borderRightWidth: 1.3,
        borderLeftWidth: 1.3,
        borderColor: '#777777',
        padding: 4,
        borderRadius: 1
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
                <Text style={styles.gameBtnText}>{props.name}</Text>
            </ImageBackground>
            </Pressable>
        </Animated.View>
    );
}
