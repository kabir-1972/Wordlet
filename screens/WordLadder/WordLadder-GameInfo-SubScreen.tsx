import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './WordLadder-Header-inmatch'

export const WordLadder=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Same Length</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>All words (start, end, intermediates) must be the same length.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. One Letter Change</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Each step can only change one single letter from the previous word.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Valid Words Only</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Every word in the ladder must be a real word (usually from a predefined dictionary). 
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. No Repeats:</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  You cannot reuse the same word in the ladder.
                        </ModalContentText>
                    </View>
        </View>
    );
}
