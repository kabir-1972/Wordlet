//Types for my Screens
export type RootStackParamList = {
    Home: undefined;
    Wordle: undefined;
    Crosswords: undefined;
    MoreGames: undefined;
    VocabularyGames: undefined;

    BasicWordleMatch: {
        size: number;
    };
        
    ReversedWordleMatch: {
        size: number;
    };

    ShiftedWordleMatch: {
        size: number;
    };
    
    PreSolvedWordleMatch: {
        size: number;
    };

    MultiplayerGameLoading: undefined
    
    WordleMatchEnd: {
        targetWord: string;
        numberOfTries: number;
        gameName: string;
        winOrLose: number;
    }

    ArcadeCrosswordLevels: {
        size: number;
    };

    CrypticCrosswordLevels: {
        size: number;
    };

    DiagramlessCrosswordLevels: {
        size: number;
    };
    
    ThemedCrosswordLevels: undefined;
    CognateCrosswordLevels: undefined;
    RectangularCrosswordLevels: undefined;

    ArcadeCrosswordMatch: {
        size: number;
        level: number;
    };

    ThemedCrosswordMatch: {
        size: number;
        level: number;
    };

    CognateCrosswordMatch: {
        size: number;
        level: number;
    };

    DiagramlessCrosswordMatch: {
        size: number;
        level: number;
    };

    CrypticCrosswordMatch: {
        size: number;
        level: number;
    };

    RectangularCrosswordMatch: {
        size: number;
        level: number;
    };

    CrosswordMatchEnd: {
        size: number;
        gameName: string;
        level: number;
    }
    ConnecticoLevels: { size: number};

    ConnecticoMatch: {
        difficulty: number;
        level: number;

    };

    SearchUpOptions: undefined;
    SearchUpLevels: {
        difficulty: number,
        gameType: number,
    },

    SearchUpMatch: {
        difficulty: number,
        level: number,
        gameType: number,
    }

    AnagrammistMatch: {
        wordSize: number
    }
    GapFillsMatch: {
        wordSize: number
    }
    WordLadderMatch: {
        wordSize: number
    }
    CryptogramMatch: {
        level: number,
        heading: number
    }
    CryptogramLevels: undefined;
    WordChainsMatch: {
        type: number
    };
    WicWacWoeMatch: {
        type: number
    };

    MatchingLevels: undefined;
    MatchingMatch: {
        level: number
        heading: number
    }

    BoggleLevels: undefined;
    BoggleMatch: {level: number}
    
    FlashCardViewScreen: {name: string};
    FlashCardCreateScreen: undefined;
    FlashCardWordlet: undefined;
  };