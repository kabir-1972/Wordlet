import { StyleSheet} from 'react-native';

export const modalStyles = StyleSheet.create({
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

    aspectRatio: 2/3,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 18,
  },

  modalBackground: {
    width: '100%',
  },

  modalButtonStyle:{
    width: 100,
    aspectRatio: 2.4,
  },

  modalButtonImage:{
    resizeMode: 'cover',
    borderRadius: 5
  },

  modalButtons:{
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalButtonWrapper:{
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
  },

  modalContent: {
    marginVertical: 10,
    marginHorizontal: 6,
    //borderRadius: 6
  },

  modalText: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Wordlet-Regular',
    color: 'black'
  },

  modalHeading: {
    fontSize: 25,
    fontFamily: 'Wordlet-Regular',
    textAlign: 'center'
  },

  difficultyTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 5,
    padding: 10,
    paddingTop: 0,
  },

  tabs: {
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },

  tabText: {
    fontSize: 18,
    fontFamily: 'Wordlet-Regular',
    color: 'black',  
  },

  bgImage:{
    resizeMode: 'stretch',
    width: '100%'
  },

  difficultyTabContent: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      paddingBottom: 5,
      paddingTop: 5
  },

  chosenDifficulty: {
    transform: [{ scale: 0.9 }],
  },

  selectedOption:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },

  partsOfSpeechTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 3,
    padding: 10,
    paddingTop: 3,
    paddingBottom: 3
  },

  rewardsContainer:{
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'center',
  },

  rewards:{
    flexDirection:'row',
    gap: '5',
    alignItems: 'center',
    justifyContent: 'center'
  },

  wordleIcons:{
    width: 22,
    aspectRatio: 1,
    resizeMode: 'stretch'
  },

  iconText:{
    fontFamily: 'Wordlet-Regular',
    color:"5c89c4",
    marginTop: 2,
    fontSize: 16
  },

  modalSubContent:{
    backgroundColor: '#dad9d3',
    borderRadius: 4,
    padding: 5,
    borderWidth: 1,
    borderColor: '#353b3a',
    elevation: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalSubParagraph:{
    backgroundColor: '#dad9d3',
    borderRadius: 4,
    padding: 5,
    elevation: 5,

    marginVertical: 4,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalsubHeading:{
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'center'
  },

  horizontalBar:{
    height: 1,
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 5
  },

  colorRow:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginHorizontal: 15,
        gap: 20
  },

  colorRowWider:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        marginHorizontal: 15,
        gap: 20
  },

      stars:{
        width: 30,
        height: 30,
    },

    starsThrowImage:{
        resizeMode: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
    },

        wandRotate:{
        alignSelf: 'center', 
        alignItems: 'center',
        width: 30,
        height: 30,
        overflow: 'hidden',
    },

    wandRotateImage:{
        resizeMode: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
    },

    rightBox: {
      width: 40
    },

    header:{
      marginTop: 45,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },

    btnRow:{
      flexDirection: 'row',
      gap: 20,
      flex: 1,
      marginHorizontal: 20,
      marginTop: 20
    },

    button:{
      aspectRatio: 2.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 6,
      elevation: 5
    },

    wordleExampleKey:{
      width: 20,
      height: 20,
      borderRadius: 3,
      borderWidth: 1
    },

    wordleExampleKeyLarger:{
      width: 35,
      aspectRatio: 1,
      borderRadius: 4,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },

});
