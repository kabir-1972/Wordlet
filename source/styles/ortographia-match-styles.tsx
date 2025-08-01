


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

    titularWordBox:{
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 4,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderColor: '#038c6c',
        backgroundColor: '#fff4c7'
    },

    optionsText:{
        backgroundColor: '#dcfcf5',
        paddingHorizontal: 4,
        paddingVertical: 8,
        borderRadius: 4,
        marginVertical: 2
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

      modalBackground: {
        width: '100%',
        borderRadius: 10,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        alignItems: 'center'
    },


    pairOptionsText:{
        backgroundColor: '#d0f7e2',
        paddingHorizontal: 4,
        paddingVertical: 8,
        borderRadius: 4,
        marginVertical: 2,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center' 
    },

    theAnswer: {
        backgroundColor: '#fcbdc8',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        marginVertical: 10,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    }

})