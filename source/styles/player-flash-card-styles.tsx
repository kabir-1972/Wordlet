import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({      
  background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },

  disabledBtn:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
        width: 250
    },

    errorText:{
        color: '#3f4845',
        fontSize: 20,
        lineHeight: 24,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },

    icons:{
        width: 18,
        height: 18
    },

    date:{
        fontSize: 12,
        backgroundColor: '#fcd7d9',
        padding: 2,
        borderRadius: 4
    }


});