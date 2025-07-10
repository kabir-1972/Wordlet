import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    upperRow:{
        padding: 0
    },

    lowerRow:{
        padding: 0
    },

    xpImage:{
        width: 36,
        //height: 36,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        marginLeft: -130
    },

    xpImageStyle:{
        resizeMode: 'stretch',
    },

    headerText:{
        fontFamily: 'Wordlet-Regular',
        color: 'white'
    },

    shadowedText:{
        fontFamily: 'Wordlet-Regular',
        textShadowColor: 'black',
        textShadowRadius: 10,
        textShadowOffset:{
            width: 1,
            height: 1
        }        
    }

})