/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This represents a player's data as an object.
methods:
    + clone(): Player -> return a deeped cloned object.
feilds:
    + playerName string -> It's used to know the username that's shown on the screen and
        saved in the app.
    + cards Card[] -> It represents the card on the hand.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import Card from './Card.js';


class Player {
    /**
    It initialize the player's data as an object. 
    @param {String} playerName is string for the user name shown in the screen.
    @param {Card[]} cards is an array of Card's objects that this player has on the hand. 
    */
   constructor(playerName, cards) {
        this.playerName = playerName;
        this.cards = (cards !== null) ? cards : [];
   }

   /**
    It performs deep clonning to this object.
    @return {Player} a deeped cloned version of this object. 
    */
   clone(){
        let clone = new Player(this.playerName, []);
        for (let card of this.cards) {
            clone.cards.push(card.clone());
        }
        return clone;
    }
}

export default Player;