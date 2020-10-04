/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file represents the player side that the actual player instead of
    AI or online players.
method:
    + setOnClickHandCardHandler(cardName: String, byClick: boolean): -> It sets the value of the 
     fields IsOptionsShow and selectCard.
    + setOnClickPlayHandler(cardName: String): -> It handles the event of clicking play button
     at options' window.
    + setOnClickWasteHandler(cardName: String): -> It handles the event of clicking waste button
     at options' window.
    + setOnHidingOptionsWindow(): -> It assigns the field IsOptionsShow to false, so that the 
     the options' window becomes hidden.
    - setOnClickMyField(FieldIndex: int): -> It handles the event of clicking on a highlighed
     field, which is to select the field that the selected card should be played in.
    - stopHighlighting(): -> It stops highlighting clickable fields.
    + setOnSelectRestored(index: int): -> It handles the event of selecting a restored card.
fields:
    - handCards Cards[] -> they are the UI objects of the card in the hand.
    - playedCards Cards[][] -> they are the UI objects of the card in the board.
    + playerName string ->  stores the player name.
    + IsOptionsShow Boolean -> It detremines wethear to show options' window or not.
    + isPlayable Boolean -> true if the selected can be played. It's used for options window
    + restoredStone int -> It indicates the selected restored stone. 0 indeciates orange is selected,
     1 is for red, 2 is for green, and 3 is for blue.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import React, {Component} from 'react';
import styles from './BottomPlayerSide.module.css';

import Card from "../../components/card/card.js";
import CardObj from "../../store/objects/Card.js";
import OptionsWindow from '../../components/optionsWindow/optionsWindow.js';
import * as text from '../../UI/lang/gamePlayScreenLang.js';


class BottomPlayerSide extends Component{

