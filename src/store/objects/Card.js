/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This represents a card as an object. Also, It's the object that will be
    sent and received from/to the server side for each turn.
methods:
    + clone(): Card -> retur a deeped cloned object.
fields:
    + cardName string -> It's used to reach card name/type.
    + cardSet int -> It's used to know the position of the card.
    + ... String -> All the constants are used to construct this as a paramater
        for cardName.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/


class Card {
    static RED_STONE = "red stone";
    static ORANGE_STONE = "orange stone";
    static BLUE_STONE = "blue stone";
    static GREEN_STONE = "green stone";
    static MULTICOLOR_STONE = "multicolor stone";
    static NORMAL_SHIELD = "normal shield";
    static MIRROR_SHIELD = "mirror shield";
    static ABSOLUTE_SHIELD = "absolute shield";
    static HAMMER = "hammer";
    static SHIELD_DETROYER = "shield detroyer";
    static STONE_STEALLING = "stone stealling";
    static MIRROR_SHIELD_STEALLING = "mirror shield stealling";
    static NORMAL_SHIELD_STEALLING = "normal shield stealling";
    static PICK_CARD = "pick card"; // see oponent cards and pick one.
    static PLAY_TWICE = "play twice";
    static RESTORE_STONE = "restore stone";
    static SAME_CARD = "same card"; //same card as last turn.
    static PREVENT_NEXT_TURN = "prevent next turn";

    /**
    It initialize Card object that is used to store its state regardless of its
    view to the user.
    @param {String} cardName is string that uses one of the constants provided by this class.
    @param {int} setNum is int that indicates its position 0-3. If the card on hand or 
        on the cards' deck, then setnum = -1.
    */
    constructor(cardName, setNum) {
        this.cardName = cardName;
        this.setNum = setNum;
    }

    /**
    It performs deep clonning to this object.
    @return {Card} a deeped cloned version of this object. 
    */
    clone(){
        return new Card(this.cardName, this.setNum);
   }

}

export default Card;
