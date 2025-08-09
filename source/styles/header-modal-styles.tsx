import { StyleSheet } from "react-native"

//import { SLIDER_WIDTH, TRACK_HEIGHT, THUMB_SIZE } from "../../screens/Settings2"

//const TRACK_HEIGHT=14;
//const THUMB_SIZE = 15;

export const SLIDER_WIDTH = 360 * 0.5;
export const THUMB_SIZE = 22;
export const TRACK_HEIGHT=18;

export const styles=StyleSheet.create({
    modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
    },
    
    backgroundImage:{
    width: '100%',

    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    paddingVertical: 20,
    paddingBottom: 50
    },

        modalContent: {
        marginVertical: 10,
        marginHorizontal: 6,
    },
    
    modalBackground: {
        width: '100%',
    },

    sliderContainer: {
        height: THUMB_SIZE,
        justifyContent: 'center',
        width: SLIDER_WIDTH
    },

  track: {
    height: TRACK_HEIGHT,
    borderRadius: 4,
    
    position: 'absolute',
    borderWidth: 1,
    width: SLIDER_WIDTH
  },

  progress: {
    height: TRACK_HEIGHT-2,
    borderRadius: 4,
    
    position: 'absolute',
    left: 1,
    top: 3,
  },

  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 4,
    left: 10,
    position: 'absolute',
    top: -0.5,
    borderWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5,
  },

  settingsMenuTitle: {
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#444444',
    color: '#e6e6e6',
    alignSelf: 'center',
    padding: 3,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginBottom: 4
},

accountConnectPrompt: {
    textAlign: 'center',
    marginHorizontal: 15,
    fontSize: 15,
    marginVertical: 5,
    backgroundColor: '#dcfcfa',
    padding: 5,
    borderRadius: 4,
    lineHeight: 18
},


checkerBoxContainer: {
  width: 15,
  height: 15,
  backgroundColor: 'lavender',
  borderWidth: 1,
  borderRadius: 2,
  marginTop: -1,
  alignItems: 'center'
},

  switchContainer: {
      width: 35,
      height: 15,
      borderRadius: 3,
      justifyContent: 'center'
  },

  switch: {
      width: 16,
      height: 16,
      borderRadius: 4,
  },

  infoText: {
    paddingVertical: 4,
    paddingLeft: 5,
    borderWidth: 1,
    borderRadius: 4,
    lineHeight: 20,
    fontSize: 16
  },

  aboutSectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    color: '#202020',
    backgroundColor: '#ffe29e',
    alignSelf: 'center',
    borderRadius: 3,
    borderWidth: 1,
    width: '50%'
  },

  twoButtonsTogether: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between'
  }



})