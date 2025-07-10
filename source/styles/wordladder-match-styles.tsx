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
        height: 50,
        flexDirection: 'row',
        gap: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        paddingHorizontal: 10
    },

    roughStringLetter:{
        fontSize: 23,
        height: 40,
        width: 40,
        borderWidth: 1,
        padding: 8,
        borderRadius: 3,
        textAlign: 'center',
        justifyContent: 'center'

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

  listOfWords:{
    flexDirection: 'row',
    gap: 3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },

  lettersInListOfWords: {
    fontSize: 18,
    backgroundColor: 'white',
    padding: 5,
    width: 30,
    
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 3
  },

  listOfWordsContainer:{
    height: 20,
  },

  theRoughString:{
    flexDirection: 'row',
    gap: 3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 40
  },

  priceContainer:{
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#61b1ba',
        borderRadius: 4,
        borderWidth: 1
  },

  disabledButton:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },
    errorText:{
      color: 'white',
      fontSize: 15,
      lineHeight: 23,
      textAlign: 'center',
      paddingVertical: 5,
      paddingHorizontal: 8
    },
})

