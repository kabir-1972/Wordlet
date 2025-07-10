import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },

    pressedKeysContainer:{
        height: 40,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },

    theButton:{
       width: 40,
       height: 40,
       backgroundColor: '#faf8eb',
       borderRadius: 3,
       alignItems: 'center',
       justifyContent: 'center'

    },

    theLetter:{
       fontSize: 25,
       color: '#012c33'
    },

    roughStringContainer:{
        height: 35,
        flexDirection: 'row',
        gap: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        paddingHorizontal: 10
    },

    roughStringLetter:{
        fontSize: 16,
        borderWidth: 1,
        padding: 8,
        borderRadius: 3

    },

    timer:{
        alignSelf: 'center',
        borderRadius: '30%',
        paddingVertical: 6,
        paddingHorizontal: 7,
        backgroundColor: '#ccfce3',
    },

    timerBar: {
        height: 8,
        backgroundColor: '#ccfce3',
        alignSelf: 'center',
        borderRadius: 3,
        marginVertical: 10
    },

    modalBackground: {
        width: '100%',
        borderRadius: 10,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        alignItems: 'center'
  } ,

    container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

    backgroundImage: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

    textInput:{
    borderColor: '#222222',
    borderWidth: 1,
    minWidth: 120,
    height: 36,
    borderRadius: 5,
    fontFamily: 'Wordlet-Regular',
    backgroundColor: '#e1e6e4',
    alignSelf: 'center',
    fontSize: 17, 
    paddingHorizontal: 10,
    },
 
    fakeInput: {
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        minHeight: 30,
        justifyContent: 'center',
        width: 180,
        backgroundColor: '#fcecbd'
    },

    text: {
        color: '#632501',
    },

    hiddenInput: {
        height: 0,
        width: 0,
        position: 'absolute',
        opacity: 0,
    },

    
    gameInputContainer:{
        marginHorizontal: 20,
        flexDirection: 'row',
        marginVertical: 10,
        gap: 5, 
        alignItems: 'center'
    },

    caret: {
        backgroundColor: "#000",
        marginLeft: 2,
        width: 1
    },
    fakeInputBox:{
        flexDirection: 'row',
    },

    wordsAsMessages:{
        paddingHorizontal: 6,
        paddingVertical: 4,
    },

    scrollView:{
        flex: 1,
        width: '80%',
        maxWidth: 250,
        borderRightWidth: 0.7,
        borderLeftWidth: 0.7,
        borderColor: '#ffffff',
        backgroundColor: '#00000020',
        alignSelf: 'center'
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
    },

    errorText:{
        fontFamily: 'Wordlet-Regular',
        color: '#3f4845',
        fontSize: 18,
        marginBottom: -2,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    

})