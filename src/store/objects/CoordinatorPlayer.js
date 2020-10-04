/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi.
Porpuse: This represents coordinates all the classes inside this folder except
    CardsDeck.
methods:
    + clone(): Card -> return a deeped cloned object.
    + play(card: Card, stolenCard: Card): -> It executes the action of playing a card.
    + react(fieldIndex: unt, opponentCard: Card): -> It reacts to the attack/action of an opponent.
    + waste(card: Card): -> It discards a card in case a player does not have any valid card
        to play.
    + listPlayValid(opponentBoard: PlayerBoard, opponentHandCard: Card[] card: Card): Object[] -> 
        It indicates the spots/indexes on the board that the player can play the given card.
fields:
    + player Player -> It represent player's data and the cards on his/her hand.
    + cardsBoard CardsBoard -> It represents the placed cards on the board.
    + hasBrokenRedStone  boolean -> It's used to indicate if there was broken or stolen
        red stone.
    + hasBrokenOrangeStone  boolean -> It's used to indicate if there was broken or stolen
        orange stone.
    + hasBrokenBlueStone  boolean -> It's used to indicate if there was broken or stolen
        blue stone.
    + hasBrokenGreenStone  boolean -> It's used to indicate if there was broken or stolen
        green stone. 
    - lastPlayedCard Card -> It stores the last played card by this player.
    - hasPlayTwice Boolean -> It's used to prevent playing the card 'play_twice' twice in the same
     turn.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import Player from './Player';
import PlayerBoard from './PlayerBoard';
import Card from './Card';

class CoordinatorPlayer {

    /**
     Initialize an object that represents a single player's data and cards.
     @param {string} playerName is the name of the player
     @param {Card[]} handCards are the cards on the hand.
     */
    constructor(playerName, handCards) {
        this.player = new Player(playerName, handCards);
        this.cardsBoard = new PlayerBoard([], [], [], []);
        this.hasBrokenRedStone = false;
        this.hasBrokenOrangeStone = false;
        this.hasBrokenBlueStone = false;
        this.hasBrokenGreenStone = false;
        this.lastPlayedCard = null;
        this.hasPlayTwice = false;
    }

    /**
    It performs deep clonning to this object.
    @return {CoordinatorPlayer} a deeped cloned version of this object. 
    */
   clone(){
       let cloned = new CoordinatorPlayer(this.player.playerName, this.player.cards);
       cloned.cardsBoard = this.cardsBoard.clone();
       cloned.hasBrokenRedStone = this.hasBrokenRedStone;
       cloned.hasBrokenOrangeStone = this.hasBrokenOrangeStone;
       cloned.hasBrokenBlueStone = this.hasBrokenBlueStone;
       cloned.hasBrokenGreenStone = this.hasBrokenGreenStone;
       cloned.lastPlayedCard = this.lastPlayedCard;
       cloned.hasPlayTwice = this.hasPlayTwice;
       return cloned;
    }

    /**
     It executes the required to simulate playing a card.
     @param {Card} card is this's player card that will be played.
     @param {Card} stolenCard is non-null only if the opponent steals a sheid or a stone or used
        the action card 'pick a card from opponent' AND this user can use the stolen; for
        example, the user steals/picks a red stone when he/she does not have one.
     @return true if the player has won the game.
     */
    play(card, stolenCard) {
        let hasFinished = false;
        if ((card.cardName.includes("stealling") ||
            card.cardName === Card.PICK_CARD)) {
                if (stolenCard.setNum !== -1) {
                    hasFinished =  this.cardsBoard.addCard(stolenCard.setNum, stolenCard);
                }
        } else if (card.cardName.includes("stone") || card.cardName.includes(" shield") || 
        card.cardName === Card.RESTORE_STONE) {
            hasFinished =  this.cardsBoard.addCard(card.setNum, card);
        } 

        if (card.cardName === Card.PLAY_TWICE) {
            this.hasPlayTwice = true;
        }
        this.waste(card); // waste() would help removing the card.
        this.lastPlayedCard = new Card(card.cardName, 0);
        return hasFinished;
    }

