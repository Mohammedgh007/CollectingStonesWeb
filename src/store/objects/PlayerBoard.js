/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This represents a player's board data as an object. Player board are
    the cards (shields and stones) that are played and placed on his/her side
    of the board.
methods:
    + clone(): PlayerBoard -> return a deeped cloned object.
    + addCard(stackNum: int, addedCard: Card): boolean -> adds a card to a deck/stack, and returns
        true if the player placed the forth card indicating end of the game.
    - hasWon(): boolean -> addCard() return the result of this method to indicate whether the player
        won or not.
    + listPlayValid(opponentBoard: PlayerBoard, card: Card): int[] -> It indicates the spots/indexes  
        on the board that the player can play the given card.
feilds:
    + cardsStack Card[][] -> It's used to represents a played player's cards on the board.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import Card from './Card.js';

class PlayerBoard {
     /**
    It initialize the player's board data as an object. 
    @param {Card[]} cardsStack1 is a one stack of four placed on the board. This's an array of Card.
    @param {Card[]} cardsStack2 is a one stack of four placed on the board. This's an array of Card.
    @param {Card[]} cardsStack3 is a one stack of four placed on the board. This's an array of Card.
    @param {Card[]} cardsStack4 is a one stack of four placed on the board. This's an array of Card.
    */
   constructor(cardsStack1, cardsStack2, cardsStack3, cardsStack4) {
    this.cardsStacks = [(cardsStack1 !== null) ? cardsStack1 : [],
    (cardsStack2 !== null ) ? cardsStack2 : [],
    (cardsStack3 !== null ) ? cardsStack3 : [],
    (cardsStack4 !== null) ? cardsStack4 : []];
}

    /**
    It performs deep clonning to this object.
    @return {PlayerBoard} a deeped cloned version of this object. 
    */
    clone(){
        let clone = new PlayerBoard([], [], [], []);
        for (let i = 0; i < 4; i++) {
            for (let card of this.cardsStacks[i]) {
                clone.cardsStacks[i].push(card.clone());
            }
        }
        
        return clone;
    }

    /**
    This method adds a sheild or a stone to a given stack of cards.
    @param {int} stackNum is int between 0 to 3 that indicates the stack number.
    @param {Card} addedCard is the card(instance of Card) that will be added to the stack.
    */
   addCard(stackNum, addedCard) {
       if (addedCard.cardName.includes("shield")) { // if it's a shield
            this.cardsStacks[stackNum].push(addedCard.clone());
       } else {
           this.cardsStacks[stackNum].unshift(addedCard.clone());
       }
       return this.hasWon();
   }

   /**
    * It indicates whether the player has finished the game or not.
    * @return {boolean} indicating if the player has won or not.
    */
   hasWon() {
       for (let i = 0; i < 4; i++) {
           if (this.cardsStacks[i].length === 0 || 
            !this.cardsStacks[i][0].cardName.includes(" stone")) {
               return false;
           }
       }
       return true;
   }

