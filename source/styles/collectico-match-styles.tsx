


import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },
    
    disabledButton:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
    },

    titularWordsBox:{
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderColor: '#038c6c',
        width: 200
    },

    titleWords:{
        backgroundColor: '#dcfcf5',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        marginVertical: 4
    },

    allWordsBox:{
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderColor: '#ffffff80',
        width: '80%',
        borderWidth: 1.2,
        borderStyle: 'dashed',
        borderRadius: 4,

    },

    styleWords:{
        backgroundColor: '#c4ffc7',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        marginVertical: 4
    },

    choiceSecondColumn:{
        backgroundColor: '#ffe9c4',
        paddingHorizontal: 10,
        borderRadius: 4,
        paddingVertical: 4,
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        width: 150
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
        left: '50%'
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