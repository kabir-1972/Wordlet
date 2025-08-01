import React from 'react';
import { View } from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Ortographia-Header-inmatch'
import { Rewards } from '../../source/styles/wordle-modals-styles';
import { Rewards as RewardsData } from '../Rewards';
export const Orthographia=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Mode - I</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>In mode - I, among four options, one will have the word with the correct spelling. You just need to select it.
                            </ModalContentText>   
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Mode - II</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   During mode - II, each option has a pair of words in it. Only one option has both the words in the pair with correct spelling. You choose that and you win.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Rewards</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> For solving each of the puzzles here, you are awarded with
                        </ModalContentText>
                        <Rewards xp={(RewardsData.Ortographia.xp).toString()} coins={(RewardsData.Ortographia.coins).toString()}/>
                    </View>
        </View>
    );
}
