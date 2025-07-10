import React, { useEffect, useState, JSX, useRef } from 'react'
import { ImageBackground, ViewStyle, ScrollView, Text, Modal, View, Animated, Pressable, Image, BackHandler } from 'react-native'
import { styles } from '../source/styles/header-inmatch-styles'
import { endgameStyles } from '../source/styles/header-endgame-styles'
import { _targetWord, BlackParagraphText, finalDate, HeaderText, ParagraphText, WordleText } from './Wordle/Wordle-Match-End'
import { modalBackgrounds, buttons, icons } from '../source/styles/assets'
import LottieView from 'lottie-react-native'
import { buttonPressIn, buttonPressOut } from '../source/styles/allAnimations'
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import SoundPlayer from "react-native-sound-player";
import { OutlinedText } from '../source/styles/outlinedText'
import CountUp from '../source/styles/allAnimations'
import { SettingsModal } from './Settings'
import { AddCoinModal } from './Add-Coin-Modal'
import { ProfileModal } from './Profile'

type WordleBucketModalProps={
  showWordleBucketModal: boolean;
  setShowWordleBucketModal: (value: boolean) => void;
  targetWord: string;
  finalDate: string;
  wordletBucketWords: number;
  showWordAdded: boolean;
  showWordAlreadyAdded: boolean;
  cancelWordBucket: Animated.Value;
  addWordToBucket: Animated.Value;
  handleAddWordToBucket: () => void;
}

