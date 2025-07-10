import React from 'react';
import { View,} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './Searchup-Header-inmatch';
import { styles as moreStyles } from '../../source/styles/crossword-inmatch-modal-styles';
import { WordleText } from '../Skip-Game-Modal';

export const Searchup=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. Start the Grid</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>A grid of letters will be displayed.
                            </ModalContentText>   
                            <ModalContentText> A list of target words will appear below the grid.
                            </ModalContentText>
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Search for Words</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                        
                            <ModalContentText>   Look for words hidden in the grid.
                            </ModalContentText>   
                            <ModalContentText>   Words may run left-to-right, right-to-left, top-to-bottom, bottom-to-top, or diagonally in any direction.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. Select a Word</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> Tap the grids to select a word. After tapping all the grids, wait a few seconds to check if your selected grids really create a word.
                        </ModalContentText>
                        <ModalContentText>If your selection matches a word on the list, it will be highlighted and marked as found.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. No Guessing Twice</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  The puzzle is complete when all listed words are found.
                        </ModalContentText>
                    </View>
        </View>
    );
}

export const UniversalExample=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>Example [Any SearchUp]</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>If a portion of the SearchUp looks like this:</ModalContentText>
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