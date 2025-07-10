import { StyleSheet } from "react-native";

const xpBarheight=23;
export const endgameStyles = StyleSheet.create({
    xpBar:{
        flexDirection: 'row',
        alignItems: 'center'
    },

    xpBarContainer:{
        width: 100,
        height: xpBarheight,
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: -10,
        position: 'relative'
    },

    xpBarFill:{
        height: xpBarheight-2,
        backgroundColor: '#53c18e',
        borderRadius: 5,
    },
    
    xpBarFloat:{
        width: 98,
        backgroundColor: '#ffffff80',
        height: xpBarheight-10,
        borderRadius: 3,
        position: 'absolute',
    },

    matchResultContainer:{
        backgroundColor: '#00808080',
        alignSelf: 'center',
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 15
    },

    wordleRow:{
        marginTop: 30,
        marginBottom: 3,
        flexDirection: 'row',
        gap: 3,
        alignSelf: 'center',
    },

    wordleText:{
        fontFamily: 'Wordlet-Regular',
        fontSize: 30
    },

    wordleBox:{
        backgroundColor: '#ccc',
        borderColor: '#0c0c0c',
        width: 40,
        paddingVertical: 5,
        paddingHorizontal: 5,

        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center'
    },

    resultContainer:{
        marginTop: 30,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
        height: 55,
        alignItems: 'center',
        backgroundColor: '#fff4e0',
        borderRadius: 3,
        elevation: 5,
        alignSelf: 'center',
        overflow: 'hidden'
    },

    modalBackground: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)'
  },

  button:{
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 3
  },

  wordletBoxStyles:{
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#e6fcfc',
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 1,
    elevation: 5,
    marginTop: 5,
    marginBottom: 30,
}

})