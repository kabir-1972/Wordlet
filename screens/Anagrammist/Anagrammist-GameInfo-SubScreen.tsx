import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Anagrammist-Header-inmatch'
import { styles as moreStyles } from '../../source/styles/crossword-inmatch-modal-styles';
import { WordleText } from '../Skip-Game-Modal';

export const Anagrammist=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Face the Anagram</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>A bunch of letters will be displayed.
                            </ModalContentText>   
                            <ModalContentText> You just need to tap on the letters and create the word sequentially.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Look for the Word</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   The word you create must match exactly the word chosen initially.
                            </ModalContentText>   
                            <ModalContentText>   Even if you guess a correct English Word, it may not be the word that the puzzle wants you to create.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Keep Solving Puzzles</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Anagrams appear one by one as you solve them. The game ends after you have solved 100 Anagrams without any error. 
                        </ModalContentText>
                        <ModalContentText> If you leave the game, the game is reset to 0.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Assistance</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  You may want to clear the word that you have made. Also you can add the word to your Wordlet Bucket if you want. But the timer keeps ticking.
                        </ModalContentText>
                    </View>
        </View>
    );
}
