import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Connectico-Header-inmatch';
import { styles as moreStyles } from '../../source/styles/crossword-inmatch-modal-styles';
import { WordleText } from '../Skip-Game-Modal';

export const Connectico=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Grid Structure</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>A standard crossword is a square or rectangular grid, usually symmetrical (180-degree rotational symmetry). The grid is divided into transparent and off-white (fillable) squares.
                            </ModalContentText>   
                            <ModalContentText>   Off-White squares are where letters are entered. Transparent squares act as separators between words.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Numbering</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                        
                            <ModalContentText>   Clues are associated with white squares and are numbered sequentially from top to bottom and left to right. A number is assigned to the first white square of each Across and Down word.
                            </ModalContentText>   
                            <ModalContentText>   The same square may have both an Across and a Down clue. Not all white squares are numbered.   
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Clues</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Each numbered entry corresponds to two clues: one Across and one Down (if both apply).
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Filling in the Grid</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  All answers must be valid words or phrases (no abbreviations unless clued). Letters must be written in uppercase (in traditional puzzles).
                        </ModalContentText>
                        <ModalContentText>  Every letter is part of both an Across and a Down word unless it is at the grid’s edge. Solvers use clue logic + crossing letters to deduce answers.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}> 5. Solving Objectives</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>   Fill the entire grid so that all clues are satisfied. Each square must contain one letter only. There is only one correct solution, unless specified otherwise.
                        </ModalContentText>
                    </View>
        </View>
    );
}

export const UniversalExample=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>Example [Any Crossword]</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>If a portion of the crossword looks like this:</ModalContentText>
                        </View>
                            <View style={[moreStyles.wordleRow, {gap: 0.5, marginVertical: 0.5}]}>
                                <View style={moreStyles.wordleBox}>
                                    <WordleText></WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText></WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText></WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText></WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText></WordleText></View>
                            </View>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>Then the clue for this empty boxes would the one from the ACROSS table that has been marked. Look into the table that says:</ModalContentText>
                        </View>
                        <View style={moreStyles.clueContainer}>
        <View style={moreStyles.acrossClueContainer}>
            <View style={moreStyles.cluesText}>
                        <WordleText style={{textAlign: 'center', fontSize: 20, color: 'darkgreen'}}>ACROSS</WordleText>
            <View style={{width: '95%', height: 2, backgroundColor: 'darkgreen', marginBottom: 10}}></View>
            <View style={{flexDirection: 'row', gap: 10, padding: 3, borderRadius: 2, alignItems: 'center', backgroundColor: '#9dd4b7', marginTop: 2}}>
            <WordleText>1</WordleText>
            <WordleText style={{lineHeight: 23}}>Desert animal with humps</WordleText>
            </View></View></View></View>
        
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>This essentially explains the answer is camel. So you can put it all together and make our first start in the crossword.</ModalContentText>
                        </View>

                        <View style={[moreStyles.wordleRow, {gap: 0.5, marginVertical: 0.5}]}>
                                <View style={moreStyles.wordleBox}>
                                    <WordleText style={{fontSize: 25}}>C</WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText style={{fontSize: 25}}>A</WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText style={{fontSize: 25}}>M</WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText style={{fontSize: 25}}>E</WordleText></View>
                                <View style={moreStyles.wordleBox}><WordleText style={{fontSize: 25}}>L</WordleText></View>
                        </View>
            </View>
    );
}