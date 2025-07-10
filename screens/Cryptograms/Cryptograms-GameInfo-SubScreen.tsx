import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Cryptograms-Header-inmatch';
import { styles as moreStyles } from '../../source/styles/crossword-inmatch-modal-styles';
import { WordleText } from '../Skip-Game-Modal';

export const Cryptogram=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. How to Play</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>  The coded message is presented with the encrypted letters. </ModalContentText>   
                            <ModalContentText>  You try to guess the mapping of each coded letter to a real letter.</ModalContentText>
                            <ModalContentText>  As you assign letters, you gradually reveal words and phrases.</ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Hints and Clues</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                        
                            <ModalContentText>   Common words (like "THE", "AND", "IS") can help start the decoding.
                            </ModalContentText>   
                            <ModalContentText>   Letter frequency analysis (e.g., E is the most common letter in English) can guide your guesses.   
                            </ModalContentText>
                            <ModalContentText>   Single-letter words are often "I" or "A".</ModalContentText>
                            <ModalContentText>   Repeated patterns can suggest double letters or common suffixes.</ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Restrictions</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  One-to-one mapping: each cipher letter maps to exactly one plaintext letter.
                        </ModalContentText>
                        <ModalContentText>  No letter maps to itself unless the puzzle states otherwise.</ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Winning</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  You win by fully deciphering the text into a readable, meaningful message.
                        </ModalContentText>
                    </View>
        </View>
    );
}

export const UniversalExample=()=>{
    return (
        <View>
            <WordleText style={{textAlign: 'center', fontSize: 20, marginTop: 10, marginBottom: 3, color: 'wheat'}}>Types of Ciphers</WordleText>
        <ParagraphText style={{color: '#dcf9f5'}}>Uniform Offsetting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>
                                Each character is either shifted forward or backward by any offset, not sure which one. The offset also randomizes as you the puzzle each time when you play.
                            </ModalContentText>
                        </View>


        <ParagraphText style={{color: '#dcf9f5'}}>Split Offsetting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>
                                The first half of the English Alphabets [A-Z] is either shifted forward or backward by a single offset, that is also a random value and the second half is shifted forward or backward by other offset. The offset also randomizes as you the puzzle each time when you play.
                            </ModalContentText>
                        </View>

        <ParagraphText style={{color: '#dcf9f5'}}>Odd-Even Offsetting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>
                                Each odd characters in the English Alphabets [A, C, E, G etc...] is either shifted forward or backward by any offset where the even ones [B, D, F, H etc...] is shifted by another offset value. The offset also randomizes as you the puzzle each time when you play.
                            </ModalContentText>
                        </View>

        <ParagraphText style={{color: '#dcf9f5'}}>Alphabetical Positional Offsetting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>
                                Each character is either shifted forward or backward by any offset, that is first randomly set for the game. But the offset value is further offset with another value corresponding to the position of the letter in the English Alphabets. Consider the base offset is randomly set to 5. Then the letter A would have an offset of 6, letter E an offset of 10 and so on. The offset also randomizes as you the puzzle each time when you play.
                            </ModalContentText>
                        </View>

        <ParagraphText style={{color: '#dcf9f5'}}>Vowel-Consonants Offsetting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>
                                Each vowels in the English Alphabets [A, E, I, O, U] is either shifted forward or backward by any offset where the consonant ones is shifted by another offset value. The offset also randomizes as you the puzzle each time when you play.
                            </ModalContentText>
                        </View>                                       
            </View>
    );
}