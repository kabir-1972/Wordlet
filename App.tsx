import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
enableScreens(true);
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import WordleWindow from './screens/Wordle/WordleScreen';
import CrosswordsWindow from './screens/Crosswords/CrosswordScreen';

import MoreGamesWindow from './screens/MoreGamesScreen';

import BasicWordleMatch from './screens/Wordle/BasicWordleMatch';
import ReversedWordleMatch from './screens/Wordle/ReversedWordleMatch';
import ShiftedWordleMatch from './screens/Wordle/ShiftedWordleMatch';

import MultiplayerGameLoadingScreen from './screens/MultiplayerGameLoadingScreen';
import WordleMatchEnd from './screens/Wordle/Wordle-Match-End';

import ArcadeCrosswordLevels from './screens/Crosswords/ArcadeCrosswordLevels';
import CognateCrosswordLevels from './screens/Crosswords/CognateCrosswordLevels';
import ThemedCrosswordLevels from './screens/Crosswords/ThemedCrosswordLevels';

import ArcadeCrosswordMatch from './screens/Crosswords/ArcadeCrosswordMatch';
import CrosswordMatchEnd from './screens/Crosswords/Crossword-Match-End'

import Connectico from './screens/Connectico/ConnecticoLevels';
import ConnecticoMatches from './screens/Connectico/ConnecticoMatch';

import SearchUpOptions from './screens/SearchUp/SearchUpOptions';
import SearchUpLevels from './screens/SearchUp/SearchUpLevels';
import SearchUpMatch from './screens/SearchUp/SearchUpMatch';

import AnagrammistMatch from './screens/Anagrammist/AnagrammistMatch';
import GapFillsMatch from './screens/GapFills/GapfillsMatch';
import WordLadderMatch from './screens/WordLadder/WordLadderMatch';

import CryptogramMatch from './screens/Cryptograms/CryptogramsMatch';
import CrptogramLevels from './screens/Cryptograms/CryptogramsLevels'

import WordChainsMatch from './screens/WordChains/WordChainsMatch';
import WicWacWoeMatch from './screens/WicWacWoe/WicWacWoeMatch';

import VocabularyGames from  './screens/VocabularyGamesScreen';

import MatchingLevels from './screens/Matching/MatchingLevels';
import MatchingMatch from './screens/Matching/MatchingMatch';

import BoggleLevels from './screens/Boggle/BoggleLevels';
import BoggleMatch from './screens/Boggle/BoggleMatch';

import FlashCardView from './screens/FlashCards/FlashCardsViewScreen';
import FlashCardCreate from './screens/FlashCards/FlashCardsCreateScreen';
import FlashCardWordlet from './screens/FlashCards/FlashCard-Wordlet';



const Stack = createNativeStackNavigator();

export default function App() {
  return ( 
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Screen name="Home" component={HomeScreen} />

      {
        <Stack.Navigator initialRouteName="FlashCardWordlet"
        screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
      >
        
         <Stack.Screen
        name="Home"
        component={HomeScreen}
        />
        <Stack.Screen
        name="Wordle"
        component={WordleWindow}
        />
        <Stack.Screen
        name="Crosswords"
        component={CrosswordsWindow}
        />
        <Stack.Screen
        name="MoreGames"
        component={MoreGamesWindow}
        />

        <Stack.Screen
        name="BasicWordleMatch"
        component={BasicWordleMatch}
        />

        <Stack.Screen
        name="ReversedWordleMatch"
        component={ReversedWordleMatch}
        />

        <Stack.Screen
        name="ShiftedWordleMatch"
        component={ShiftedWordleMatch}
        />

        <Stack.Screen
        name="MultiplayerGameLoading"
        component={MultiplayerGameLoadingScreen}
        />

        <Stack.Screen
        name="WordleMatchEnd"
        component={WordleMatchEnd}
        />

        <Stack.Screen
        name="ArcadeCrosswordLevels"
        component={ArcadeCrosswordLevels}
        />

        <Stack.Screen
        name="ThemeCrosswordLevels"
        component={ThemedCrosswordLevels}
        />

        <Stack.Screen
        name="CognateCrosswordLevels"
        component={CognateCrosswordLevels}
        /> 

        <Stack.Screen
        name="ArcadeCrosswordMatch"
        component={ArcadeCrosswordMatch}
        />

        <Stack.Screen
        name="CrosswordMatchEnd"
        component={CrosswordMatchEnd}
        />

        <Stack.Screen
        name="ConnecticoLevels"
        component={Connectico}
        />

        <Stack.Screen
        name="ConnecticoMatch"
        component={ConnecticoMatches}
        />

        <Stack.Screen
        name="SearchUpOptions"
        component={SearchUpOptions}
        />

        <Stack.Screen
        name="SearchUpLevels"
        component={SearchUpLevels}
        />

        <Stack.Screen
        name="SearchUpMatch"
        component={SearchUpMatch}
        />

        <Stack.Screen
        name="AnagrammistMatch"
        component={AnagrammistMatch}
        />

        <Stack.Screen
        name="GapFillsMatch"
        component={GapFillsMatch}
        />

        <Stack.Screen
        name="WordLadderMatch"
        component={WordLadderMatch}
        />

        <Stack.Screen
        name="CryptogramMatch"
        component={CryptogramMatch}
        />

        <Stack.Screen
        name="CryptogramLevels"
        component={CrptogramLevels}
        />

        <Stack.Screen
        name="WordChainsMatch"
        component={WordChainsMatch}
        />

        <Stack.Screen
        name="WicWacWoeMatch"
        component={WicWacWoeMatch}
        />

      <Stack.Screen
      name="VocabularyGames"
      component={VocabularyGames}
      />

      <Stack.Screen
      name="MatchingLevels"
      component={MatchingLevels}
      />

      <Stack.Screen
      name="MatchingMatch"
      component={MatchingMatch}
      />

      <Stack.Screen
      name="BoggleLevels"
      component={BoggleLevels}
      />

      <Stack.Screen
      name="BoggleMatch"
      component={BoggleMatch}
      />

      <Stack.Screen
      name="FlashCardViewScreen"
      component={FlashCardView}
      />

      <Stack.Screen
      name="FlashCardCreateScreen"
      component={FlashCardCreate}
      />

      <Stack.Screen
      name="FlashCardWordlet"
      component={FlashCardWordlet}
      />


      </Stack.Navigator>}
    </NavigationContainer>
</GestureHandlerRootView>    
  );
}
