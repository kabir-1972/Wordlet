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

    pressedKeysContainer:{
        height: 40,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },

    pressedKey:{
        backgroundColor: '#b4cfcb',
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    }

})