    constructor(props) {
        super(props);
        this.state = {
            playerName: props.playerName, 
            IsOptionsShow: false, 
            selectedCardName:"null", 
            highlightedFields: [], 
            isPlayable: false, 
            restoredStone: null, 
            isPlayingSame: false
        };
    }

  
    /**
     * It handles the event of clicking a hand card for this player. 
     * @param {Card} card is the card object for the selected card.
     * @param {boolean} byClick true if it's called as a result of clicking a hand card
     *  instead of calling it from componentDidUpdate() as a result of trying to use steal
     *  card.
     */
    setOnClickHandCardHandler = (card, byClick) => {
        if (this.props.isPlayingPick() && byClick) {
            alert(text.getText(text.CANNOT_CANCEL_PLAY));
            return;
        }
        this.stopHighlighting(); // remove previous highlights
        if (byClick) {
            this.props.cancelSteallingSameCardHandler();
            if (this.state.restoredStone !== null) {
                this.setState({restoredStone: null});
            }
        }
        if (this.props.currTurnIndex === this.props.myTurnIndex) {
            if ((card.cardName === CardObj.SAME_CARD || card.cardName == CardObj.PICK_CARD) &&
            this.props.isPlayingPick()) {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                    isPlayable: false});  
            } else if (card.cardName === CardObj.RESTORE_STONE) {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                    isPlayable: this.props.hasAValidMove(card, 0)});  
            } else if ((card.cardName.includes(" stone") || card.cardName.includes(" shield")) &&
                !card.cardName.includes("stealling")) {
                let list = this.props.cardsStackObj.listValidPlay(null, card);
                let isValid = list.length !== 0;
                this.setState({highlightedFields: list, isPlayable: isValid, 
                    IsOptionsShow: true, selectedCardName: card.cardName});  
            } else if (card.cardName === CardObj.PLAY_TWICE) {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                     isPlayable: this.props.hasAValidMove(card, 0)})
            } else if (card.cardName === CardObj.PICK_CARD && this.props.isPlayingPick()) {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                    isPlayable: false});
            } else if (card.cardName === CardObj.SAME_CARD) {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                    highlightedFields: [], 
                    isPlayable: this.props.hasAValidMove(card, 0)});
            } else {
                this.setState({IsOptionsShow: true, selectedCardName: card.cardName,
                    isPlayable: this.props.hasAValidMove(card, 0)});
            } 
        } else {
            alert(text.getText(text.NOT_YOUR_TURN));
        }
    };


    /**
     * It handles the event of clicking play button at options' window.
     * @param {String} cardName is the name of the played card. 
     */
    setOnClickPlayHandler = (cardName) => {
        this.setState({IsOptionsShow: false});
        switch(cardName) {
            case CardObj.PLAY_TWICE:
                this.props.playHandler(new CardObj(cardName, 0), this.state.isPlayingSame,
                 null, this.props.myTurnIndex, -1, -1);
            break;
            case CardObj.RESTORE_STONE:
                let restoredStone;
                if (this.state.restoredStone === 0) {
                    restoredStone = new CardObj(CardObj.ORANGE_STONE, 0);
                } else if (this.state.restoredStone === 1) {
                    restoredStone = new CardObj(CardObj.RED_STONE, 0);
                } else if (this.state.restoredStone === 2) {
                    restoredStone = new CardObj(CardObj.GREEN_STONE, 0);
                } else {
                    restoredStone = new CardObj(CardObj.BLUE_STONE, 0);
                }
                this.setState({highlightedFields: this.props.cardsStackObj
                    .listValidPlay(null, restoredStone)});
            break;
            case CardObj.SAME_CARD:
                    this.setOnClickHandCardHandler(this.props.lastPlayedCard, false);
            break;
        }
    };
    
    /**
     * It handles the event of clicking waste button at options' window.
     * @param {String} cardName is the name of the wasted card. 
     */
    setOnClickWasteHandler = (cardName) => {
        this.setState({highlightedFields: []});
        this.setState({IsOptionsShow: false});
        if (this.props.stolenCard === null) {
            this.props.wasteHandler(new CardObj(cardName, 0), false, -1);
        } else if (this.props.isPlayingPick() && 
        !this.props.attackingCard.cardName.includes("stealling")) {
            this.props.wasteHandler(this.props.stolenCard, false, this.props.stolenCardOpponent);
        } else { // stealing card is played, but stolen card is wasted technically b\c its field is -1
            this.props.playHandler(this.props.attackingCard, this.state.isPlayingSame,
            new CardObj(this.props.stolenCard.cardName, -1), 0, this.props.stolenCard.setNum, 
            this.props.stolenCardOpponent);
            if (!this.props.isPlayingPick()) {
                this.props.wasteHandler(this.props.stolenCard, true, -1);
            }
        }
    };


    /**
     * It closes the options' window.
     */
    setOnHidingOptionsWindow = () => {
        this.setState({IsOptionsShow: false});
        this.setState({highlightedFields: []});
        this.stopHighlighting(); // remove previous highlights
    };

    /**
     * It handles the event of clicking on a highlighed
     * field, which is to select the field that the selected card should be played in.
     * @param {int} fieldIndex is the index of the field from 0(most left) to 3(most right).
     */
    setOnClickMyField = (fieldIndex) => {
        // checking if the user has clicked on a highlighted field.
        let hasIndex = false;
        for (let i of this.state.highlightedFields) {
            if (i === fieldIndex) {
                hasIndex = true;
            }
        }
        if (hasIndex) {
            // if the played card is  not stolen
            if (this.props.stolenCard === null) {
                if (this.state.selectedCardName !== CardObj.RESTORE_STONE) {
                    this.props.playHandler(new CardObj(this.state.selectedCardName, fieldIndex),
                    this.state.isPlayingSame, null, 0, -1, -1);
                } else {
                    let restoredStone;
                    if (this.state.restoredStone === 0) {
                        restoredStone = new CardObj(CardObj.ORANGE_STONE, fieldIndex);
                    } else if (this.state.restoredStone === 1) {
                        restoredStone = new CardObj(CardObj.RED_STONE, fieldIndex);
                    } else if (this.state.restoredStone === 2) {
                        restoredStone = new CardObj(CardObj.GREEN_STONE, fieldIndex);
                    } else {
                        restoredStone = new CardObj(CardObj.BLUE_STONE, fieldIndex);
                    }
                    this.props.playRestoreHandler(restoredStone);
                }
            } else {
                let stolenCard = new CardObj(this.props.stolenCard.cardName, fieldIndex); 
                    this.props.playHandler(this.props.attackingCard, this.state.isPlayingSame, 
                        stolenCard, 0, 
                        this.props.stolenCard.setNum, this.props.stolenCardOpponent);
            }

            this.setState({highlightedFields: []});
        }
    };

    /**
     * It stops highlighting all clickable fields.
     */
    stopHighlighting = ()=> {
        this.props.stopHighlighting();
        this.setState({highlightedFields: []});
    }

    /**
     * It handles the event selecting a restored card.
     * @param {int} index 0 indeciates orange is selected, 1 is for red, 2 is for green, and
     * 3 is for blue.  
     */
    setOnSelectRestored = (index) => {
        this.setState({restoredStone: index});
    }
    
    render() {
        // making a space that represents an empty spot.
        let emptySpot = (
            <div style={{margin:"3px", width:"20%", height:"100%"}}/>
        );
       // adding the cards to the correct spot.
        let handCard = [];
        let handCardObjs = this.props.handCards;
        let handCardWidth = (100 / handCardObjs.length) - 3;
        handCardWidth = handCardWidth.toString() + "%";
        let playedCard = [emptySpot, emptySpot, emptySpot, emptySpot];
        for (let cardIndex = 0; cardIndex < handCardObjs.length; cardIndex++) {
            handCard.push((
                <Card isShown={true} cardObj={handCardObjs[cardIndex]}
                    key={handCardObjs[cardIndex].cardName + cardIndex.toString() + this.state.playerName + "hand"} 
                    margin="1px"
                    width={handCardWidth}
                    height="90%"
                    handler={() => this.setOnClickHandCardHandler(handCardObjs[cardIndex], true)}/>
            ));
        }
        let stackCardsObj = this.props.cardsStackObj;
        for (let fieldIndex = 0; fieldIndex < 4; fieldIndex++) {
            playedCard[fieldIndex] = [];
            for (let cardIndex = 0; cardIndex < stackCardsObj.cardsStacks[fieldIndex].length; cardIndex++) {
                playedCard[fieldIndex].unshift((
                    <Card isShown={true} cardObj={stackCardsObj.cardsStacks[fieldIndex][cardIndex]}
                        key={stackCardsObj.cardsStacks[fieldIndex][cardIndex].cardName + fieldIndex.toString() + this.state.playerName} 
                        margin="3px"
                        width="100%"
                        height="100%"
                        handler={() => {}}/>
                ));
            }
        }        
        
        // selecting the right class for cards' stack, either regular or yellow(for clicking).
        let cardsStackClass = [styles.OneCardStack, styles.OneCardStack, styles.OneCardStack, styles.OneCardStack];
        for (let i of this.props.updatedFields) {
            cardsStackClass[i] = styles.OneCardStackUpdated;
        }
        for (let i of this.state.highlightedFields) {
            cardsStackClass[i] = styles.OneCardStackHighlighted;
        }
        // notify the user if his/her turn is now.
        let classesName = styles.PlayerSide;
        if (this.props.currTurnIndex === this.props.myTurnIndex) {
            classesName += " " + styles.BackgroundCurrTurnAnim;
        }

        // selecting the css class for handside, which is either regular looking or orange for
        // signifying playing "prevent next turn" or "pick a card"
        let handSideClass;
        if (this.props.isPlayerHandSideUpdated) {
            handSideClass = styles.HandSideUpdated;
        } else {
            handSideClass = styles.HandSide;
        }
        return(
            <div className={classesName} >
                <div className={styles.PlayedCardSide}>
                <OptionsWindow playable={this.state.isPlayable}
                 visible={this.state.IsOptionsShow}
                 cardName={this.state.selectedCardName}
                 clickPlayHandler={this.setOnClickPlayHandler}
                 clickWasteHandler={this.setOnClickWasteHandler}
                 closeHandler={this.setOnHidingOptionsWindow}
                 selectRestoredHandler={this.setOnSelectRestored}/>
                    <div className={cardsStackClass[0]} onClick={() => this.setOnClickMyField(0)}>
                        {playedCard[0]}
                        <label className={styles.HandSideName}>1</label>
                    </div>
                    <div className={cardsStackClass[1]} onClick={() => this.setOnClickMyField(1)}>
                        {playedCard[1]}
                        <label className={styles.HandSideName}>2</label>
                    </div>
                    <div className={cardsStackClass[2]} onClick={() => this.setOnClickMyField(2)}>
                        {playedCard[2]}
                        <label className={styles.HandSideName}>3</label>
                    </div>
                    <div className={cardsStackClass[3]} onClick={() => this.setOnClickMyField(3)}>
                        {playedCard[3]}
                        <label className={styles.HandSideName}>4</label>
                    </div>
                </div>
                
                <div className={handSideClass}>
                    <div className={styles.HandSideCards}>
                        {handCard}
                    </div>
                    <div className={styles.HandSideName}>
                        {this.props.playerName}
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        // handling the case of stealling/picking a card by simulating that the card was on
        // player's hand and got selected.
        let notNull = prevProps.stolenCard !== null && this.props.stolenCard !== null;
        let diff = (notNull) ? prevProps.stolenCard.cardName !== this.props.stolenCard.cardName
            : false;
        if ((prevProps.stolenCard === null && this.props.stolenCard !== null) 
            || (notNull && diff)) {
            this.setOnClickHandCardHandler(this.props.stolenCard, false);
        }
    }
}



export default BottomPlayerSide;