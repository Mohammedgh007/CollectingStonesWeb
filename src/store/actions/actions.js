export const SETUP_OFFLINE_GAME = "SETUP_OFFLINE_GAME";
export const SETUP_ONLINE_GAME = "SETUP_ONLINE_GAME";
export const PLAY_ACTION = "PLAY";
export const PLAY_RESTORE_ACTION = "PLAY_RESTORE";
export const WASTE_ACTION = "WASTE";
export const SWITCH_TURN = "SWITCH_TURN";
export const DRAW_CARDS = "DRAW_CARDS";
export const FINISH_GAME = "FINISH_GAME";
export const ADD_CARDS_TO_DECK = "ADD_CARDS_TO_DECK";

export const setupOfflineGame = (playersCount) => {
    return {
        type: SETUP_OFFLINE_GAME,
        num: playersCount
    };
};

export const setupOnlineGame = (playersInfo, currTurn, cardsNames) => {
    return {
        type: SETUP_ONLINE_GAME,
        playersInfo: playersInfo,
        currTurn: currTurn,
        cardsNames: cardsNames
    };
};

export const playAction = (playedCard, isPlayedCardPick, isPlayedSameCard,
     stolenCard, playerIndex, attackedField, opponentIndex) => {
    return {
        type: PLAY_ACTION,
        playedCard: playedCard,
        isPlayedCardPick: isPlayedCardPick,
        isPlayedSameCard: isPlayedSameCard,
        stolenCard: stolenCard,
        playerIndex: playerIndex,
        attackedField: attackedField,
        opponentIndex: opponentIndex
    };
};

export const playRestoreAction = (restoredStone, isPlayedSameCard) => {
    return {
        type: PLAY_RESTORE_ACTION, 
        restoredStone: restoredStone, 
        isPlayedSameCard: isPlayedSameCard
    };
};

export const wasteAction = (wastedCard, isPlayedCardPick, isPlayedSameCard, opponentIndex) => {
    return {
        type: WASTE_ACTION,
        card: wastedCard, 
        isPlayedCardPick: isPlayedCardPick,
        isPlayedSameCard: isPlayedSameCard,
        opponentIndex: opponentIndex
    };
};

export const switchTurnAction = () => {
    return {
        type: SWITCH_TURN
    };
};

export const drawCardAction = (cardsCount) => {
    return {
        type: DRAW_CARDS, 
        num: cardsCount
    };
};

export const finishGame = () => {
    return {
        type: FINISH_GAME
    };
};

export const addCardsToCardsDeck = (isOfflineMode, retrievedCard = null) => {
    return {
        type: ADD_CARDS_TO_DECK,
        isOfflineMode: isOfflineMode,
        // used only for online mode when retreiving cards from the server 
        retrievedCard: retrievedCard 
    };
}