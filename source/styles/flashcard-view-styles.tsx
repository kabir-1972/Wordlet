import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
  },
      
  background:{
        flex: 1,
        margin: 0, 
        position: 'relative'
    },

  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },

  front: {
    backgroundColor: '#c1f6f7',
  },

  back: {
    backgroundColor: '#fccfd9',
  },

  text: {
    fontSize: 20,
    fontFamily: 'Wordlet-Regular',
  },

  disabledBtn:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 6
    },

    button: {
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },

    rowOfButtonsInCard: {
        flexDirection: 'row',
        gap: 5,
        marginHorizontal: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },

    backFaceAnsEntry: {
        borderStyle: 'dashed',
        borderWidth: 1.5,
        textAlign: 'center',
        borderRadius: 4,
        borderColor: '#999999',
        paddingHorizontal: 4,
        lineHeight: 22
    },

    backFaceTitle: {
        padding: 3,
        borderRadius: 4,
        marginVertical: 5
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

});