/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This represents a card's deck as an object. 
methods:
    - setToturialCards(): Card[] -> It returns the cards's  deck that will be used for the
     the toturial mode.
    - setOfflineCards(): Card[] -> It returns the cards's  deck that will be used for the
     the offline mode.
    - setOnlineCards(cardsName: String[]): Card[] -> It returns the cards's  deck that will be used for the
     the online mode. 
    + clone(): CardsDeck -> retur a deeped cloned object.
    + draw(num: int): Card[]-> returns num cards.
    + returnCard(card: Card)-> put the given card back to the deck.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import Card from './Card.js';

class CardsDeck {

    /**
     It initialize an instance based on the given array of cards
     @param {String} gameMode It's either offline, online, or toturial.
     @param {Card[]} cards is the array of cards that represents the cards' deck. It's used
      only with the online mode; otherwise, it should be null.
     */
    constructor(gameMode, cards) {
        // this if is for clonning
        if (gameMode === null) {
            this.cards = [];
        }
        switch (gameMode) {
            case "offline":
                this.cards = this.setOfflineCards();
            break;
            case "online":
                this.cards = this.setOnlineCards(cards);
            break;
            case "toturial":
                this.cards = this.setToturialCards();
            break;
        }
    }


    /**
     * It assigns the field cards based on the pre planned toturial.
     * @returns {Card[]}
     */
    setToturialCards() {
        let cardsSeq = [];
        cardsSeq.push(new Card(Card.RED_STONE, 0));
        cardsSeq.push(new Card(Card.RED_STONE, 0));
        cardsSeq.push(new Card(Card.RED_STONE, 0));
        return cardsSeq;
    }


    /**
     * It assigns the field card to a random sequence of cards
     * @returns {Card[]} 
     */
    setOfflineCards() {
        // create an array of cards' types
        let cardsTypes = [
            [Card.RED_STONE, 8],
            [Card.BLUE_STONE, 8],
            [Card.GREEN_STONE, 8],
            [Card.ORANGE_STONE, 8],
            [Card.MULTICOLOR_STONE, 8], 
            [Card.NORMAL_SHIELD, 32],
            [Card.MIRROR_SHIELD, 8],
            [Card.ABSOLUTE_SHIELD, 5],
            [Card.HAMMER, 32],
            [Card.SHIELD_DETROYER, 4],
            [Card.NORMAL_SHIELD_STEALLING, 4],
            [Card.MIRROR_SHIELD_STEALLING, 4],
            [Card.STONE_STEALLING, 3],
            [Card.PICK_CARD, 3],
            [Card.PLAY_TWICE, 8],
            [Card.RESTORE_STONE, 4],
            [Card.SAME_CARD, 4],
            [Card.PREVENT_NEXT_TURN, 4]
        ];
        // create arrays of cards
        let cardsSeq = [];
        for (let arr of cardsTypes) {
            for(let i = 0; i < arr[1]; i++) {
                cardsSeq.push(new Card(arr[0], 0));
            }
        }
        // shuffle
        let currIndex = cardsSeq.length;
        let randomIndex = 0;
        let tempVal = 0;
        while (currIndex != 0) {
            randomIndex = Math.floor(Math.random() * currIndex);
            currIndex -= 1;

            tempVal = cardsSeq[currIndex];
            cardsSeq[currIndex] = cardsSeq[randomIndex];
            cardsSeq[randomIndex] = tempVal;
        } 
        return cardsSeq;
    }

    /**
     * It initilizes the field cards when playing online mode
     * @param {String[]} cardsNames holds the names of cards in the same order that
     * this cards' deck should have
     */
    setOnlineCards(cardsNames) {
        let cards = [];
        for (let cardType of cardsNames) {
            cards.push(new Card(cardType, 0));
        }
        return cards;
    }

    /**
    It performs deep clonning to this object.
    @return {CardsDeck} a deeped cloned version of this object. 
    */
   clone(){
       let clone = new CardsDeck(null, []);
       for (let card of this.cards) {
           clone.cards.push(card.clone());
       }
       return clone;
   }

   /**
    It return the given number of cards from the top of cards' deck.
    @param {int} num is the int number of the desired quantity for drawing.
    @return {Card[]}
    */
   draw(num) {
       let drawn = [];
       for (let i = 0; i < num; i++) {
           drawn.push(this.cards.pop());
       }
       return drawn;
   }

   /**
    It puts back the given card to deck at the bottom.
    @param {Card} card is the return card.
    */
   returnCard(card) {
        this.cards.unshift(card);
   }
}

export default CardsDeck;