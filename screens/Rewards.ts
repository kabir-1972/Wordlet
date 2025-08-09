export const Rewards={
    Connectico:{
        easy: {xp: 15, coin: 20},
        intermediate: {xp: 25, coin: 30},
        hard: {xp: 50, coin: 50},
        advanced: {xp: 100, coin: 100}
    },

    SearchUp: {
        Normal : {
        easy: {xp: 15, coin: 20},
        intermediate: {xp: 25, coin: 30},
        hard: {xp: 50, coin: 50},
        advanced: {xp: 100, coin: 100}
        },

        Reverse : {
        easy: {xp: 15, coin: 20},
        intermediate: {xp: 30, coin: 40},
        hard: {xp: 60, coin: 60},
        advanced: {xp: 120, coin: 120}
        },

        Diagonal : {
        easy: {xp: 20, coin: 30},
        intermediate: {xp: 30, coin: 50},
        hard: {xp: 80, coin: 80},
        advanced: {xp: 150, coin: 150}
        },

        Labryinth : {
        easy: {xp: 40, coin: 40},
        intermediate: {xp: 60, coin: 60},
        hard: {xp: 100, coin: 100},
        advanced: {xp: 150, coin: 150}
        },
    },

    Anagrammist:{
        4: {xp: 4, coin: 4},
        5: {xp: 10, coin: 10},
        6: {xp: 15, coin: 15},
        7: {xp: 20, coin: 20},
        8: {xp: 25, coin: 25},
        9: {xp: 30, coin: 30},  
    },

    GapFills:{
        4: {xp: 6, coin: 6},
        5: {xp: 12, coin: 12},
        6: {xp: 18, coin: 18},
        7: {xp: 25, coin: 25},
        8: {xp: 35, coin: 35},
        9: {xp: 50, coin: 50},  
    },

    WordLadder:{
        3: {xp: 15, coin: 15},
        4: {xp: 25, coin: 25},
        5: {xp: 35, coin: 35},
        6: {xp: 50, coin: 50},
    },

    Cryptogram:{
        xp: 50, coins: 50
    },

    WordChains:{
        1: {xp: 500, coins: 500},
        2: {xp: 0, coins: 0},
        3: {xp: 500, coins: 500},
        4: {xp: 500, coins: 500}
    },

    WicWacWoe:{
        1: {xp: 500, coins: 500},
        2: {xp: 0, coins: 0},
        3: {xp: 500, coins: 1000},
        4: {xp: 500, coins: 1000}
    },

    Matching:{
        xp: 10, coins: 0
    },

    Boggle:{
        "3": {xp: 5, coins: 1},
        "4": {xp: 8, coins: 4},
        "5": {xp: 12, coins: 8},
        "6": {xp: 20, coins: 12},
        "7": {xp: 25, coins: 20},
    },

    Collectico: {
        xp: 3, coins: 4
    },

    Ortographia: {
        xp: 2, coins: 2
    },

    Satietas: {
        xp: 3, coins: 3
    }

}

export const NoOfLevels={
    Connectico: {
        easy: 150,
        intermediate: 400,
        hard: 600,
        advanced: 600
    },

    SearchUp: {
        Normal : {
        easy: 400,
        intermediate: 400,
        hard: 400,
        advanced: 400
        },

        Reverse : {
        easy: 400,
        intermediate: 400,
        hard: 400,
        advanced: 400
        },

        Diagonal : {
        easy: 400,
        intermediate: 400,
        hard: 400,
        advanced: 400
        },

        Labryinth : {
        easy: 400,
        intermediate: 400,
        hard: 400,
        advanced: 400
        },
    },

    CryptoGram: 500
}

export const LevelsToUnlockLevels={
    SearchUp: {
        Reverse : {
        //Based on Normals
        easy: 100,
        intermediate: 100,
        hard: 100,
        advanced: 100
        },

        Diagonal : {
        //Based on Reverse    
        easy: 80,
        intermediate: 80,
        hard: 80,
        advanced: 80
        },

        Labryinth : {
        //Based on Normals 
        //easy and intermediate modes are auto unlocked
        easy: -1,
        intermediate: -1,   
        hard: 200,
        advanced: 200
        },
    },
    Anagrammist:{
        5: 75,
        6: 75,
        7: 60,
        8: 60, 
        9: 60
    },
    GapFills:{
        5: 75,
        6: 75,
        7: 60,
        8: 60, 
        9: 60
    },
    WordLadder:{
        4: 30,
        5: 40,
        6: 50
    },
}