    /**
     * It reacts to attack/action from oopnent.
     * @param {int} myCard is the targeted field by the opponent.
     * @param {Card} opponentCard is the card that the opponent used.
     * @return true if a mirror shield has reflected an attack.
     */
    react(fieldIndex, opponentCard) {
        let lastIndex;
        switch (opponentCard.cardName) {
            case Card.HAMMER:
                if (this.cardsBoard.cardsStacks[fieldIndex].length === 0) {
                    return false;
                }
                lastIndex = this.cardsBoard.cardsStacks[fieldIndex].length - 1;
                if (this.cardsBoard.cardsStacks[fieldIndex][lastIndex].cardName ===
                     Card.ABSOLUTE_SHIELD) {
                    return false;
                } else {
                    let removed = this.cardsBoard.cardsStacks[fieldIndex].pop();
                    switch(removed.cardName) {
                        case Card.RED_STONE:
                            this.hasBrokenRedStone = true;
                        break;
                        case Card.BLUE_STONE:
                            this.hasBrokenBlueStone = true;
                        break;
                        case Card.ORANGE_STONE:
                            this.hasBrokenOrangeStone = true;
                        break;
                        case Card.GREEN_STONE:
                            this.hasBrokenGreenStone = true;
                        break;
                    }
                    return removed.cardName === Card.MIRROR_SHIELD;
                }
            break;
            case Card.SHIELD_DETROYER:
                if (this.cardsBoard.cardsStacks[fieldIndex].length === 0) {
                    return false;
                }
                lastIndex = this.cardsBoard.cardsStacks[fieldIndex].length - 1;
                if (this.cardsBoard.cardsStacks[fieldIndex][lastIndex].cardName.includes(" shield")) {
                    this.cardsBoard.cardsStacks[fieldIndex].pop();
                }
                return false;
            break;
            case Card.STONE_STEALLING:
                if (this.cardsBoard.cardsStacks[fieldIndex].length === 0) {
                    return false;
                }
                if (this.cardsBoard.cardsStacks[fieldIndex][0].cardName.includes(" stone")) {
                    this.cardsBoard.cardsStacks[fieldIndex].shift();
                }
                return false;
            break;
            case Card.NORMAL_SHIELD_STEALLING:
                if (this.cardsBoard.cardsStacks[fieldIndex].length === 0) {
                    return false;
                }
                lastIndex = this.cardsBoard.cardsStacks[fieldIndex].length - 1;
                for (let i = lastIndex; i > -1; i--) {
                    if (this.cardsBoard.cardsStacks[fieldIndex][i].cardName === Card.NORMAL_SHIELD) {
                        this.cardsBoard.cardsStacks[fieldIndex].splice(i, 1);
                        return false;
                    }
                }
                return false;
            break;
            case Card.MIRROR_SHIELD_STEALLING:
                if (this.cardsBoard.cardsStacks[fieldIndex].length === 0) {
                    return false;
                }
                lastIndex = this.cardsBoard.cardsStacks[fieldIndex].length - 1;
                for (let i = lastIndex; i > -1; i--) {
                    if (this.cardsBoard.cardsStacks[fieldIndex][i].cardName === Card.MIRROR_SHIELD) {
                        this.cardsBoard.cardsStacks[fieldIndex].splice(i, 1);
                        return false;
                    }
                }
                return false;
            break;
        }
    }

    /**
    It discards a card in case a player does not have any valid card
       to play. It can also be used to remove a card.
       @param {Card} card is the wasted card.
     */
    waste(card) {
        let deletedIndex = 0;
        for (let i = 0; i < this.player.cards.length; i++) {
            if (this.player.cards[i].cardName === card.cardName) {
                deletedIndex = i;
            }
        }
        this.player.cards.splice(deletedIndex, 1);
    }

    /**
    * 
    * @param {PlayerBoard} opponentBoard is the board cards for the opponent if the played
    * card targets opponents card. However, if it's shield or stone, then the default value
    * for this parameter is null.
    * @param {Card[]} opponentHandCard is array that stores the hand cards of the opponent.
    * @param {Card} card is card that this player is willing to play.
    * @return {Object[]} It returns the indexes for the valid positions on this player board
    * for the stones or the stone, or the valid positions on opponent board for other cards, or
    * return true for valid play for 'play_twice', return boolean array
    *  [hasBrokenOrangeStoneBoolean, hasBrokenRedStoneBoolean,
    *  hasBrokenGreenStoneBoolean, hasBrokenBlueStoneBoolean]
    */
   listValidPlay(opponentBoard = null, opponentHandCard = null, card) {
       if (card.cardName === Card.PLAY_TWICE) {
           if (this.hasPlayTwice) {
               return false;
           } else {
               return true;
           }
       } else if (card.cardName === Card.PICK_CARD) {
            return opponentHandCard.length > 0;
       } else if (card.cardName === Card.RESTORE_STONE) {
            let hasValidPlay = [this.hasBrokenOrangeStone, this.hasBrokenRedStone, this.hasBrokenGreenStone,
             this.hasBrokenBlueStone];
            let cardsObj = [new Card(Card.ORANGE_STONE, 0), new Card(Card.RED_STONE, 0), 
                new Card(Card.GREEN_STONE, 0), new Card(Card.BLUE_STONE, 0)];
            for (let i = 0; i < 4; i++) {
                if (hasValidPlay[i]) {
                    hasValidPlay[i] = this.cardsBoard.listValidPlay(null, cardsObj[i]).length !== 0;
                }
            }
            return hasValidPlay;
       } else {
           return this.cardsBoard.listValidPlay(opponentBoard, card);
       }
   }
}

export default CoordinatorPlayer;