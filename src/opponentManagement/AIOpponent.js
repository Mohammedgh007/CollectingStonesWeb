/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This file contains a method that desides which card should be played/wasted
 based on the decision tree.

Decision nodes:
    1- approaching win: if AI needs one stone to win, and it has it.
        -> It will trys to play that stone; if there's no hand cards that supports this mode,
         it would recurse to either attackign mode or deffensive mode.
    2- attacking mode: if an opponent needs one more stone to win or there's a difference 
    of more than two stones on the fields.
       -> It will trys to target opponents trying to prevent an opponent from winning; 
       if there's no hand cards that supports this mode, it will act similarly to deffensive mode.
    3- deffensive mode: if the previous modes are not selected.
        -> It will try to play stones and shields; if there's no stones and shields available to
        be played, then it behave similarly to attacking mode.
    4- wasting mode: if there's no card to be played on the previous modes. 
        -> It will waste the least significant card among hand cards.
functions:
    + act(playerCoordinator: PlayerCoordinator, playerIndex: int, cardsBoards: PlayerBoard[], 
        turnCount: int[], setOnWaste: function, setOnPlatRestore: function, setOnPlay: function): 
        Object[] ->  it computes and performs the decision with the needed aurgements for GamePlay
        and managing the state in this order (it's the same as setOnPlay()) 
     playedCard, isPlayedSameCard, stolenCard, playerIndex, opponentField,
         opponentIndex.
    - selectMode(playerIndex: int, cardsBoards: PlayerBoard[]): String ->
     It decides which mode should be used and returns the result as a string. 
    - approachingWinAct(playerCoordinator: PlayerCoordinator, playerIndex: int,
         cardsBoards: PlayerBoard[], turnCount: int[]): Object[] -> It coomputes and returns the
         act/decision for approaching winning mode.
    - attackingAct(playerCoordinator: PlayerCoordinator, playerIndex: int, 
        cardsBoards: PlayerBoard[], turnCount: int[]): Object[] -> It coomputes and returns the 
        act/decision for attacking mode.
    - deffensiveAct(playerCoordinator: PlayerCoordinator, playerIndex: int,
         cardsBoards: PlayerBoard[], turnCount: int[]): Object[] -> It coomputes and returns 
         the act/decision for deffensive mode.
    - wastingAct(handCards: Card[]): Object[] -> It coomputes and returns the act/decision
     for wasting mode.
    - canBePlayed(playerCoordinator: PlayerCoordinator, card, playerIndex, cardsBoards): boolean ->
     It checks if the given card can be played.
    - canRestoreBePlayed(playerCoordinator: PlayerCoordinator, card: Card): boolean ->
     it's a helper function for canBePlay() that's used with restore stone card.
    - canAttackCardBePlayed(card, playerIndex, cardsBoards): boolean -> 
     it's a helper function for canBePlay(), it returns true if the attacking card can be
     played.
    - playCard(playedCard: Card, playerCoordinator: PlayerCoordinator, playerIndex: int,  
        cardsBoards: PlayerBoard[], targetOpponent: int, turnCount: int[]) -> Object[] -> 
        it handles using the right function for playing the card.
    - playStone(playerCoordinator: PlayerCoordinator, stone: Card): Object[] -> It computes and returns the decision/act for
     playing the given stone.
    - playRestoreStone(playerCoordinator: PlayerCoordinator): Object[] -> It computes and returns the decision for
     playing the card "restore broken stone"
    - playShield(playerCoordinator: PlayerCoordinator, shield: Card): Object[] -> It computes and returns the decision/act for
     playing the given shield. 
    - playPreventTurn( targetOpponent: int, turnCount: int[]): Object[] -> 
        It computes and returns the decision/act for playing the card "prevent next turn". 
    - playShieldDestroyer(layerCoordinator: PlayerCoordinator, playerIndex: int,  
        cardsBoards: PlayerBoard[], targetOpponent: int): Object[] -> 
        It computes and returns the decision/act for playing the card "shield destroyer". 
    - playHammer(layerCoordinator: PlayerCoordinator, playerIndex: int,  
        cardsBoards: PlayerBoard[], targetOpponent: int): Object[] -> 
        It computes and returns the decision/act for playing the card "hammer". 
    - playStoneStealling(layerCoordinator: PlayerCoordinator, playerIndex: int,  
        cardsBoards: PlayerBoard[], targetOpponent: int): Object[] -> 
        It computes and returns the decision/act for playing the card "normal shield Stealling"
        or "mirror shield stealling" 
    - playStoneStealling(steallingCard: Card, layerCoordinator: PlayerCoordinator, playerIndex: int,  
        cardsBoards: PlayerBoard[], targetOpponent: int): Object[] -> 
        It computes and returns the decision/act for playing the card "stone Stealling". 
    - hasCard(handCards: Card[], card: card): boolean -> returns true if handCards has the given
     card. 
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import Card from "../store/objects/Card.js";
import PlayerBoard from "../store/objects/PlayerBoard.js";

const APROACHING_WINNING_CARD = [ // The order signifies priority of playing cards if applicable
    Card.PLAY_TWICE,
    Card.ORANGE_STONE,
    Card.BLUE_STONE,
    Card.GREEN_STONE,
    Card.RED_STONE,
    Card.MULTICOLOR_STONE,
    Card.RESTORE_STONE,
    Card.STONE_STEALLING,
    Card.ABSOLUTE_SHIELD,
    Card.MIRROR_SHIELD_STEALLING,
    Card.NORMAL_SHIELD_STEALLING,
    Card.NORMAL_SHIELD,
    Card.MIRROR_SHIELD,
    Card.SHIELD_DETROYER,
    Card.HAMMER,
    Card.PREVENT_NEXT_TURN 
    
];

const ATTACKING_CARDS_NAMES = [ // The order signifies priority of playing cards if found
    Card.PLAY_TWICE,
    Card.STONE_STEALLING,
    Card.HAMMER,
    Card.SHIELD_DETROYER,
    Card.MIRROR_SHIELD_STEALLING,
    Card.NORMAL_SHIELD_STEALLING,
    Card.PREVENT_NEXT_TURN,
    Card.ABSOLUTE_SHIELD,
    Card.NORMAL_SHIELD,
    Card.MIRROR_SHIELD, 
    Card.ORANGE_STONE,
    Card.BLUE_STONE,
    Card.GREEN_STONE,
    Card.RED_STONE,
    Card.MULTICOLOR_STONE, 
    Card.RESTORE_STONE
];

const DEFFENSIVE_CARDS_NAMES = [ // The order signifies priority of playing cards if found
    Card.PLAY_TWICE,
    Card.ORANGE_STONE,
    Card.BLUE_STONE,
    Card.GREEN_STONE,
    Card.RED_STONE,
    Card.MULTICOLOR_STONE,
    Card.STONE_STEALLING,
    Card.MIRROR_SHIELD_STEALLING,
    Card.NORMAL_SHIELD_STEALLING,
    Card.ABSOLUTE_SHIELD,
    Card.NORMAL_SHIELD,
    Card.MIRROR_SHIELD,
    Card.HAMMER,
    Card.SHIELD_DETROYER,
    Card.RESTORE_STONE,
    Card.PREVENT_NEXT_TURN
];

const WASTING_CARDS_NAMES= [ // the order signifies which card should be wasted first.
    Card.SAME_CARD,
    Card.PICK_CARD,
    Card.HAMMER,
    Card.PREVENT_NEXT_TURN, 
    Card.MIRROR_SHIELD_STEALLING,
    Card.NORMAL_SHIELD_STEALLING,
    Card.SHIELD_DETROYER,
    Card.STONE_STEALLING,
    Card.PLAY_TWICE,
    Card.RESTORE_STONE,
    Card.ORANGE_STONE,
    Card.BLUE_STONE,
    Card.GREEN_STONE,
    Card.MULTICOLOR_STONE,
    Card.RED_STONE
]

const MODES = {
    APPROACHING_WIN: "approaching win",
    ATTACKING: "attacking",
    DEFFENSIVE: "deffensive",
    WASTING: "wasting"

};

/**
 * It computes and performs the action for the AI.
 * @param {PlayerCoordinator} playerCoordinator is object that holds all of the information
 *  about the player in state.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing. 
 * @param {function} setOnWaste is the function that act() should use when the act is 
 * wasting a card. 
 * @param {function} setOnPlatRestore is the function that act() should use when the act is 
 * restoring a stone.
 * @param {function} setOnPlay is the function that act() should call when the act is playing
 * a card.
 * @return [String, Card, params...] Card's instance is the card that will be played/wasted and
 *  String's instance is either "waste", "play", or "playRestore". params can be used as aditional
 *  paramters needed for setOnPlay() in GamePlay.js
 */
export function act(playerCoordinator, playerIndex, cardsBoards, turnCount, 
    setOnWaste, setOnPlatRestore, setOnPlay) {
    let handCards = playerCoordinator.player.cards
    let action;
    switch(selectMode(playerIndex, cardsBoards)) {
        case MODES.APPROACHING_WIN:
            action = approachingWinAct(playerCoordinator, playerIndex, cardsBoards, turnCount);
        break;
        case MODES.ATTACKING:
            action = attackingAct(playerCoordinator, playerIndex, cardsBoards, turnCount);
        break;
        case MODES.DEFFENSIVE:
            action = deffensiveAct(playerCoordinator, playerIndex, cardsBoards, turnCount);
        break;            
    }
    action[4] = playerIndex;
    
    // perform the action
    // delay the act, so that users can notice easily what AI opponents played/wasted.
    setTimeout(() => {
        if (action[0] === "waste") {
            setOnWaste(action[1], false, -1);
        } else if (action[0] === "playRestore") {
            setOnPlatRestore(action[1]);
        }else {
            setOnPlay(action[1],action[2], action[3], action[4],
                 action[5], action[6]);
            // if the opponent waste the stolen stone/shield
            if (action[1].cardName.includes("stealling") && action[3].setNum === -1) {
                setOnWaste(action[3], true, -1);
            }
        }
    }, 3000);
};


/**
 * It selects the decition node.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @return {String} that refers to the decision node, which is either "aproaching win", 
 * "attacking", or "deffensive". 
 */
function selectMode(playerIndex, cardsBoards) {
    let selectedMode = MODES.DEFFENSIVE;
    let stonesCount = 0;
    // check if AI is approaching the winning by counting the placed stones on the fields.
    for (let feild = 0; feild < cardsBoards[playerIndex].cardsStacks.length; feild++) {
        if (cardsBoards[playerIndex].cardsStacks[feild].length !== 0 &&
             cardsBoards[playerIndex].cardsStacks[feild][0].cardName.includes("stone")) {
                stonesCount += 1;
             }
    }
    if (stonesCount === 3) {
        return MODES.APPROACHING_WIN;
    }

    // check if there's opponent with 3 played stones or 2 more played stones
    let oppoentStonesCount;
    for (let board = 0; board < cardsBoards.length; board++) { // check all cards boards/fields objects
        oppoentStonesCount = 0;
        if (board !== playerIndex) {
            for (let feild = 0; feild < cardsBoards[board].cardsStacks.length; feild++) { // check each board/field
                if (cardsBoards[board].cardsStacks[feild].length !== 0 &&
                     cardsBoards[board].cardsStacks[feild][0].cardName.includes("stone")) {
                        oppoentStonesCount += 1;
                     }
                if (oppoentStonesCount == 3 || oppoentStonesCount - 2 >= stonesCount) {
                    return MODES.ATTACKING;
                }
            }
        }
    }
    return selectedMode;
}




/**
 * It computes the decision that AI will make in approaching winning mode.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing.
 * @return {Object} it returns an array that will be used to communicate with GamePlay.js 
 * for making the act effective on state and view. 
 */
function approachingWinAct(playerCoordinator, playerIndex, cardsBoards, turnCount) {
    let handCards = playerCoordinator.player.cards;
    let currCard;
    for (let i = 0; i < APROACHING_WINNING_CARD.length; i++) {
        currCard = new Card(APROACHING_WINNING_CARD[i], 0);
        if (hasCard(handCards, currCard) &&
         canBePlayed(playerCoordinator, currCard, playerIndex, cardsBoards)) {
            return playCard(currCard, playerCoordinator, playerIndex, cardsBoards, 0, turnCount);
         }
    }
    // if it could not find a card to play, then it will try to find the least worse card to be wasted
    return wastingAct(handCards);
}

/**
 * It computes the decision that AI will make in attacking mode.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing.
 * @return {Object} it returns an array that will be used to communicate with GamePlay.js 
 * for making the act effective on state and view. 
 */
function attackingAct(playerCoordinator, playerIndex, cardsBoards, turnCount) {
    // count my number of stones
    let myStonesCount = 0;
    for (let field of cardsBoards[playerIndex].cardsStacks) {
        if (field.length !== 0 && field[0].cardName.includes("stone")) {
            myStonesCount+= 1;
        }
    }
    let targetOpponent;
    // first find an opponet who played three stones or two additional stone from me
    let stonesCount;
    // it's used to refer to the opponent that has two more stones, so that it never prioritize it
    // over someone with three stones
    let stonesCount2Opponent = -1;
    let handCards = playerCoordinator.player.cards;
    let currCard;
    let action;
    for (let opponent = 0; opponent < cardsBoards.length; opponent++) {
        if (opponent !== playerIndex) {
            stonesCount = 0;
            for (let field of cardsBoards[opponent].cardsStacks) {
                if (field.length !== 0 && field[0].cardName.includes("stone")) {
                    stonesCount+= 1;
                }
            }
            // second targets this opponent if it has three stones
            if (stonesCount === 3) {
                targetOpponent = opponent;
                for (let i = 0; i < ATTACKING_CARDS_NAMES.length; i++) {
                    currCard = new Card(ATTACKING_CARDS_NAMES[i], 0);
                    if (hasCard(handCards, currCard) &&
                    canBePlayed(playerCoordinator, currCard, playerIndex, cardsBoards)) {
                        action =  playCard(currCard, playerCoordinator, playerIndex,
                             cardsBoards, targetOpponent, turnCount);
                        // play it only if it target the targetOpponent
                        if (action[6] === targetOpponent) {
                            return action;
                        }
                    }
                }
            } else if (myStonesCount + 2 === stonesCount) {
                // only target an opponent with two more stones
                // if it could not target an opponent with 3 stones
                stonesCount2Opponent = opponent;
            } 
        }
    }
    // if there was no play targetting an opponent with three stones, then target opponents
    // that have two more stone that me.
    if (stonesCount2Opponent !== -1) {
        // target the opponent with two more stones at the last iteration
        targetOpponent = stonesCount2Opponent;
        for (let i = 0; i < ATTACKING_CARDS_NAMES.length; i++) {
            currCard = new Card(ATTACKING_CARDS_NAMES[i], 0);
            if (hasCard(handCards, currCard) &&
            canBePlayed(playerCoordinator, currCard, playerIndex, cardsBoards)) {
                action =  playCard(currCard, playerCoordinator, playerIndex,
                     cardsBoards, targetOpponent, turnCount);
                // play it only if it target the targetOpponent
                if (action[6] === targetOpponent) {
                    return action;
                }
            }
        }
    }
    // if it could not target an opponent with 3 cards, then it would play a card if possible
    // whether it targets someone or not
    for (let i = 0; i < ATTACKING_CARDS_NAMES.length; i++) {
        currCard = new Card(ATTACKING_CARDS_NAMES[i], 0);
        if (hasCard(handCards, currCard) &&
         canBePlayed(playerCoordinator, currCard, playerIndex, cardsBoards)) {
            return playCard(currCard, playerCoordinator, playerIndex, cardsBoards, 0, turnCount);
         }
    }

    // if it could not find a card to play, then it will try to find the least worse card to be wasted
    return wastingAct(handCards);
}

/**
 * It computes the decision that AI will make in deffensive mode.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing.
 * @return {Object} it returns an array that will be used to communicate with GamePlay.js 
 * for making the act effective on state and view. 
 */
function deffensiveAct(playerCoordinator, playerIndex, cardsBoards, turnCount) {
    let handCards = playerCoordinator.player.cards;
    let currCard;
    for (let i = 0; i < DEFFENSIVE_CARDS_NAMES.length; i++) {
        currCard = new Card(DEFFENSIVE_CARDS_NAMES[i], 0);
        if (hasCard(handCards, currCard) &&
         canBePlayed(playerCoordinator, currCard, playerIndex, cardsBoards)) {
            return playCard(currCard, playerCoordinator, playerIndex, cardsBoards, 0, turnCount);
         }
    }
    // if it could not find a card to play, then it will try to find the least worse card to be wasted
    return wastingAct(handCards);
}

/**
 * It computes the decision that AI will make in wasting mode.
 * @param {Card[]} handCards is an array of the hand cards.
 * @return {Object} it returns an array that will be used to communicate with GamePlay.js 
 * for making the act effective on state and view. 
 */
function wastingAct(handCards) {
    let currCard;
    for (let i = 0; i < WASTING_CARDS_NAMES.length; i++) {
        currCard = new Card(WASTING_CARDS_NAMES[i], 0);
        if (hasCard(handCards, currCard) ) {
            return ["waste", currCard, false, null, null, -1, -1];
         }
    }
}

/**
 * It decides whether or not the given card can be played.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {Card[]} card is the card object that will be testified.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @return {boolean} it returns true if it can be played.
 */
function canBePlayed(playerCoordinator, card, playerIndex, cardsBoards) {
    if (card.cardName.includes("stone") && card.cardName !== Card.STONE_STEALLING &&
    card.cardName !== Card.RESTORE_STONE) {
        return playerCoordinator.cardsBoard.listValidPlay(null, card).length !== 0;
    } else if (card.cardName === Card.NORMAL_SHIELD || card.cardName === Card.MIRROR_SHIELD
        || card.cardName === Card.ABSOLUTE_SHIELD) {
        return true;
    } else if (card.cardName === Card.RESTORE_STONE) {
        return canRestoreBePlayed(playerCoordinator, card);
    } else if (card.cardName === Card.PREVENT_NEXT_TURN) {
        return true;
    } else if (card.cardName === Card.PLAY_TWICE) {
        return !playerCoordinator.hasPlayTwice;
    } else {
        return canAttackCardBePlayed(card, playerIndex, cardsBoards);
    }
}

/**
 * It helps canBePlay() to decide whether or not the restore card can be played.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {Card[]} card is the card object that will be testified.
 * @return {boolean} it returns true if it can be played.
 */
function canRestoreBePlayed(playerCoordinator, card) {
    // return true if there's a broken stone that can be played
    let tempCard = new Card(Card.RED_STONE, 0);
    if (playerCoordinator.hasBrokenRedStone && // null is used b\c aurgments will not be used
        canBePlayed(playerCoordinator, tempCard, null, null)) {
            return true;
    }
    tempCard = new Card(Card.ORANGE_STONE, 0);
    if (playerCoordinator.hasBrokenOrangeStone && 
        canBePlayed(playerCoordinator, tempCard, null, null)) {
            return true;
    }
    tempCard = new Card(Card.BLUE_STONE, 0);
    if (playerCoordinator.hasBrokenBlueStone && 
        canBePlayed(playerCoordinator, tempCard, null, null)) {
            return true;
    }
    tempCard = new Card(Card.GREEN_STONE, 0);
    if (playerCoordinator.hasBrokenGreenStone && 
        canBePlayed(playerCoordinator, tempCard, null, null)) {
            return true;
    }
    return false;
}


/**
 * It decides whether or not the given card can be played. It's a helper function
 * for canBePlay()
 * @param {Card[]} card is the card object that will be testified.
 * @param {int} playerIndex is the index of this AI in playersData. 
 * @param {PlayerBoard[]} cardsBoards inludes all of the boards/fields in the game.
 * @return {boolean} it returns true if it can be played.
 */
function canAttackCardBePlayed(card, playerIndex, cardsBoards){
    for (let board = 0; board < cardsBoards.length; board++) {
        if (board !== playerIndex && 
            cardsBoards[playerIndex].listValidPlay(cardsBoards[board], card).length !== 0) {
            return true;
        }
    }
    return false;
}

/**
 * It decides which play...() should be called, and then it returned the result of 
 * the called function.
 * @param {Card} playedCard is the card that should be played.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {int} playerIndex is the index of this AI in playersData.
 * @param {PlayerBoard} cardsBoards inludes all of the boards/fields in the game.
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing.
 * @return {Object[]} it returns the result of the called function.
 */
function playCard(playedCard, playerCoordinator, playerIndex,cardsBoards, targetOpponent, turnCount) {
    if (playedCard.cardName.includes("stone") && playedCard.cardName !== Card.STONE_STEALLING &&
    playedCard.cardName !== Card.RESTORE_STONE) {
        return playStone(playerCoordinator, playedCard);
    } else if (playedCard.cardName === Card.NORMAL_SHIELD || playedCard.cardName === Card.MIRROR_SHIELD
        || playedCard.cardName === Card.ABSOLUTE_SHIELD) {
        return playShield(playerCoordinator, playedCard);
    } else if (playedCard.cardName === Card.RESTORE_STONE) {
        return playRestoreStone(playerCoordinator);
    } else if (playedCard.cardName === Card.PREVENT_NEXT_TURN) {
        return playPreventTurn(targetOpponent, turnCount);
    } else if (playedCard.cardName === Card.SHIELD_DETROYER) {
        return playShieldDestroyer(playerCoordinator, playerIndex,cardsBoards, targetOpponent);
    } else if (playedCard.cardName === Card.HAMMER) {
        return playHammer( playerCoordinator, playerIndex,cardsBoards, targetOpponent);
    } else if (playedCard.cardName === Card.PLAY_TWICE) {
        let playTwice = new Card(Card.PLAY_TWICE, 0);
        return ["play", playTwice, false, null, null, -1, -1];
    } else if (playedCard.cardName === Card.STONE_STEALLING) {
        return playStoneStealling(playerCoordinator, playerIndex,cardsBoards, targetOpponent);
    } else if (playedCard.cardName.includes("stealling")) {
        return playShieldStealling(playedCard, playerCoordinator, playerIndex,cardsBoards, targetOpponent);
    }
}

/**
 * It computes the act of playing the given stone.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {Card} stone is the card object of the stone that will be played.
 * @returns all the paramters needed for setOnPlay() except playerIndex.
 */
function playStone(playerCoordinator, stone) {
    let availableSpots = playerCoordinator.cardsBoard.listValidPlay(null, stone);
    // if there's one spot to be placed in, then play in it
    if (availableSpots.length == 1) { 
        stone.setNum = availableSpots[0]; 
    } else { // otherwise select the most protected one by shields.
        let maxShieldsField = availableSpots[0];
        let maxShieldsNum = playerCoordinator.cardsBoard.cardsStacks[availableSpots[0]].length;
        for (let field of availableSpots) {
            if (maxShieldsNum < playerCoordinator.cardsBoard.cardsStacks[field].length) {
                maxShieldsField = field;
                maxShieldsNum = playerCoordinator.cardsBoard.cardsStacks[field].length;
            }
        }
        stone.setNum = maxShieldsField; 
    }
    return ["play", stone, false, null, null, -1, -1];
}

/**
 * It computes the act of playing the card "restore stone".
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @returns all the paramters needed for setOnPlay() except playerIndex.
 */
function playRestoreStone(playerCoordinator) {
    // finding an available stone to be played from the broken stones
    let stonesNames = [Card.RED_STONE, Card.ORANGE_STONE, Card.BLUE_STONE, Card.GREEN_STONE];
    let areBroken = [
        playerCoordinator.hasBrokenRedStone,
        playerCoordinator.hasBrokenOrangeStone,
        playerCoordinator.hasBrokenBlueStone,
        playerCoordinator.hasBrokenGreenStone
    ];
    let hasFoundField = false;
    let i = 0;
    let stone;
    while(!hasFoundField) {
        stone = new Card(stonesNames[i], 0);
        if (areBroken[i] && canBePlayed(playerCoordinator, stone, null, null)) {
            hasFoundField = true;
        } else {
            i++;
        }
    }
    let action = playStone(playerCoordinator, stone);
    action[0]= "playRestore";
    return action;
}

/**
 * It computes the act of playing the given shield.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player.
 * @param {Card} stone is the card object of the stone that will be played.
 * @returns all the paramters needed for setOnPlay() except playerIndex.
 */
function playShield(playerCoordinator, shield) {
    // It decides which field based on the minimum number of shields or if there's
    // a stone without a shield
    let leastprotectedField = 0;
    let leastShieldsNum = 1000000;
    let shieldsNum;
    for (let field = 0; field < playerCoordinator.cardsBoard.cardsStacks.length; field++) {
        // shieldsNum exclude stones
        shieldsNum = (playerCoordinator.cardsBoard.cardsStacks[field].length !== 0 && 
            playerCoordinator.cardsBoard.cardsStacks[field][0].cardName.includes("stone")) 
            ? playerCoordinator.cardsBoard.cardsStacks[field].length - 1
            : playerCoordinator.cardsBoard.cardsStacks[field].length;
        if (leastShieldsNum > shieldsNum) { // assignning the min number of shields
            leastprotectedField = field;
            leastShieldsNum = shieldsNum;
        }
        // checking if there's a stone with no shields.
        if (shieldsNum === 0 && (playerCoordinator.cardsBoard.cardsStacks[field].length === 1 && 
            playerCoordinator.cardsBoard.cardsStacks[field][0].cardName.includes("stone"))) {
                shield.setNum = field;
                return ["play", shield, false, null, null, -1, -1];
            }
    }
    shield.setNum = leastprotectedField;
    return ["play", shield, false, null, null, -1, -1];
}


/**
 * It computes the act of the the card card "prevent next turn"
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @param {int[]} turnCount is an array that indicates if a player can play/waste one card or 
 *  more per turn, or if the player has been prevented for playing.
 * @return all the paramters needed for setOnPlay() except playerIndex
 */
function playPreventTurn(targetOpponent, turnCount) {
    let preventCard = new Card(Card.PREVENT_NEXT_TURN, 0);
    // check if the perfered target opponent has not been affected twice by "prevent next turn"
    if(turnCount[targetOpponent] >= 0 ) {
        return ["play", preventCard, false, null, null, -1, targetOpponent];    
    } else { // otherwise, target the opponent that has the least damage from "prevent next turn"
        let leastDamaged = 0;
        let leastCount = 100000;
        for (let player = 0; player < turnCount.length; player++) {
            if (leastCount > turnCount[player] || leastDamaged === targetOpponent) {
                leastDamaged = player;
                leastCount = turnCount[player];
            }
        }
        return ["play", preventCard, false, null, null, -1, leastDamaged];
    }
}

/**
 * It computes the act of playing the card "shield destroyer"
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player. 
 * @param {int} playerIndex is the index of this AI in playersData.
 * @param {PlayerBoard} cardsBoards inludes all of the boards/fields in the game.
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @return all the paramters needed for setOnPlay() except playerIndex
 */
function playShieldDestroyer(playerCoordinator, playerIndex,cardsBoards, targetOpponent) {
    let shieldDestroyer = new Card(Card.SHIELD_DETROYER, 0);
    // first trying to destroy absolute shield from the target opponent
    let lastIndex;
    for (let field = 0; field < cardsBoards[targetOpponent].cardsStacks.length; field++) {
        lastIndex = cardsBoards[targetOpponent].cardsStacks[field].length - 1;
        if (lastIndex !== -1 &&
            cardsBoards[targetOpponent].cardsStacks[field][lastIndex].cardName === Card.ABSOLUTE_SHIELD) {
                return ["play", shieldDestroyer, false, null, null, field, targetOpponent];
        }
    }
    // second trying to destroy a shield  at the field with minimum number of shields 
    // if found from the target opponent
    let allowedFields = playerCoordinator.listValidPlay(cardsBoards[targetOpponent],
         null, shieldDestroyer);
    let shieldsNum;
    let leastNumShield = 10000000;
    let leastprotectedField = -1;
    for (let field of allowedFields) {
        // shieldsNum exclude stones from counting the number of shields in field i.
        shieldsNum = (cardsBoards[targetOpponent].cardsStacks[field].length !== 0 && 
            cardsBoards[targetOpponent].cardsStacks[field][0].cardName.includes("stone")) 
            ? cardsBoards[targetOpponent].cardsStacks[field].length - 1
            : cardsBoards[targetOpponent].cardsStacks[field].length;
        if (leastNumShield > shieldsNum) { // assignning the min number of shields
            leastprotectedField = field;
            leastNumShield = shieldsNum;
        }
    }
    if (leastprotectedField !== -1) {
        return ["play", shieldDestroyer, false, null, null, leastprotectedField, targetOpponent];
    }
    // third trying to destroy absolute shield from other opponents
    for (let opponent = 0; opponent < cardsBoards.length; opponent++) {
        if (opponent !== playerIndex) {
            for (let field = 0; field < cardsBoards[opponent].cardsStacks.length; field++) {
                lastIndex = cardsBoards[opponent].cardsStacks[field].length - 1;
                if (lastIndex !== -1 &&
                    cardsBoards[opponent].cardsStacks[field][lastIndex].cardName === Card.ABSOLUTE_SHIELD) {
                        return ["play", shieldDestroyer, false, null, null, field, opponent];
                }
            }
        }
    }
    // fourth trying to target any opponent shield
    leastNumShield = 1000000;
    for (let opponent = 0; opponent < cardsBoards.length; opponent++) {
        if (opponent !== playerIndex) {
            allowedFields = playerCoordinator.listValidPlay(cardsBoards[opponent],
                null, shieldDestroyer);
            for (let field of allowedFields) {
                // shieldsNum exclude stones from counting the number of shields in field i.
                shieldsNum = (cardsBoards[opponent].cardsStacks[field].length !== 0 && 
                    cardsBoards[opponent].cardsStacks[field][0].cardName.includes("stone")) 
                    ? cardsBoards[opponent].cardsStacks[field].length - 1
                    : cardsBoards[opponent].cardsStacks[field].length;
                if (leastNumShield > shieldsNum) { // assignning the min number of shields
                    leastprotectedField = field;
                    leastNumShield = shieldsNum;
                }
            }
            if (leastprotectedField !== -1) {
                return ["play", shieldDestroyer, false, null, null, leastprotectedField, opponent];
            }
        }
    }
}

/**
 * It computes the act of playing the card "hammer"
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player. 
 * @param {int} playerIndex is the index of this AI in playersData.
 * @param {PlayerBoard} cardsBoards inludes all of the boards/fields in the game.
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @return all the paramters needed for setOnPlay() except playerIndex
 */
function playHammer( playerCoordinator, playerIndex,cardsBoards, targetOpponent) {
    let hammer = new Card(Card.HAMMER, 0);
    // first trying to destroy a stone or shield at target opponent
    let allowedFields = playerCoordinator.listValidPlay(cardsBoards[targetOpponent], null, hammer);
    let lastIndex;
    let shieldsNum;
    let leastShieldNum = 10000;
    let leastShieldNumIndex = -1;
    for (let field of allowedFields) {
        // shieldsNum exclude stones from counting the number of shields in field i.
        shieldsNum = (cardsBoards[targetOpponent].cardsStacks[field][0].cardName.includes("stone")) 
            ? cardsBoards[targetOpponent].cardsStacks[field].length - 1
            : cardsBoards[targetOpponent].cardsStacks[field].length;
        lastIndex = cardsBoards[targetOpponent].cardsStacks[field].length - 1;
        if (leastShieldNum > shieldsNum) {
            leastShieldNum = shieldsNum;
            leastShieldNumIndex = field;
        }
    }
    if (leastShieldNumIndex !== -1) {
        return ["play", hammer, false, null, null, leastShieldNumIndex, targetOpponent];
    }
    // second try to target the least number of shield from other opponents
    leastShieldNum = 10000;
    let leastShieldsOpponent;
    for (let opponent = 0; opponent < cardsBoards.length; opponent++) {
        if (opponent !== playerIndex) {
            allowedFields = playerCoordinator.listValidPlay(cardsBoards[opponent], null, hammer);
            for (let field of allowedFields) {
                // shieldsNum exclude stones from counting the number of shields in field i.
                shieldsNum = (cardsBoards[opponent].cardsStacks[field][0].cardName.includes("stone")) 
                    ? cardsBoards[opponent].cardsStacks[field].length - 1
                    : cardsBoards[opponent].cardsStacks[field].length;
                lastIndex = cardsBoards[opponent].cardsStacks[field].length - 1;
                if (leastShieldNum > shieldsNum) {
                    leastShieldNum = shieldsNum;
                    leastShieldNumIndex = field;
                    leastShieldsOpponent = opponent;
                }
            }
        }
    }
    return ["play", hammer, false, null, null, leastShieldNumIndex, leastShieldsOpponent];
}


/**
 * It computes the act of playing the card "stone stealling"
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player. 
 * @param {int} playerIndex is the index of this AI in playersData.
 * @param {PlayerBoard} cardsBoards inludes all of the boards/fields in the game.
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @return all the paramters needed for setOnPlay() except playerIndex
 */
function playStoneStealling(playerCoordinator, playerIndex,cardsBoards, targetOpponent) {
    let stoneStealling = new Card(Card.STONE_STEALLING, 0);
    let stolenStone;
    // first targeting the stone that has the max number of shields protecting for target opponent
    let shieldsNum;
    let maxShieldNum = 0;
    let allowedFields = playerCoordinator.listValidPlay(cardsBoards[targetOpponent], null,
        stoneStealling);
    let maxShieldsField = -1; 
    for (let field of allowedFields) {
        shieldsNum = (cardsBoards[targetOpponent].cardsStacks[field][0].cardName.includes("stone")) 
                    ? cardsBoards[targetOpponent].cardsStacks[field].length - 1
                    : cardsBoards[targetOpponent].cardsStacks[field].length;
        if (shieldsNum > maxShieldNum || maxShieldNum === 0) {
            maxShieldNum = shieldsNum;
            maxShieldsField = field;
        }
    }
    if (maxShieldsField !== -1) {
        let stolenStone = cardsBoards[targetOpponent].cardsStacks[maxShieldsField][0].clone();
        stolenStone.setNum = 0;
        if (canBePlayed(playerCoordinator, stolenStone, playerIndex, cardsBoards)) {
            stolenStone.setNum = playStone(playerCoordinator, stolenStone)[1].setNum;
        } else {
            stolenStone.setNum = -1;
        }
        return ["play", stoneStealling, false, stolenStone, null, maxShieldsField, targetOpponent]; 
    }
    // second targeting an opponent with the max number of shield
    maxShieldNum = 0;
    let maxShieldsOpponent = -1;
    for (let oppoent = 0; oppoent < cardsBoards.length; oppoent++) {
        if (oppoent !== playerIndex) {
            allowedFields = playerCoordinator.listValidPlay(cardsBoards[oppoent], null,
                stoneStealling);
            for (let field of allowedFields) {
                shieldsNum = (cardsBoards[oppoent].cardsStacks[field][0].cardName.includes("stone")) 
                            ? cardsBoards[oppoent].cardsStacks[field].length - 1
                            : cardsBoards[oppoent].cardsStacks[field].length;
                if (shieldsNum > maxShieldNum || maxShieldNum === 0) {
                    maxShieldNum = shieldsNum;
                    maxShieldsField = field;
                    maxShieldsOpponent = oppoent;
                }
                // use this stone if it can be played
                stolenStone = cardsBoards[oppoent]
                .cardsStacks[field][0].clone();
                stolenStone.setNum = 0;
                if (canBePlayed(playerCoordinator, stolenStone, playerIndex, cardsBoards)) {
                    stolenStone.setNum = playStone(playerCoordinator, stolenStone)[1].setNum;
                    return ["play", stoneStealling, false, stolenStone,
                     null, field, oppoent];
                }
            }
        }
    }

    stolenStone = cardsBoards[maxShieldsOpponent].cardsStacks[maxShieldsField][0].clone();
    stolenStone.setNum = -1;
    return ["play", stoneStealling, false, stolenStone, null, maxShieldsField, maxShieldsOpponent];
}

/**
 * It computes the act of playing the card "normal shield stealling" or "mirror shield stealling"
 * @param {Card} steallingCard is either the object normal shield stealling or the object of 
 * mirror shield stealling.
 * @param {PlayerCoordinator} playerCoordinator is the object that stores everything
 * related this player. 
 * @param {int} playerIndex is the index of this AI in playersData.
 * @param {PlayerBoard} cardsBoards inludes all of the boards/fields in the game.
 * @param {int} targetOpponent is the index of opponent that's perfered to be attacked. 
 *  it should be -1 otherwise. 
 * @return all the paramters needed for setOnPlay() except playerIndex
 */
function playShieldStealling(steallingCard, playerCoordinator, playerIndex, cardsBoards,
     targetOpponent) {
    let stolenShield = (steallingCard.cardName === Card.NORMAL_SHIELD_STEALLING) 
        ? new Card(Card.NORMAL_SHIELD, 0) : new Card(Card.MIRROR_SHIELD, 0);
    stolenShield.setNum = playShield(playerCoordinator, stolenShield)[1].setNum;
    // first targeting the shield that has the min number of shields protecting for target opponent
    let shieldsNum;
    let minShieldNum = 0;
    let allowedFields = playerCoordinator.listValidPlay(cardsBoards[targetOpponent], null,
        steallingCard);
    let minShieldsField = -1; 
    for (let field of allowedFields) {
        shieldsNum = (cardsBoards[targetOpponent].cardsStacks[field][0].cardName.includes("stone")) 
                    ? cardsBoards[targetOpponent].cardsStacks[field].length - 1
                    : cardsBoards[targetOpponent].cardsStacks[field].length;
        if (shieldsNum < minShieldNum || minShieldNum === 0) {
            minShieldNum = shieldsNum;
            minShieldsField = field;
        }
    }
    if (minShieldsField !== -1) {
        return ["play", steallingCard, false, stolenShield, null, minShieldsField, targetOpponent]; 
    }
    // trying to target the field that has the min number of shields
    minShieldNum = 0;
    let minShieldsOpponent = -1;
    for (let opponent = 0; opponent < cardsBoards.length; opponent++) {
        if (opponent !== playerIndex) {
            allowedFields = playerCoordinator.listValidPlay(cardsBoards[opponent], null,
                steallingCard);
            for (let field of allowedFields) {
                shieldsNum = (cardsBoards[opponent].cardsStacks[field][0].cardName.includes("stone")) 
                            ? cardsBoards[opponent].cardsStacks[field].length - 1
                            : cardsBoards[opponent].cardsStacks[field].length;
                if (shieldsNum < minShieldNum || minShieldNum === 0) {
                    minShieldNum = shieldsNum;
                    minShieldsField = field;
                    minShieldsOpponent = opponent;
                }
            }
        }
    }
    return ["play", steallingCard, false, stolenShield, null, minShieldsField, minShieldsOpponent];
}

/**
 * It's a helper method the checks if a card is owned or not.
 * @param {Card[]} handCards is array of cards that the search will be performed on.
 * @param {Card} card is the searched card.
 * @return {boolean} it returns true if the card is found
 */
function hasCard(handCards, card) {
    for (let currCard of handCards) {
        if (currCard.cardName === card.cardName) {
            return true;
        }
    }
    return false;
}