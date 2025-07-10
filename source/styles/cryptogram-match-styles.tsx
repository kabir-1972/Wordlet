


import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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

    keyBtnRows:{
        flexDirection: 'row',
        gap: 40,
        marginTop: 10
    },
    
    keyBtn:{
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },

    theSentenceContainer:{
        flexDirection: 'row',
        gap: 3,
        marginVertical: 15,
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },

    gameSentenceCharacters:{
        width: 35,
        height: 35,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2
    },

    hintsKey:{
        width: 35,
        height: 35,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
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

    priceContainer:{
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cd6b82',
        borderRadius: 4,
        borderWidth: 1
  },

  disabledButton:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },

})