export const WordleBucketModal=((props:WordleBucketModalProps)=>{
    return(
        <Modal
                  visible={props.showWordleBucketModal}
                  onRequestClose={()=>props.setShowWordleBucketModal(false)}
                  transparent={true}
                  >
                  <View style={endgameStyles.container}>
                  <ImageBackground
                        source={modalBackgrounds.whiteModalBackgroundImg}
                        style={{width: '100%', alignItems: 'center', paddingBottom: 20}}
                        imageStyle={{resizeMode: 'stretch'}}
                        >
                        <BlackParagraphText style={{fontSize: 20, marginTop: 32}}>Wordlet Bucket</BlackParagraphText>
                        <View style={{backgroundColor: '#222222', width: '85%', height: 1}}/>
                        <BlackParagraphText style={{color: '#003e40', marginTop: 20}}>Add the Word to Wordle Bucket?</BlackParagraphText>
                        <View style={endgameStyles.wordletBoxStyles}>
                          <WordleText>{props.targetWord}</WordleText>
                          <View style={{width: 1, height: '120%', backgroundColor: 'black'}}></View>
                          <WordleText>{props.finalDate}</WordleText>
                        </View>
                        <WordleText style={{color: '#646464', fontSize: 15}}>Current Word Count: {props.wordletBucketWords}</WordleText>
                        <View style={{backgroundColor: '#fcdaae', width: '80%', padding: 5, borderRadius: 4}}>
                        <WordleText style={{color: '#222222', fontSize: 15, lineHeight: 18, textAlign: 'center'}}>Words added to Word Bucket are saved in your device. There is no limit to adding words. No data is sent to our servers.</WordleText>
                        </View>

                         <View style={{height: 40}}> 
                        {props.showWordAdded && (
                          <View style={{ marginVertical: 5, flexDirection: 'row', backgroundColor: '#81ff96', paddingVertical: 1, paddingHorizontal: 10, borderRadius: 5, alignItems: 'center', gap: 5 }}>
                            <LottieView source={require('./../assets/animations/tick-mark-animation.json')} autoPlay style={{ width: 35, height: 35 }} />
                            <WordleText style={{ color: '#02443a', marginTop: 3 }}>Word Added !!!</WordleText>
                          </View>
                        )}

                        {props.showWordAlreadyAdded && (
                          <View style={{ marginVertical: 5, flexDirection: 'row', backgroundColor: '#ff819c', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, alignItems: 'center', gap: 5 }}>
                            <LottieView source={require('./../assets/animations/cross-mark-animation.json')} autoPlay style={{ width: 25, height: 25 }} />
                            <WordleText style={{ color: '#742b3b', marginTop: 3 }}>Word Already in Bucket!</WordleText>
                          </View>
                        )}
                        </View>

                        <View style={{marginTop: 20, flexDirection: 'row', gap: 5}}>
                          <Animated.View style={{transform:[{scale: props.cancelWordBucket}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(props.cancelWordBucket)}
                            onPressOut={()=>buttonPressOut(props.cancelWordBucket)}
                            onPress={()=>props.setShowWordleBucketModal(false)}
                            >
                              <ImageBackground
                                  source={buttons.redButton}
                                  style={[endgameStyles.button, {borderRadius: 5}]}
                                  imageStyle={styles.buttonStyle}
                              >
                              <WordleText style={{paddingVertical: 5, fontSize: 20}}>Cancel</WordleText>
                              </ImageBackground>
                            </Pressable>

                          </Animated.View>

                          <Animated.View style={{transform:[{scale: props.addWordToBucket}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(props.addWordToBucket)}
                            onPressOut={()=>buttonPressOut(props.addWordToBucket)}
                            onPress={()=>props.handleAddWordToBucket()}
                            >
                              <ImageBackground
                                  source={buttons.tealButton}
                                  style={[endgameStyles.button, {borderRadius: 5}]}
                                  imageStyle={styles.buttonStyle}
                              >
                              <WordleText style={{paddingVertical: 5, fontSize: 20}}>Add Word</WordleText>
                              </ImageBackground>
                            </Pressable>

                          </Animated.View>
                        </View>
                      </ImageBackground>
                      </View>
            </Modal>
    )
})


type DictionaryModalProps={
  showDictionaryModal: boolean;
  setShowDictionaryModal: (value: boolean) => void;
  targetWord: string;
  cancelWordBucket: Animated.Value;
  addWordToBucket: Animated.Value;
}

let dictionaryData: any;
export const DictionaryModal=((props:DictionaryModalProps)=>{
    const [renderedViewOfMeaning, setRenderedViewOfMeaning] = useState<React.ReactNode | null>(null);    
    useEffect(()=>{
        setRenderedViewOfMeaning(shapeTheDictionary(props.targetWord));
    }, [props.targetWord])

    return(
        <Modal
                  visible={props.showDictionaryModal}
                  onRequestClose={()=>props.setShowDictionaryModal(false)}
                  transparent={true}
                  >
                  <View style={endgameStyles.container}>
                  <ImageBackground
                        source={modalBackgrounds.whiteModalBackgroundImg}
                        style={{width: '100%', alignItems: 'center', paddingBottom: 20}}
                        imageStyle={{resizeMode: 'stretch'}}
                        >
                        <BlackParagraphText style={{fontSize: 20, color: '#ffffff', marginVertical: 10}}>Dictionary</BlackParagraphText>
                        {renderedViewOfMeaning}
                        <View style={{marginTop: 20, flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                          <Animated.View style={{transform:[{scale: props.cancelWordBucket}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(props.cancelWordBucket)}
                            onPressOut={()=>buttonPressOut(props.cancelWordBucket)}
                            onPress={()=>props.setShowDictionaryModal(false)}
                            >
                              <ImageBackground
                                  source={buttons.yellowButton}
                                  style={[endgameStyles.button, {borderRadius: 5}]}
                                  imageStyle={styles.buttonStyle}
                              >
                              <WordleText style={{paddingVertical: 5, fontSize: 20}}>Okay</WordleText>
                              </ImageBackground>
                            </Pressable>
                          </Animated.View>

                          <Animated.View style={{transform:[{scale: props.addWordToBucket}]}}>
                            <Pressable
                            onPressIn={()=>buttonPressIn(props.addWordToBucket)}
                            onPressOut={()=>buttonPressOut(props.addWordToBucket)}
                            onPress={()=>handleAddWordMeaningToBucket(props.targetWord)}
                            >
                              <ImageBackground
                                  source={buttons.tealButton}
                                  style={[endgameStyles.button, {borderRadius: 7}]}
                                  imageStyle={styles.buttonStyle}
                              >
                              <WordleText style={{paddingVertical: 4, fontSize: 20}}>Save Meaning</WordleText>
                              </ImageBackground>
                            </Pressable>

                          </Animated.View>
                        </View>
                      </ImageBackground>
                      </View>
            </Modal>
    )
})

const handleAddWordMeaningToBucket = async (targetWord: string) => {
  const fileName = `dictionary/${targetWord}.json`;
  const dirPath = `${RNFS.DocumentDirectoryPath}/dictionary`;
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const dirExists = await RNFS.exists(dirPath);
    if (!dirExists) {
      await RNFS.mkdir(dirPath);
    }

    await RNFS.writeFile(filePath, JSON.stringify(dictionaryData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error updating file for setting last match:', err);
  }
};



const fetchWordMeaning = async (word: string): Promise<string | undefined> => {
  console.log(word);
  if(word.length==0) return;
  const filedata=await checkForDictionaryFile(word);

  if(filedata?.length!=0)
    return filedata;

  if(filedata?.length==0){
    const state = await NetInfo.fetch();
    if (!state.isConnected) return undefined;
  }
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json()
    return data;
  } catch (err) {;
    console.error('Error fetching definition:', err);
    return undefined;
  }
};

const checkForDictionaryFile=async(word:string)=>{
  const fileName = `dictionary/${word}.json`;
  const dirPath = `${RNFS.DocumentDirectoryPath}/dictionary`;
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const dirExists = await RNFS.exists(dirPath);
    if (!dirExists) return "";
    const content= await RNFS.readFile(filePath, 'utf8');
    return content;
  } catch (err) {
    console.error('Error updating file for setting last match:', err);
  }
}



const shapeTheDictionary = async (word: string) => {
  const data = await fetchWordMeaning(word);
  if (data && Array.isArray(data)) {
    dictionaryData=data;
    const entry=data[0];
    const meanings=entry.meanings;
    const phonetics=entry.phonetics;
    
    const renderedMeanings: JSX.Element[]=[];
    const renderedPronunciations: JSX.Element[]=[];

    for(let i=0;i<meanings.length;i++)
      renderedMeanings.push(shapeTheMeaningPart(meanings[i], i));

    for(let i=0;i<phonetics.length;i++){
      const shapedPhonetics = <ShapeThePronunciations pronunciation={phonetics[i]} index={i} key={i} />;
        if(shapedPhonetics != undefined || shapedPhonetics != null)
      renderedPronunciations.push(shapedPhonetics);
    }

    return (
        <View style={{width: '90%', height: 300, alignItems: 'center'}}>
          <BlackParagraphText style={{textAlign: 'center', fontSize: 30, paddingTop: 5/**/}}>{word}</BlackParagraphText>
          <View style={{width: '90%', backgroundColor: '#222222', height: 2, marginBottom: 20, marginTop: 5}}></View>
        <ScrollView style={{ width: '100%', alignSelf: 'center'}}>
        { renderedPronunciations }
        { renderedMeanings }
          <View style={{backgroundColor: '#add0f8', width: '90%', alignSelf: 'center', padding: 5, borderRadius: 4}}>
            <WordleText style={{color: '#222222', fontSize: 15, lineHeight: 18, textAlign: 'center'}}>Word Meanings that are saved are stored in your device. There is no limit to saving the meanings. If the data is saved, next time, you won't need an active internet connection to see the meaning.</WordleText>
          </View>
        </ScrollView>
        </View>
)
  } else {
    return (<WordleText>Requires an Internet Connection</WordleText>);
  }
};

/* 
const shapeTheMeaningPart2=(meaning: any)=>{
    return (
    <View style={{ marginBottom: 10 }}>
      {Object.entries(meaning).map(([key, value], idx) => (
        <View key={idx} style={{ marginBottom: 5 }}>
          <Text style={{}}>=&gt;{key}:</Text>
          {Array.isArray(value)? (
            value.map((item, i) => (
              <Text key={i} style={{ marginLeft: 10 }}>
                {typeof item === 'string' ? item.replaceAll("\"","") : JSON.stringify(item).replaceAll("\"","")}
              </Text>
            ))
          ) : (
            <Text style={{ marginLeft: 10 }}>
            =&lt;{typeof value === 'string' || typeof value === 'number' ? value: JSON.stringify(value)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

}
*/

const shapeTheMeaningPart=(meaning: any, index: number)=>{
    const partsOfSpeech = meaning.partOfSpeech;
    const definitions = meaning.definitions;
    const synonyms = meaning.synonyms;
    const antonyms = meaning.antonyms;

    let listOfSynonyms:string[]=[];
    let listOfAntonyms:string[]=[];

    synonyms.map((syn: string) => (
      listOfSynonyms.push(syn)
    ));

    antonyms.map((syn: string)=>(
      listOfAntonyms.push(syn)
    ))

    listOfSynonyms.join(', ');
    listOfAntonyms.join(', ');

    const renderedSynonyms=(
            <View style={{marginTop: 20}}>
            {listOfSynonyms.length!=0&&(
                <View>
                  <DictionaryHeader header='Synonyms'/>
                  <View style={{backgroundColor: '#d9d0fc', padding: 10, borderRadius: 8, marginVertical: 10}}>
                    <WordleText>{listOfSynonyms}</WordleText>
                    </View>
                </View>
            )}
            </View>  
    )

    const renderedAntonyms=(
            <View style={{marginTop: 20}}>
            {listOfAntonyms.length!=0&&(
                <View>
                  <DictionaryHeader header='Antonyms'/>
                  <WordleText>{listOfAntonyms}</WordleText>
                </View>
            )}
            </View>  
    )

    const renderedDefinition: JSX.Element[] = [];

    for(let i=0;i<definitions.length; i++)
        renderedDefinition.push(shapeTheDefinitions(definitions[i], i));

    return (
      <View key={index}>
        <View style={{backgroundColor: '#a1edfd', padding: 6, alignSelf: 'center', borderRadius: 4, marginBottom: 10, borderColor: '#3b2705', borderWidth: 1, elevation: 5}}>
        <WordleText style={{fontSize: 20, color: '#033e4a'}}>Used as a {partsOfSpeech}</WordleText>
        </View>
        <DictionaryHeader header='Meaning with Examples'/>        
        {renderedDefinition}
        {renderedSynonyms}
        {renderedAntonyms}
      </View>
    )

}

type DictionaryHeaderProps={
  header: string
}
const DictionaryHeader=(props:DictionaryHeaderProps)=>{
  return(
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                    <Image 
                    source={icons.coloredCube}
                    style={{width: 25, height: 25, marginTop: -3}}
                    />
                    <WordleText style={{fontSize: 20}}>{props.header}</WordleText>
                    </View>

  )
}

const shapeTheDefinitions=(definition: any, index: number)=>{
    return(
        <View key={index} style={{marginLeft: 20}}>
           <View style={{flexDirection: 'row', gap: 3, alignItems: 'center', marginVertical: 5}}>
              <View style={{backgroundColor: '#fcacd4',  borderRadius: 4, borderWidth: 1}}>
              <WordleText style={{color: '#670033', paddingVertical: 2, paddingHorizontal: 6, fontSize: 15}}>{index+1}</WordleText></View>
              <View style={{width: '90%', paddingRight: 10}}>
              <WordleText style={{lineHeight: 25}}>{definition.definition}</WordleText>
              </View>
           </View>

           {definition.example&&definition.example.length!=0&&
           (<View style={{backgroundColor: '#ffda9f', paddingVertical: 6, borderRadius: 4, marginHorizontal: 4,
           }}>
              <WordleText style={{textAlign: 'center', lineHeight: 25}}>{definition.example}</WordleText>
           </View>)}
           
        {definition.synonyms && definition.synonyms.length !== 0 && (
        <View style={{ marginLeft: 10 }}>
          <WordleText>Synonyms:</WordleText>
          {definition.synonyms.map((syn: string, i: number) => (
            <WordleText key={i} style={{ marginLeft: 10 }}>- {syn}</WordleText>
          ))}
        </View>
        )} 
        </View>
    )
}

type ShapeThePronunciationsProps={
    pronunciation: any, 
    index: number,
}

const ShapeThePronunciations: React.FC<ShapeThePronunciationsProps>=({pronunciation, index})=>{
    const phonetics = pronunciation.text;
    const audio = pronunciation.audio;
    const btnAnimation = useRef(new Animated.Value(1)).current;
    if(!audio) return;

    
    return (
      <View key={index}>
        <View style={{backgroundColor: '#013b3c', flexDirection: 'row', alignItems: 'center', paddingVertical: 3, paddingHorizontal:4, width: '90%', alignSelf: 'center', borderRadius: 4, marginBottom: 10, elevation: 5}}>
        <View style={{flexDirection: 'row', flex: 1, marginLeft: 20}}>
        <WordleText style={{marginTop: 2, color: 'white'}}>Pronunciation: </WordleText>
        <Text style={{fontSize: 15, fontFamily: 'Lato', fontWeight: 'bold', color: 'white' }}>{phonetics}</Text>
        </View>
        <Animated.View style={{transform:[{scale: btnAnimation}]}}>
          <Pressable
          onPressIn={()=>buttonPressIn(btnAnimation)}
          onPressOut={()=>buttonPressOut(btnAnimation)}
          onPress={()=>{playSound(audio)}}
          >
        <ImageBackground
        source={buttons.blueButton}
        style={{width: 30, aspectRatio: 1, alignItems: 'center', justifyContent: 'center'}}
        imageStyle={{resizeMode: 'stretch'}}
        >
          <Image
        source={icons.audioIcon}
        style={{width: 20, height: 15}}>
        </Image>
        </ImageBackground>
        </Pressable>
        </Animated.View>
        </View>
      </View>
    )
}


const playSound = async (audioURL: string) => {
  console.log(audioURL);
   try {
    SoundPlayer.playUrl(audioURL);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

type HeaderForMatchEndProps={
  profileData: any
  setXpPercent: (_xpPercent: string)=>void
  xpPercent: any
  experiencePointsBarRef: any
  maxXp: any
  coinsBarRef: any
  _xps: number

}

export const HeaderForMatchEnd:React.FC<HeaderForMatchEndProps>=({
  profileData, setXpPercent, maxXp, _xps,
  xpPercent, experiencePointsBarRef, coinsBarRef})=>{
  
  const settingsBtnScale=useRef(new Animated.Value(1)).current;
  const profileBtnScale=useRef(new Animated.Value(1)).current;
  const coinBtnScale = useRef(new Animated.Value(1)).current;

  const [settingsModalVisibility,setSettingsModalVisibility]=useState(false);
  const [profileSettingsModalVisiblity,setProfileSettingsModalVisiblity]=useState(false);
  const [addCoinModalVisiblity,setAddCoinModalVisiblity]=useState(false);
        
  return(
    <View style={styles.container}>
        <View style={styles.upperRow}>
            <View style={{flexDirection: 'row', gap: 5}}>    
            <Animated.View style={{transform:[{scale: settingsBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(settingsBtnScale)}}
                onPressOut={()=>{buttonPressOut(settingsBtnScale)}}
                onPress={()=>setSettingsModalVisibility(true)}
                >
                    <ImageBackground
                    source={buttons.blueButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.settingsIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>

            <Animated.View style={{transform:[{scale: profileBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(profileBtnScale)}}
                onPressOut={()=>{buttonPressOut(profileBtnScale)}}
                onPress={()=>setSettingsModalVisibility(true)}
                >
                    <ImageBackground
                    source={buttons.grayButton}
                    style={styles.settingsButton}
                    imageStyle={styles.buttonStyle}
                    >
                     <View style={{padding: 5}}>
                     <Image 
                     source={icons.profileIcon}
                     style={styles.settingsImage}
                     />   
                     </View>
                    </ImageBackground>
                </Pressable>
            </Animated.View>        
            </View>

            <View style={endgameStyles.xpBar} ref={experiencePointsBarRef}>
            <ImageBackground
            source={icons.xp}
            style={[styles.xpImage, {zIndex: 2}]}
            imageStyle={styles.xpImageStyle}>
            <OutlinedText text={profileData.playerLevel.toString()}/>
            </ImageBackground>
            <View
            style={endgameStyles.xpBarContainer}>
                <View style={[endgameStyles.xpBarFill, {width: `${xpPercent}%` as ViewStyle['width'] }]}/>
                <View style={[endgameStyles.xpBarFloat]}/>
                <View style={{flexDirection: 'row', marginTop: -17, alignSelf: 'center',}}>
                <CountUp
                    targetNumber={profileData.playerXP}
                    allowAnimation={_xps!=0}
                    style={{
                          fontSize: 15,
                          fontFamily: 'Wordlet-Regular',
                          letterSpacing: -0.5,
                }}
                onComplete={(finalValue)=>{setXpPercent(finalValue.toString());}}
                maxXp={maxXp} 
                />
                <WordleText style={{ fontSize: 15}}>/{maxXp}</WordleText>
                </View>
            </View>
            </View> 

            <Animated.View style={{transform:[{scale: coinBtnScale}]}}>
                <Pressable
                onPressIn={()=>{buttonPressIn(coinBtnScale)}}
                onPressOut={()=>{buttonPressOut(coinBtnScale)}}
                onPress={()=>setAddCoinModalVisiblity(true)}
                >
            <View style={styles.inGameCoin} ref={coinsBarRef}>
                <View style={styles.coinContainer}>
                <View style={styles.coinContainerInline}></View>
                {/*_xps!=0?*/<CountUp
                    targetNumber={profileData.playerCoins}
                    allowAnimation={_xps!=0}
                    style={{
                          fontSize: 15,
                          fontFamily: 'Wordlet-Regular',
                          marginTop: 3
                }}
                onComplete={(finalValue)=>{setXpPercent(finalValue.toString());}}
                maxXp={maxXp} 
                />/*:<WordleText>{profileData.playerCoins}</WordleText>*/
                }
                </View>
                <Image 
                source={icons.coin}
                style={styles.coinImage}>
                </Image>
            </View></Pressable>
        </Animated.View>
        </View>
        <SettingsModal
        visible={settingsModalVisibility}
        onclose={()=>setSettingsModalVisibility(false)}
        />

        <AddCoinModal
        visible={addCoinModalVisiblity}
        onclose={()=>setAddCoinModalVisiblity(false)}
        />

        <ProfileModal
        visible={profileSettingsModalVisiblity}
        onclose={()=>setProfileSettingsModalVisiblity(false)}
        />

    </View>
    )
}
