


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

    input: {   
        height: 40,
        borderColor: '#444444',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        fontSize: 18,
        
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        width: '80%',
        maxWidth: 250,
        fontFamily: 'Wordlet-Regular'
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

    nameOfThePack : {
        backgroundColor: '#c7fceb',
        alignSelf: 'center',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 1,
        flexDirection: 'row'
    },

    nameEditBtnContainer: {
        backgroundColor: '#6a857c',
        marginLeft: 20,
        width: 25,
        height: 25,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },

    createFlashCardBtn: {
        width: 120,
        aspectRatio: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
    },

    createCardInfoContainer: {
        backgroundColor: '#ffd4d4',
        alignSelf: 'center',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 4,
        marginTop: 20
    },

    theCard: {
        maxWidth: 200,
        aspectRatio: 0.6,
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 1,
        marginTop: 5,
        justifyContent: 'center'
    },

    cardHeading: {
        color: '#faf7e3',
        textAlign: 'center',
    },

    cardSelectionTab: {
        borderRadius: 3,
        borderWidth: 1,
        paddingHorizontal: 4,
        paddingVertical: 3
    },

    largeInput: {  
        height: 100,
        borderColor: '#444444',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        fontSize: 18,
        
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        width: '80%',
        maxWidth: 250,
        fontFamily: 'Wordlet-Regular',
        textAlignVertical: 'top',
        lineHeight: 20
    },

    cardEditHeading: {
        backgroundColor: '#fce4c2',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 4,
        marginVertical: 10
    },

    characterPrompt: {
        fontSize: 14,
        alignSelf: 'flex-end',
        marginRight: 20,
        color: '#fff1bd'
    },

    cardTitle:{
        width: '80%',
        alignSelf: 'center',   
    },

    hintOfTheCard:{
        marginVertical: 10,
        backgroundColor: '#ffbcb0',
        alignSelf: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4
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

    editTab: {
        alignSelf: 'center',
        width: '70%',
        maxWidth: 350,
        borderColor: '#ffffff80',
        backgroundColor: '#ffffff10',
        borderRadius: 4,
        padding: 10,
        borderStyle: 'dashed',
        borderWidth: 1.8
    },

    headingsOfBackFace: {
        alignSelf: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        marginVertical: 2
    },
    
    paragraphsOfBackFace: {
        alignSelf: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        marginVertical: 1,
        backgroundColor: '#fff3f2',
        borderWidth: 1
    },

    bar: {
        height: 5,
        backgroundColor: '#c1f7ca',
        flex: 1,
        marginVertical: 10,
        borderRadius: 5,
        overflow: 'hidden'
    },

    theCardInStack: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5c79f',
        borderRadius: 4,
        marginHorizontal: 2
        
        
    },

    theCardStackContainer: {
        minHeight: 40,
        borderWidth: 0.5,
        borderColor: '#faf0e1',
        
        marginVertical: 10,
        borderRadius: 4,
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center'
    },

    cardNumberInStack: {
        color: '#783a04',
        fontSize: 18,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#783a04'
    }
    




})
/*
  <Animated.View style={{transform: [{scale: clearAllBtnScale}]}}>
  <Pressable
      onPressIn={()=>buttonPressIn(clearAllBtnScale)}
      onPressOut={()=>buttonPressOut(clearAllBtnScale)}
      onPress={()=>{

      }}
  >
    <ImageBackground
    source={buttons.redButton}
    style={{width: 90, aspectRatio: 2.4, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 10}}
    imageStyle={{resizeMode: 'stretch', borderRadius: 4, borderWidth: 1}}
    >
      <WordleText style={{color: 'white'}}>Clear All</WordleText>
    </ImageBackground>
  </Pressable>
  </Animated.View>
*/
