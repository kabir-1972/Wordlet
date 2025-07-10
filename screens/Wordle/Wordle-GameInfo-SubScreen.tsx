import React from 'react';
import { View, Image, Text, ImageBackground } from 'react-native';
import { buttons } from '../../source/styles/assets';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Wordle-Header-inmatch';

export const BasicWordle=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start with your first guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Type in any real English word [ that fills up exactly each of the rows ] and submit it by clicking the button.
                            </ModalContentText>   
                            <ModalContentText>   The game will reject words that aren't in its dictionary.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Feedback After Each Guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   After submitting a guess, each letter in the word will change color to indicate how accurate it was.
                            </ModalContentText>   
                            <ModalContentText>    There will be three colors to guide you guessing the correct word:
                            </ModalContentText>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow'}]}>
                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.greenButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.yellowButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the wrong position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blackKey}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the to-be-guessed word.</ModalContentText>
                            </View>   
                            </View>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>   As the words in the wordle window change, the keyboard will also change the colors of the keys accordingly, based on the same rules.
                                  
                                </ModalContentText>
                            </View>
        </View>
    );
}

export const ReverseWordle=()=>{
    return(
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start with your first guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Type in any real English word [ that fills up exactly each of the rows ]{' '}
                                <ModalContentText style={{color: 'red'}}>but this time, in the reverse order</ModalContentText>{' '} 
                                and submit it by clicking the button.
                            </ModalContentText>   
                            <ModalContentText>   The game will reject words that aren't in its dictionary.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Feedback After Each Guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   After submitting a guess, each letter in the word will change color to indicate how accurate it was.
                            </ModalContentText>   
                            <ModalContentText>    There will be three colors to guide you guessing the correct word:
                            </ModalContentText>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow'}]}>
                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.greenButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.yellowButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the wrong position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blackKey}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the to-be-guessed word.</ModalContentText>
                            </View>   
                            </View>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>   As the words in the wordle window change, the keyboard will also change the colors of the keys accordingly, based on the same rules.
                                  
                                </ModalContentText>
                            </View>
        </View>
    )
}

export const ShiftedWordle=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start with your first guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Type in any real English word [ that fills up exactly each of the rows ] and submit it by clicking the button.
                            </ModalContentText>   
                            <ModalContentText>   The game will reject words that aren't in its dictionary.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Feedback After Each Guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   After submitting a guess, each letter in the word will change color to indicate how accurate it was.
                            </ModalContentText>   
                            <ModalContentText>    There will be four colors to guide you guessing the correct word:
                            </ModalContentText>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow'}]}>
                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.greenButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.redButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the left to its actual position in the word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blueButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the right to its actual position in the word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blackKey}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the to-be-guessed word.</ModalContentText>
                            </View>   
                            </View>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>   As the words in the wordle window change, the keyboard will also change the colors of the keys accordingly, based on the same rules.
                                  
                                </ModalContentText>
                            </View>
        </View>
    )
}

export const PreSolvedWordle=()=>{
    return (
        
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start with your first guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   The wordle is already attempted to solve until the final try remains.
                            </ModalContentText>
                            <ModalContentText>   Type in any real English word [ that fills up exactly each of the rows ] and submit it by clicking the button.
                            </ModalContentText>   
                            <ModalContentText>   The game will reject words that aren't in its dictionary.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Feedback After Each Guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   After submitting a guess, each letter in the word will change color to indicate how accurate it was.
                            </ModalContentText>   
                            <ModalContentText>    There will be four colors to guide you guessing the correct word:
                            </ModalContentText>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow'}]}>
                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.greenButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.yellowButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blackKey}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the to-be-guessed word.</ModalContentText>
                            </View>   
                            </View>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>   As the words in the wordle window change, the keyboard will also change the colors of the keys accordingly, based on the same rules.
                                </ModalContentText>
                            </View>
        </View>
    )
}

