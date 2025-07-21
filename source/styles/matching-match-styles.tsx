


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

    matchingCells:{
        textAlign: 'center',
        paddingVertical: 8,
        marginVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        minWidth: 120,
        fontSize: 18
    },
    
    matchedCells:{
        flexDirection: 'row',
        backgroundColor: '#0a0024',
        gap: 5,
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        marginVertical: 2,
        alignItems: 'center'
    },

    roundedRectangle:{
       width: 10,
       height: 10,
       borderRadius: 2
    }


})