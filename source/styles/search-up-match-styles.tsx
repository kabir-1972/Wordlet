import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },

    wordleContainer:{
        ///width: '97%',
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 0.5,
        overflow: 'hidden'
    },

    wordleBox:{
        borderColor: '#0c0c0c',
        width: 40,
        height: 40,
        paddingVertical: 7,
        paddingHorizontal: 9,
        borderWidth: 0.5,
        alignItems: 'center'
    },

    wordleText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 20
    },

    wordleRow:{
        //marginVertical: 3,
        flexDirection: 'row',
        //gap: 3,
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
    },

    clueContainer:{
        alignSelf: 'center',
    },

    childClueContainer:{
       backgroundColor: '#c2fcf8',
       borderRadius: 3, 
       flexDirection: 'row',
       alignSelf: 'center',
       maxWidth: '75%',
       alignItems: 'center'
    },

    cluesText:{
        paddingHorizontal: 3,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'center'
    },

    clueWord:{
        textAlign: 'center',
        paddingVertical: 2,
        color: '#444444',
        fontSize: 16,

    }

})