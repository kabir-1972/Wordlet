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