import React from 'react';
import { View, Text} from 'react-native';
import { modalStyles } from '../../source/styles/wordle-header-inmatch-modals-style';
import { ParagraphText, ModalContentText } from './WicWacWoe-Header-inmatch'

const rowsRepeat=3;
const colsRepeat=3;
const rows=3;
const cols=3;
const boxWidth=20;
const hiddenKeys=[5, 14, 23, 32, 41, 50, 59, 68, 77];


export const WordChains=()=>{
    return (
        <View>
        <ParagraphText style={{color: '#dcf9f5'}}>1. The Game Board</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>The Board has nine large blocks, each having nine smaller grids in it. But exceptionally the grid at the center is blank. There can be no letters placed there. The grid is counted in this way:
                            </ModalContentText>
                            <View style={{alignSelf: 'center'}}>    
                            {
                              Array.from({ length: rowsRepeat }).map((_, k) => (
                                <View key={`row-${k}`} style={{ flexDirection: 'row', gap: 3, marginBottom: 3 }}>
                                  {
                                    Array.from({ length: colsRepeat }).map((_, g) => (
                                      <View key={`grid-${k}-${g}`} style={{borderRadius: 5, overflow: 'hidden', borderWidth: 1}}>
                                        {
                                          Array.from({ length: rows }).map((_, i) => (
                                            <View key={`grid-${k}-${g}-row-${i}`} style={{ flexDirection: 'row' }}>
                                              {
                                                Array.from({ length: cols }).map((_, j) => {
                                                  const key=rows*cols*(k*colsRepeat+g)+i*cols+j+1;
                                                  return (
                                                  <View key={key}
                                                    style={[{ width: boxWidth, height: boxWidth, alignItems: 'center', justifyContent: 'center'}, !hiddenKeys.includes(key)?{backgroundColor: '#fcf4e3', borderWidth: 0.5 } :null,]}
                                                  >
                                                    <Text style={{ fontSize: 12, fontFamily: 'Wordlet-Regular', color: '#555555' }}>{!hiddenKeys.includes(key)?key:''}</Text>
                                                  </View>
                                                )})
                                              }
                                            </View>
                                          ))
                                        }
                                      </View>
                                    ))
                                  }
                                </View>
                              ))
                            }
                            
                            </View>    
                        </View>
                    <ParagraphText style={{color: '#dcf9f5'}}>2. Start with a Word</ParagraphText>
                        <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>   The first player is allowed to start with any block and any word. The word needs to a valid English word [matching our dictionary] and exactly of three letters.
                            </ModalContentText>
                            </View>
                        
                    <ParagraphText style={{color: '#dcf9f5'}}>3. The Marker</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText> After the first word has been set, there appears a floating marker that finds out the next block to be floated upon. The next block is the position of the block corresponding to the last letter you have used in your word. For instance, if the last letter is 'Z', then the marker gets to the block that has the 26th grid in it.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>4. Rotations</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  If the selected grid [26th as in the example] is already filled, then the marker advances by 26 more squares and finds the 52nd square in the grids and gets positioned there. If the 52nd square is also filled, then the marker tracks down the 78th grid. But it does not exceed the 81st grid. If there is no empty grid found, the word is rejected.
                        </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>5. Fixed Grids</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>  The block where the marker remains floated becomes the block for setting up the next word. You cannot choose any other grids outside this block to set the next word there.
                        </ModalContentText> 
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>6. How does the Game Ends?</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>  The game ends if:
                            </ModalContentText>
                            <ModalContentText> Neither side can find any word to be placed in the grid. Either the grid is completely filled [which is checked] or there is no valid word to be placed there [which is checked too]. Also even there is a valid word, the word might not be placed there if there is no available empty grid, this also puts an end to the game.
                            </ModalContentText>
                    </View>

                    <ParagraphText style={{color: '#dcf9f5'}}>7. How do the turns shift?</ParagraphText>
                    <View style={modalStyles.modalSubParagraph}>
                            <ModalContentText>If a player submits a word, no matter what happens after submission, maybe the word cannot be placed due to no empty grid, or the word is mismatched with the previously placed letters in the grid or the word is an invalid word, then the turns are shifted from the first player to the second [or vice-versa].
                            </ModalContentText>
                    </View> 

                    <ParagraphText style={{color: '#dcf9f5'}}>8. Choosing the Winner</ParagraphText>       
                    <View style={modalStyles.modalSubParagraph}>
                        <ModalContentText>The player who can place more words in the board wins the game.
                        </ModalContentText>
                    </View>


        </View>
    );
}