   /**
    * 
    * @param {PlayerBoard} opponentBoard is the board cards for the opponent if the played
    * card targets opponents card. However, if it's shield or stone, then the default value
    * for this parameter is null.
    * @param {Card} card is card that this player is willing to play.
    * @return {int[]} It returns the indexes for the valid positions on this player board
    * for the stones or the stone, or the valid positions on opponent board for other cards.
    */
   listValidPlay(opponentBoard = null, card) {
       let validSpots = [];
        if (opponentBoard == null) { // if card does not target opponent.
            if (card.cardName.includes(" stone")) {
                // check if there's no same card
                for (let i = 0; i < 4; i++) {
                    if (this.cardsStacks[i].length !== 0 && 
                        (this.cardsStacks[i][0].cardName === card.cardName
                        && card.cardName !== Card.MULTICOLOR_STONE)) {
                        return validSpots; // return empty to indicate there's no valid spot.
                    }
                }
                // check empty spots
                for (let i = 0; i < 4; i++) {
                    if (this.cardsStacks[i].length === 0 || 
                        !this.cardsStacks[i][0].cardName.includes(" stone")) {
                        validSpots.push(i);
                    }
                }
            } else if (card.cardName.includes("shield")){ 
                validSpots.push(0, 1, 2, 3);
            } 
        } else { // if the card does target opponent cards.
            let lastIndex = 0;
            let hasAbsoluteShield = false;
            let isValid = false;
            switch(card.cardName) {
                case Card.HAMMER:
                    for (let i = 0; i < 4; i++) {
                        lastIndex = opponentBoard.cardsStacks[i].length - 1;
                        if (opponentBoard.cardsStacks[i].length > 0 && 
                            opponentBoard.cardsStacks[i][lastIndex].cardName !== Card.ABSOLUTE_SHIELD) {
                                validSpots.push(i);
                            }
                    }
                    return validSpots;
                break;
                case Card.SHIELD_DETROYER:
                    for (let i = 0; i < 4; i++) {
                        lastIndex = opponentBoard.cardsStacks[i].length - 1;
                        if (opponentBoard.cardsStacks[i].length > 0 && 
                            opponentBoard.cardsStacks[i][lastIndex].cardName.includes("shield")) {
                                validSpots.push(i);
                            }
                    }
                break;
                case Card.STONE_STEALLING:
                    for (let i = 0; i < 4; i++) {
                        hasAbsoluteShield = false;
                        // checking if there's astone in this field.
                        if (opponentBoard.cardsStacks[i].length > 0 && 
                            opponentBoard.cardsStacks[i][0].cardName.includes(" stone")) {
                                // checking that there's absolute shield in this field
                                for (let j = 1; j < opponentBoard.cardsStacks[i].length; j++) {
                                    if(opponentBoard.cardsStacks[i][j].cardName === Card.ABSOLUTE_SHIELD) {
                                        hasAbsoluteShield = true;
                                    }
                                }
                                if (!hasAbsoluteShield) {
                                    validSpots.push(i);
                                }
                            }
                    }
                break;
                case Card.NORMAL_SHIELD_STEALLING:
                    for (let i = 0; i < 4; i++) {
                        hasAbsoluteShield = false;
                        isValid = false;
                        lastIndex = opponentBoard.cardsStacks[i].length - 1;
                        // checking if there's astone in this field.
                        if (opponentBoard.cardsStacks[i].length > 0) {
                                // checking that there's absolute shield in this field
                                for (let j = lastIndex; j > -1; j--) {
                                    if(opponentBoard.cardsStacks[i][j].cardName === 
                                        Card.ABSOLUTE_SHIELD) {
                                        hasAbsoluteShield = true;
                                    } else if (opponentBoard.cardsStacks[i][j].cardName ===
                                         Card.NORMAL_SHIELD && !hasAbsoluteShield) {
                                        isValid = true;
                                    }
                                }
                                if (isValid) {
                                    // there's a normal shield that has not absolute shield above it.
                                    validSpots.push(i);
                                } 
                            }
                    }
                break;
                case Card.MIRROR_SHIELD_STEALLING:
                    for (let i = 0; i < 4; i++) {
                        hasAbsoluteShield = false;
                        isValid = false;
                        lastIndex = opponentBoard.cardsStacks[i].length - 1;
                        // checking if there's astone in this field.
                        if (opponentBoard.cardsStacks[i].length > 0) {
                                // checking that there's absolute shield in this field
                                for (let j = lastIndex; j > -1; j--) {
                                    if(opponentBoard.cardsStacks[i][j].cardName === 
                                        Card.ABSOLUTE_SHIELD) {
                                        hasAbsoluteShield = true;
                                    } else if (opponentBoard.cardsStacks[i][j].cardName ===
                                         Card.MIRROR_SHIELD && !hasAbsoluteShield) {
                                        isValid = true;
                                    }
                                }
                                if (isValid) {
                                    // there's a normal shield that has not absolute shield above it.
                                    validSpots.push(i);
                                } 
                            }
                    }
                break;
            }
        }
        return validSpots;
   }
}

export default PlayerBoard;