export const noOfWords={
    WordLadder:{
        3: 4,
        4: 4,
        5: 5,
        6: 6
    }
}

export const Costs={
    WordLadderHelp:{
       3: 12,
       4: 20,
       5: 30,
       6: 40     
    },

    Cryptogram: 25
}

export const XpLevelToUnlockGameMode={
    WordChains:{
        1: 4,
        2: 5,
        3: 5,
        4: 6
    },

    WicWacWoe:{
        1: 4,
        2: 5,
        3: 5,
        4: 6
    }
}

export const DailyRewards={
    free: [20, 30, 45, 60, 75, 90, 100, 120, 135, 150, 200, 220, 250, 270, 300, 320, 350, 400, 450, 500],
    golden: [40, 50, 55, 80, 95, 110, 120, 140, 155, 170, 220, 240, 270, 290, 320, 340, 370, 420, 470, 600],
    points: [30, 60, 120, 160, 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 750, 800, 850, 900, 950, 1000]
}

export const HomeScreenRewards={
  1: {
    taskString: "Find 5 words playing Wordle",
    reward: "30",
    fill: 5
  }, 
  2: {
    taskString: "Solve 5 Crosswords",
    reward: "30",
    fill: 5
  },
  3: {
    taskString: "Create 1 Crossword",
    reward: "60",
    fill: 1,
  },
  4: {
    taskString: "Add 10 Words to Wordlet Bucket",
    reward: "50",
    fill: 1
  },
  5: {
    taskString: "Win 5 Multiplayer Wordle Matches",
    reward: "60",
    fill: 5,
  },
  6: {
    taskString: "Play 15 Mutiplayer Matches",
    reward: "100",
    fill: 15,
  },
  7: {
    taskString: "Play 25 Multiplayer Matches",
    reward: "200",
    fill: 25
  },
  8: {
    taskString: "Win 10 Multiplayer Wordle Matches",
    reward: "150",
    fill: 10
  },
  9: {
    taskString: "Place a bet of 300 coins",
    reward: "100",
    fill: 300
  },
  10: {
    taskString: "Solve 10 Connectico Puzzles",
    reward: "50",
    fill: 10
  },
  11: {
    taskString: "Read 25 Flashcards created by Others",
    reward: "40",
    fill: 25
  },
  12: {
    taskString: "Use 60 Words in WordChain",
    reward: "50",
    fill: 60
  },
  13: {
    taskString: "Solve 5 Cryptogram Puzzles",
    reward: "40",
    fill: 5
  },
  14: {
    taskString: "Play 5 Wic Wac Woe Matches",
    reward: "40",
    fill: 5
  },
  15: {
    taskString: "Win 10 Wic Wac Woe Matches",
    reward: "100",
    fill: 10
  },
  16: {
    taskString: "Win 50 Trophies playing Multiplayer Matches",
    reward: "100",
    fill: 50
  },
  17: {
    taskString: "Find 30 Words in SearchUp",
    reward: "60",
    fill: 30
  },
  18: {
    taskString: "Find 50 Words in SearchUp",
    reward: "120",
    fill: 50
  },
  19: {
    taskString: "Place a bet of 600 coins",
    reward: "200",
    fill: 600
  },
  20: {
    taskString: "Win 10 Multiplayer Matches",
    reward: "70",
    fill: 10
  },
  21: {
    taskString: "Win 15 Multiplayer Matches",
    reward: "100",
    fill: 15
  },
  22: {
    taskString: "Win 100 Trophies playing Multiplayer Matches",
    reward: "200",
    fill: 10
  },
  23: {
    taskString: "Find 10 words playing Wordle",
    reward: "60",
    fill: 10
  },
  24: {
    taskString: "Find 15 words playing Wordle",
    reward: "90",
    fill: 15
  },
  25: {
    taskString: "Read The Word of the Day",
    reward: "30",
    fill: 1
  }
}