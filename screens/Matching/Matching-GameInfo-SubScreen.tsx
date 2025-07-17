import React from 'react';
import { View } from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Matching-Header-inmatch'

export const WordChains=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. The Table</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>The Table has two columns each having five words in it.
                            </ModalContentText>   
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Find what the Table hints</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   The table may have the antonyms of the words at the left column in its right column. Or on the contrary, it may have the synonyms. Observe the table to figure it out.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Selections</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Select one word and pick another one from the right column. The pairs are listed at the bottom of the table. You cannot reuse any words from either of the column.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Submit when done</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  At any moment in the game, you may click in the submit button to check whether the pairs are corect or not. A green tick mark and a red cross mark appears for your assistance.
                        </ModalContentText>
                    </View>
        </View>
    );
}
