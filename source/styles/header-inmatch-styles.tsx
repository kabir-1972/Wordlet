import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    upperRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    lowerRow:{
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    xpImage:{
        width: 32,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    xpImageStyle:{
        resizeMode: 'stretch',
    },

    headerText:{
        fontFamily: 'Wordlet-Regular',
        color: 'white'
    },

    wordleText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 18
    },

    modalContentText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 18,
        lineHeight: 22,
        marginVertical: 5

    },
    
    paragraphText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 18,
        color: 'white',
        marginVertical: 5,
        lineHeight: 25
    },

    shadowedText:{
        fontFamily: 'Wordlet-Regular',
        textShadowColor: 'black',
        textShadowRadius: 10,
        textShadowOffset:{
            width: 1,
            height: 1
        }        
    },

    button:{
        borderWidth: 1,
        borderRadius: 5,
    },

    buttonStyle:{
        resizeMode: 'stretch',
    },

    headerInfoBtnContent:{
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'

    },

    headerInfoBtnText:{
        color: '#000000',
        paddingVertical: 6,
        paddingLeft: 10,
        paddingRight: 5,
    },

    headerInfoBtn:{
        backgroundColor: '#6e2437',
        borderRadius: 5,
        alignItems: 'center'
    },

    infoText:{
        color: '#ffffff',
        fontSize: 20,
        paddingVertical: 3,
        paddingHorizontal: 9
    },

    inGameCoin:{
        flexDirection: 'row',
        alignItems: 'center',

    },

    coinImage:{
        width: 25,
        height: 25,
        marginLeft: -20
    },

    coinContainer:{
        width: 80,
        height: 22,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#ffaa24',
        alignItems: 'center',
        position: 'relative',
        alignContent: 'center',
    },

    coinContainerInline:{
        width: 75,
        height: 10,
        marginTop: 2,
        backgroundColor: '#ffffff99',
        borderRadius: 2,
        position: 'absolute'
    },

    coinText:{
        color: 'black',
        fontFamily: 'Wordlet-Regular',
        fontSize: 16,
        marginTop: 2
    },

    settingsImage:{
        width: 25,
        height: 25,
        aspectRatio: 1,
        resizeMode: 'stretch'
    },

    settingsButton:{
        borderWidth: 1,
        borderRadius: 3
    },

    scoreCardContainer:{
        flexDirection: 'row',
        gap: 5,
        paddingVertical: 2,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

     wordleBox:{
        backgroundColor: '#ccc',
        borderColor: '#0c0c0c',
        width: 45,
        paddingVertical: 7,
        paddingHorizontal: 9,

        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center'
    },

    wordleRow:{
        marginVertical: 3,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
    },

    wordleContainer:{
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center'
    },

    crosswordText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 27
    }
})