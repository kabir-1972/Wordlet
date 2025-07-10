import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },

    background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },

    wordleContainer:{
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center'
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

    wordleText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 30
    },

    wordleRow:{
        marginVertical: 3,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
    },

    keyboard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        alignSelf: 'center'
    },
  
    keyboardRow: {
        flexDirection: 'row',
        marginVertical: 3,
        gap: 1,
    },
  
    key:{
        alignSelf:'center',
    },

    keyText: {
        fontSize: 20,
        fontFamily: 'Wordlet-Regular',
    },

    submitBtnImage:{
        resizeMode: 'stretch',
        borderRadius: 6,
        width: '100%'
    },

    submitBtnStyle: {
        width: 100,
        aspectRatio: 2.3,
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 1,
        borderRadius: 6
    },
    error:{
        backgroundColor: '#f8f5cc',
        marginVertical: 5,
        alignItems: 'center',
        alignSelf: 'center',
        
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
    },

    errorTextContainer:{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -75,
        marginTop: -80,
    },

    errorText:{
        fontFamily: 'Wordlet-Regular',
        color: '#3f4845',
        fontSize: 20,
        marginBottom: -2,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    disabledButton:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },

    disabledIconButton:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 6,
        zIndex: 3
    },

    wandRotate:{
        alignSelf: 'center', 
        alignItems: 'center',
        width: 40,
        height: 40,
        overflow: 'hidden',
    },

    wandRotateImage:{
        resizeMode: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
    },

    helpButtonRow:{
        flexDirection: 'row',
        gap: '5',
        marginHorizontal: 20,
        alignContent: 'center'
    },

    stars:{
        width: 40,
        height: 40,
    },

    starsThrowImage:{
        resizeMode: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
    },

    skipButton:{
        width: 70,
        aspectRatio: 2,
    },

    skipButtonImg:{
        resizeMode: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
    },

    wandPriceContainer:{
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cd6b82',
        borderRadius: 4,
        borderWidth: 1
    },

    starPriceContainer:{
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#61b1ba',
        borderRadius: 4,
        borderWidth: 1
    }


})