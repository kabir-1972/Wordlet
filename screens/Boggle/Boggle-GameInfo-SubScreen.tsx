import React from 'react';
import { View } from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Boggle-Header-inmatch'
import { Rewards } from '../../source/styles/wordle-modals-styles';
import { Rewards as RewardsData } from '../Rewards';

export const WordChains=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. The Grid</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>A grid of 4x4 letters are present. You can hover over them and create words as you do so.
                            </ModalContentText>   
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Word Formation</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   Words must be at least 3 letters long. Letters must be connected sequentially, without reusing the same letter cube in a single word.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Scoring</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Only unique words are counted. Repeating words will not cost you anything. The Rewards vary according to the word length:
                        </ModalContentText>
                        <ModalContentText>Three letter words :</ModalContentText>
                        <Rewards xp={RewardsData.Boggle[3].xp.toString()} coins={RewardsData.Boggle[3].coins.toString()}/>
                        <ModalContentText>Four letter words :</ModalContentText>
                        <Rewards xp={RewardsData.Boggle[4].xp.toString()} coins={RewardsData.Boggle[4].coins.toString()}/>
                        <ModalContentText>Five letter words :</ModalContentText>
                        <Rewards xp={RewardsData.Boggle[5].xp.toString()} coins={RewardsData.Boggle[5].coins.toString()}/>
                        <ModalContentText>Six letter words :</ModalContentText>
                        <Rewards xp={RewardsData.Boggle[6].xp.toString()} coins={RewardsData.Boggle[6].coins.toString()}/>
                        <ModalContentText>Seven letter words :</ModalContentText>
                        <Rewards xp={RewardsData.Boggle[7].xp.toString()} coins={RewardsData.Boggle[7].coins.toString()}/>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Submit when done</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  At any moment in the game, you may click in the submit button to check whether the pairs are corect or not. A green tick mark and a red cross mark appears for your assistance.
                        </ModalContentText>
                    </View>
        </View>
    );
}
