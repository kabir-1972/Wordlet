import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './WicWacWoe-Header-inmatch'

export const WordChains=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Starting the Game</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>One player begins by saying any valid word.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Chain Formation</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Each next player must say a word that starts with the last letter of the previous player’s word.
Example: If the previous word is "apple", the next word must start with "e" (e.g., "elephant").
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. No Repetition</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Words already used in the game cannot be repeated. 
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Valid Words</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  Only real, dictionary-recognized words are allowed.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>5. Winning the Game</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  The game continues until a player creates 500 words without losing all three lives against the computer or the computer runs out of words. In case of multiplayer battles (online or offline), the first player to lose all three lives loses.
                        </ModalContentText> 
                    </View>
        </View>
    );
}