export const MultiplayerWordle=()=>{
    return(<View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start with your first guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Type in any real English word [ that fills up exactly each of the rows ]{' '}
                                <ModalContentText style={{color: 'red'}}>but this time, in the reverse order</ModalContentText>{' '} 
                                and submit it by clicking the button.
                            </ModalContentText>   
                            <ModalContentText>   The game will reject words that aren't in its dictionary.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Feedback After Each Guess</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   After submitting a guess, each letter in the word will change color to indicate how accurate it was.
                            </ModalContentText>   
                            <ModalContentText>    There will be three colors to guide you guessing the correct word:
                            </ModalContentText>
                        </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow'}]}>
                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.greenButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the correct position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.yellowButton}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is in the wrong position.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRow}>
                              <Image 
                              source={buttons.blackKey}
                              style={modalStyles.wordleExampleKey}></Image>
                              <ModalContentText>The letter is not in the to-be-guessed word.</ModalContentText>
                            </View>   
                            </View>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>   As the words in the wordle window change, the keyboard will also change the colors of the keys accordingly, based on the same rules.
                                </ModalContentText>
                            </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Results</ParagraphText>
                            <View style={modalStyles.modalSubParagraph}>
                                <ModalContentText>  The person who guesses the word first (in least number of seconds) wins [even if the player takes more tries]. </ModalContentText>
                                <ModalContentText>  Leaving the game will cause your elimination from the match. </ModalContentText>
                            </View>
        </View>
    )
}

export const BasicWordleExample=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>Example [Basic Wordle]</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   If your first guess is {' '}
                                <ModalContentText style={{color:'seagreen'}}>PLOT</ModalContentText> and the to-be-guessed word is <ModalContentText style={{color:'seagreen'}}>FLAT</ModalContentText>, then the response would be: </ModalContentText>   
                            <View style={{flexDirection: 'row', gap: 2, alignSelf: 'center'}}>
                                <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>P</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.greenKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{fontSize: 23}}>L</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>O</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.greenKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{fontSize: 23}}>T</ModalContentText>
                                </ImageBackground>
                            </View>

                        <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow', marginTop: 10}]}>
                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>P</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter P is in not in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.greenKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{fontSize: 23}}>L</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter L is in the same position as in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>O</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter O is in not in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.greenButton}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{fontSize: 23}}>T</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter T is in the same position as in the to-be-guessed word.</ModalContentText>
                            </View> 
                        </View>

                            <ModalContentText>   Since you get that P and O are not in the to-be-guessed word, your second guess could be {' '}
                                <ModalContentText style={{color:'seagreen'}}>CART</ModalContentText>, then the response would be: </ModalContentText>   
                            <View style={{ flexDirection: 'row', gap: 1, alignSelf: 'center'}}>
                                <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>C</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.yellowKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{fontSize: 23}}>A</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>R</ModalContentText>
                                </ImageBackground>

                                <ImageBackground
                                source={buttons.greenKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}>
                                    <ModalContentText style={{fontSize: 23}}>T</ModalContentText>
                                </ImageBackground>
                            </View>

                            <View style={[modalStyles.modalSubParagraph, {backgroundColor: 'lightyellow', marginTop: 10}]}>
                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>C</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter C is in not in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.yellowKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{fontSize: 23}}>A</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter A is in the wrong position as in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.blackKey}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{color: 'white', fontSize: 23}}>R</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter R is in not in the to-be-guessed word.</ModalContentText>
                            </View>

                            <View style={modalStyles.colorRowWider}>
                              <ImageBackground
                                source={buttons.greenButton}
                                style={modalStyles.wordleExampleKeyLarger}
                                imageStyle={modalStyles.bgImage}
                                >
                                    <ModalContentText style={{fontSize: 23}}>T</ModalContentText>
                             </ImageBackground>
                              <ModalContentText>The letter T is in the same position as in the to-be-guessed word.</ModalContentText>
                            </View> 
                        </View>
                        </View>
        </View>
    );
}

export const ReverseWordleExample=()=>{
    return (
        <Text>Hi</Text>
    );
}


export const PreSolvedWordleExample=()=>{
    return (
        <Text>Hi</Text>
    );
}


export const ShiftedWordleExample=()=>{
    return (
        <Text>Hi</Text>
    );
}


export const MultiplayerWordleExample=()=>{
    return (
        <Text>Hi</Text>
    );
}
