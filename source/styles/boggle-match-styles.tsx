


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
        borderRadius: 6,
        transform: [{scaleY: 0.9}]
    },

    
    theCells:{
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 1
    },

    foundWordList: {
        backgroundColor: '#cafcec',
        alignSelf: 'center',
        width: 250,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 6,
        paddingVertical: 4,
        gap: 3,
        marginTop: 5
    },

    foundWords:{
        backgroundColor: '#00000050',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 4
    }
    
})