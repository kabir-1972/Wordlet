import React from 'react';
import { View } from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Satietas-Header-inmatch'

export const Orthographia=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Words at the Starting</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>There are a bunch of words at the top, in the middle of the screen.
                            </ModalContentText>   
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Find what the words at the center hints</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   The container at the center with dashed borders have a number of words that might be the synonym or antonym of any of the word from the titular words.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Selections</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Select one word from the titluar section and find its synonym or antonyms [which you need to check] from the words.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Submit when done</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  At any moment in the game, you may click in the submit button to check whether the selections are corect or not. You are hinted your mistakes if there is any.
                        </ModalContentText>
                    </View>
        </View>
    );
}
