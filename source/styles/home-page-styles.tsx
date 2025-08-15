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
        fontSize: 14,
        color: '#e6e6e6',
        alignSelf: 'center',
        marginVertical: 5,
        letterSpacing: -0.8,
        width: 35,
    },
    
    rewardBar: {
        position: 'absolute',
        height: 18,
        top: 0,
        left: 0,
        backgroundColor: '#34664b',
        borderRadius: 3,
    },

    rewardBarHighlight:{
        position: 'absolute',
        height: 10,
        top: 0,
        left: 0,
        backgroundColor: '#ffffff50',
        borderRadius: 3,
        zIndex: 2,
        width: 1150
    },
    
    rewardBarCover: {
        width: 1150,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        overflow: 'hidden',
        marginLeft: 18
    },

    pointTag: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 1
    },
    
    normalRewardContainer: {
        backgroundColor: '#d0d0d0',
        paddingVertical: 10,
        gap: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#444444',
        width: 50,
        alignItems: 'center'
        
    },

    premiumRewardContainer: {
        backgroundColor: '#face3e',
        paddingVertical: 10,
        gap: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#854403',
        width: 50,
        alignItems: 'center'
    
    },

    dailyRewardPointContainer: {
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },

    modalCloseBtn: {
        resizeMode: 'stretch',
        borderRadius: 4,
        borderWidth: 1,
        transform:[{scaleY: 0.95}],
        width: 27,
        height: 27
    },

    /*taskDone:{
        width: 50,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        overflow: 'hidden',
        marginLeft: 18
    },*/

    taskRewardBarHighlight:{
        position: 'absolute',
        height: 8,
        top: 0,
        left: 0,
        backgroundColor: '#ffffff50',
        borderRadius: 3,
        zIndex: 2,
        width: 50
    },
    
    taskRewardBarCover: {
        width: 50,
        height: 15,
        backgroundColor: '#ccc',
        borderRadius: 3,
        borderWidth: 1,
        overflow: 'hidden',
    },

    taskRewardBar: {
        position: 'absolute',
        height: 13,
        top: 0,
        left: 0,
        backgroundColor: '#34664b',
        borderRadius: 3,
    },

    bottomButtonsText: {
        textAlign: 'center'
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
