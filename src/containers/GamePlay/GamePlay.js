/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file manages the game play. It prompts the user for the player number then
    setup the game and manage it when it gets started.
methods:
    + setupOnlineGame(playersInfo: Object, currTurn: int, cardsNames: String[]): ->
    It's used to setup the game in the online mode after finishing linking the players
    + restartGame(props): -> It setups the game when for playing again.
    + setPlayerNumHandler(num: int): -> It's used to set the playerNum when clicking a radio button.
    + setPlayersNumberHandler(num: int, index: int): -> It's used to store the online opponent
     player's number when typing in popuo window.
    + setUserName(name: string): -> It's used to store the name of the usr when typing on popup 
     window on online mode.
    + linkPlayers(): -> It's used to begin the process of linking the players online and 
     setup the game.
    + setIsPopupShownHandler(willShow: boolean): -> It's used to set the value of isPopupShown.
    + ShowGameRulesWindow(): -> It shows the game rules through popup window
    + setOnClickOpponentCardHandler(card : Card, index: int): -> It handles
     the event of clicking opponent's card.
    + hasAValidMove(card: Card, playerIndex: int): boolean -> 
     It returns true if there's a 
     use for a card(if the card can be played). It also highlights the possible spots for
     playing on opponents fields.
    + stopHighlighting(): -> It's used to stop highlighting fields
    + setOnClickHighlighted(attackedField: int, opponentIndex: int): -> It handles the event 
        of clicking on an opponent's clickable field.
    + setOnPlay(playedCard: Card, isPlayedSameCard: boolean, stolenCard: Card playerIndex: int,
         opponentField: int, opponentIndex: int): 
     -> It handles modifying the state and the view(if needed) when a players plays a card.
    + setOnPlatRestore(restoredStone: Card): -> it handles the event of playing restore stone
    + setOnWaste(wastedCard: Card, isForShowingOnly: boolean): -> It handles the event of 
     selecting a card to be wasted.
    + cancelSteallingSameCardHandler(): -> It is used by BottomSidePlayer to set stolenCard to 
     null as an indicator to cancelling stealling/picking.
    + isPlayingPick(): boolean -> It returns true if the player has seen an opponent cards
     after playing "pick a hand card" in the current turn.
    + drawCardHandler(playerIndex: int, count: int): Card[]-> It handles showing 
     the animation of drawing card with updating the the state.
    + opponentAct(): -> It checks if it's an opponent turn, if so it lets the opponent
     plays/wastes a card. If the opponet is online, then it notifies that opponent. If the opponent
     is AI, then it calls a function from AIOpponent that decides the action of the opponent.
    + setOnClickPlayAgain(): -> It handles clicking play again button.
fields:
    + isAuth boolean -> It's used for online mode. When it's false, the authentication
     prompt is shown, and when it's false, the prompt will be hidden.
    - authUI ReactComponent -> It holds the ui that will prompt the user for authentication.
    - isLangRight boolean -> true if the language like Arabic starts from the right.
    - playerNum int -> It's the number of participant between 2-4. 
    - isPopupShown boolean -> It enables/disables showning the popup window.
    + screenPopUp String -> It indicates the type of popup screen. It's either offlinesetup, 
     onlinesetup, or game rules.
    + cardDeckClass String(for CSS) -> It's used to inidcate css class for controlling the 
     animation of drawing cards.
    + isInfoScreenShown Boolean -> It indicates whether the information screen should shown or not.
    + infoScreenType String -> It indicates the information's type that's either wastingCard, 
     userTurn, or playerWon.
    + shownCardObj Card -> It stores the reference to the card object that will be shown
     on the info screen.
    + highlightedFields int[][] -> It stores the opponents' fields that are highlighted for
     being clickable.
    + updatedFields int[][] -> It stores the fields whose cards has increased or decreased.
    - attackingCard Card -> It stores the card that a player has decided to use it in attacking.
    + highlightedPlayers boolean[] -> It indicates whether a player's side is highlighted or not
     to indicate clicking.
    + updatedPlayers boolean[] -> It is used to signify to the end user if a player has been 
     affected by "prevent next turn" or "pick card".
    + stolenCard Card -> It stores the card that the player has selected to steal/picked.
    + stolenCardOpponent int -> It stores the index of the field whoose card is stolen/picked.
    + isHandCardsVisible boolean[] -> It stores boolean that decides whether a hand card should
     be visible or not. They become visible only when playing "pick card".
    - lastNonShildStoneCard Card -> It stores the last played card that is not a shield nor a stone
     , so that it can be displayed in the middle of the screen.
Notes:
    1- It's assumed that bottom player has index 0 at props.playersData, 
     right player has index 1, top player has index (playersNum - 1), and left player has index 3.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React, {Component} from 'react';

import Button from '../../UI/Button/button.js';
import * as text from '../../UI/lang/gamePlayScreenLang.js';
import styles from './GamePlay.module.css'; 
import Popup from '../../UI/Popup/popup.js';
import PlayerSide from '../../components/playerSide/playerSide.js';
import BottomPlayerSide from '../BottomPlayerSide/BottomPlayerSide.js'
import CardObj from '../../store/objects/Card.js';
import Card from '../../components/card/card.js';
import {connect} from 'react-redux';
import * as actionsType from '../../store/actions/actions.js';
import TickSound from '../../assets/Audio/Tick.mp3';
import * as AIOpponent from '../../opponentManagement/AIOpponent.js';
import OnlineOpponents from "../../opponentManagement/OnlineOpponent";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import InfoScreen from '../../components/infoScreen/infoScreen.js';

class GamePlay extends Component {

    constructor(props) {
        super(props);
        // to check the game mode + redirecting the user if the user provided wrong link.
        if (props.location.pathname === "/offline") {
            this.state = {
                isAuth: true,
                authUI: null,
                isLangRight: (navigator.language.slice(0, 2) === "ar"),
                playersNum: 2,
                isPopupShown: true,
                screenPopUp:"offlineSetUp",
                cardDeckClass: styles.CardsDeck,
                isInfoScreenShown: false,
                infoScreenType: "",
                shownCardObj: null, 
                highlightedFields: null,
                updatedFields: null,
                attackingCard: null, 
                highlightedPlayers: null,
                updatedPlayers: null,
                stolenCard: null, 
                stolenCardOpponent: null, 
                isHandCardsVisible: [false, false, false, false], 
                lastNonShildStoneCard: null, 
                someonePlayingSame: false, 
            };
            this.gameMode = "offline";
        } else if (props.location.pathname === "/online") {
            this.state = {
                isAuth: false,
                onlineOpponents: new OnlineOpponents(),
                authUI: {
                    signInFlow: "popup",
                    signInOptions: [
                      firebase.auth.PhoneAuthProvider.PROVIDER_ID
                    ],
                    callbacks: {
                      signInSuccess: () => false
                    }
                },
                isLangRight: (navigator.language.slice(0, 2) === "ar"),
                playersNum: 2,
                playersPhoneNum: [-1, -1, -1, -1],
                userName: "",
                isPopupShown: false, 
                screenPopUp:"onlineSetUp",
                cardDeckClass: styles.CardsDeck,
                isInfoScreenShown: false,
                infoScreenType: "",
                shownCardObj: null, 
                highlightedFields: null,
                updatedFields: null,
                attackingCard: null, 
                highlightedPlayers: null,
                updatedPlayers: null,
                stolenCard: null, 
                stolenCardOpponent: null, 
                isHandCardsVisible: [false, false, false, false], 
                lastNonShildStoneCard: null, 
                someonePlayingSame: false,
            };
            this.gameMode = "online";
            firebase.auth().onAuthStateChanged( (user) => {
                if (user !== null) {
                    this.setState({isAuth: !!user , authUI: null, isPopupShown: true});
                    this.state.onlineOpponents.setUser(user);
                }
            });
        } else {
            props.history.replace("/");
        }
    }

    /**
     * 
     * @param {Object[]} playersInfo is a jason objects array whose objects hold
     * the field 'name', which stores the name of the player
     * @param {int} currTurn is the turnIndex at the time of starting the game
     * @param {*String[]} cardsNames are the names of the cards' types
     */
    setupOnlineGame = (playersInfo, currTurn, cardsNames) => {
        this.setState({isPopupShown: false});
        this.props.setupOnlineGame(playersInfo, currTurn, cardsNames);
        this.props.switchTurn().then(() => {
            // let the next turn player draws cards.
            this.drawCardHandler(this.props.turnIndex, 
                4 - this.props.playersData[this.props.turnIndex].player.cards.length);
        }); 
    }

    /**
     * It setups the game when restarting a new game.
     */
    restartGame = (props) => {
        if (this.gameMode === "offline") {
            this.props.setupOfflineGame(this.state.playersNum);
            this.props.switchTurn().then(() => {
                // let the next turn player draws cards.
                this.drawCardHandler(this.props.turnIndex, 
                    4 - this.props.playersData[this.props.turnIndex].player.cards.length);
            });
        } else {
            window.location.reload();
        }
    }


    /**
     * this method handles changing the players number when the user clicks a button.
     * @param {int} num the selected number of players 
     */
    setPlayerNumHandler = (num) => {
        this.setState({playersNum: num});
    }

    /**
     * It's used to store the online opponent players' number when typing in popuo window.
     * @param {int} num It's the inputted cell phone number
     * @param {int} index index of the player in playersData
     */
    setPlayersNumberHandler = (num, index) => {
        let updatedList = [];
        for (let phoneNum of this.state.playersPhoneNum) {
            updatedList.push(phoneNum);
        }
        updatedList[index] = num;
        this.setState({playersPhoneNum: updatedList});
    }


    /**
     * It's used to store the name of the usr when typing on popup 
     * window on online mode.
     * @param {String} name is the name that the user has inputted. 
     */
    setUserName = (name) => {
        this.setState({userName: name});
    }

    /**
     * It's used to begin the process of linking the players online and 
     * setup the game.
     */
    linkPlayers = () => {
        // validate the users' inputs first
        const validChars = "0987654321";
        for (let i = 1; i < this.state.playersNum; i++) {
            if (this.state.playersPhoneNum[i] === this.state.playersPhoneNum[0]) {
                alert(text.getText(text.WARN_SAME_PHONE));
                return; // leave the method to cancel the linking
            } else if (this.state.playersPhoneNum[i].charAt(0) !== "+") {
                // if the user does not have this format "+CountrycodePhonenum"
                alert(text.getText(text.WARN_PHONE_INPUT));
                return;
            }
            // this loop continues checking for the else if block
            for (let char of this.state.playersPhoneNum[i].substring(1)) {
                if (!validChars.includes(char)) {
                    alert(text.getText(text.WARN_PHONE_INPUT));
                    return;
                }
            }
        }

        // start linking
        this.setState({screenPopUp: "loading"});
        const validPhoneNums = [
            this.state.playersPhoneNum[1],
            (this.state.playersNum > 2) ? this.state.playersPhoneNum[2] : -1,
            (this.state.playersNum > 3) ? this.state.playersPhoneNum[3] : -1,
        ];
        this.state.onlineOpponents.startLinking(
            this.state.userName,
            validPhoneNums[0],validPhoneNums[1],
            validPhoneNums[2], 
            this.setupOnlineGame
        );
    }

    /**
     * It sets the value of the feild isPopupShown when occuring an event.
     * Also, It initialize the state of players if the popup was not for game rules
     * @param {boolean} willShow is the new value.
     */
    setIsPopupShownHandler = (willShow) => {
        this.setState({isPopupShown: willShow});
        // if the popup was not for game rules
        if (!willShow && this.state.screenPopUp !== "game rules") {
            if (this.gameMode === "offline") {
                this.props.setupOfflineGame(this.state.playersNum);
                this.props.switchTurn().then(() => {
                    // let the next turn player draws cards.
                    this.drawCardHandler(this.props.turnIndex, 
                        4 - this.props.playersData[this.props.turnIndex].player.cards.length);
                }); 
            }
            
        }
    };

    /**
     * It shows the game rules by enabling the pop up window
     */
    ShowGameRulesWindow = () => {
        this.setState({screenPopUp:"game rules",isPopupShown:true});
    };

    /**
     * It handles the event of clicking a component's card.
     * @param {Card} card is the card's object that was clicked.
     * @param {int}  playerIndex is the player's index in playersData.
     */
    setOnClickOpponentCardHandler = (card, playerIndex) => {
        // if the user has used pick card only.
        if(playerIndex < this.props.playersData.length && 
            this.state.isHandCardsVisible[playerIndex]) {
                if (card.cardName.includes("stealling")) {
                    this.setState({stolenCard: card, stolenCardOpponent:playerIndex, 
                    attackingCard: this.state.stolenCard});
                } else {
                    this.setState({stolenCard: card, stolenCardOpponent:playerIndex});
                }
            }
    };

    /**
     * It returns true if there's a 
     * use for a card(if the card can be played). It also highlights the possible spots for
     * playing on opponents fields
     * @param {Card} card is card that might be used.
     * @param {int} playerIndex refer to the index on props.playersData, which is the same
     *  as props.myTurnIndex in BottomPlayer and PlayerSide.
     */
    hasAValidMove = (card, playerIndex) => {
        this.stopHighlighting();
        let hasValidAttack;
        let hasPlayedPick = this.isPlayingPick();
        if (card.cardName === CardObj.PLAY_TWICE) {
            return this.props.playersData[playerIndex].listValidPlay(null, null, card);
        } else if (card.cardName === CardObj.HAMMER || 
            card.cardName === CardObj.SHIELD_DETROYER ||
            card.cardName.includes("stealling")) { 
            let allowedFields = [[]];
            hasValidAttack = false;
            for (let player = 0; player < this.props.playersData.length; ++player) {
                if (player !== this.props.turnIndex) {
                    allowedFields.push(this.props.playersData[this.props.turnIndex].listValidPlay(
                        this.props.playersData[player].cardsBoard, null, card
                    ));
                    if (allowedFields[player].length !== 0) {
                        hasValidAttack = true;
                    }
                }
            }
            // setting the field attackingCard for preparing for props.play()
            if (hasValidAttack) {
                this.setState({attackingCard: card});
            }
            // highlighting the clickable fields if thr player is the user only.
            if (this.props.turnIndex === 0 && hasValidAttack) {
                this.setState({highlightedFields: allowedFields});
            }
            return hasValidAttack;
        } else if (card.cardName === CardObj.PREVENT_NEXT_TURN) {
            // highlighting all the opponents for being clickable.
            this.setState({highlightedPlayers: [true, true, true, true], 
                attackingCard: card});
            return true;
        } else if (card.cardName === CardObj.PICK_CARD && // to avoid the edge case of picking "pick a hand card"
            !hasPlayedPick) {
            let highlightedPlayers = [false, false, false, false];
            hasValidAttack = false;
            for (let player = 0; player < this.props.playersData.length; player++) {
                if (player !== this.props.turnIndex) {
                    highlightedPlayers[player] = this.props.playersData[this.props.turnIndex].listValidPlay(
                        null, this.props.playersData[player].player.cards, card);
                    if (highlightedPlayers[player]) {
                        hasValidAttack = true;
                    }
                }
            }
            this.setState({highlightedPlayers: highlightedPlayers, 
                attackingCard: card});
            return hasValidAttack;
        } else if (card.cardName === CardObj.SAME_CARD) {
            if (!this.state.someonePlayingSame) {
                this.setState({someonePlayingSame: true});
            }
            return this.props.playersData[this.props.turnIndex].lastPlayedCard !== null;
        } else if (card.cardName === CardObj.RESTORE_STONE) { 
            return this.props.playersData[this.props.turnIndex].listValidPlay(null, null, card);
        } 
    }

    /**
     * It's used to remove the highlights, so that if a player has decided to play another,
     *  the previous highlighted fields are cancelled.
     */
    stopHighlighting = () => {
        this.setState({highlightedFields: null, highlightedPlayers: null})
    }

    /**
     * It handles the event of clicking on an clickable oppoent's fields or section.
     * @param {int} attackedField It's the index (0-3) of the field that was attacked.
     * @param {int} opponentIndex it's the index of the player that was attacked.
     */
    setOnClickHighlighted = (attackedField, opponentIndex) => {
        if (this.state.attackingCard.cardName === CardObj.HAMMER ||
            this.state.attackingCard.cardName === CardObj.SHIELD_DETROYER) {
            this.setOnPlay(this.state.attackingCard, this.state.someonePlayingSame,
                 null, this.props.turnIndex, attackedField, opponentIndex);
        } else if (this.state.attackingCard.cardName === CardObj.PREVENT_NEXT_TURN) {
            this.setOnPlay(this.state.attackingCard, this.state.someonePlayingSame,
                 null, this.props.turnIndex, -1, opponentIndex);
        } else if (this.state.attackingCard.cardName.includes("stealling")) {
            let lastIndex = this.props.playersData[opponentIndex].cardsBoard.cardsStacks[attackedField].length - 1;
            let stolenCardClone;
            if(this.state.attackingCard.cardName === CardObj.STONE_STEALLING) {
                stolenCardClone = this.props.playersData[opponentIndex].cardsBoard.
                cardsStacks[attackedField][0].clone();
            } else if (this.state.attackingCard.cardName === CardObj.NORMAL_SHIELD_STEALLING) {
                for (let cardIndex = lastIndex; cardIndex > -1; cardIndex--) {
                    if (this.props.playersData[opponentIndex].cardsBoard.
                        cardsStacks[attackedField][cardIndex].cardName === CardObj.NORMAL_SHIELD) {
                            stolenCardClone = this.props.playersData[opponentIndex].cardsBoard.
                            cardsStacks[attackedField][cardIndex].clone();
                            break;
                        }
                }
            } else if (this.state.attackingCard.cardName === CardObj,text.MIRROR_SHIELD_STEALLING) {
                for (let cardIndex = lastIndex; cardIndex > -1; cardIndex--) {
                    if (this.props.playersData[opponentIndex].cardsBoard.
                        cardsStacks[attackedField][cardIndex].cardName === CardObj.MIRROR_SHIELD) {
                            stolenCardClone = this.props.playersData[opponentIndex].cardsBoard.
                            cardsStacks[attackedField][cardIndex].clone();
                            break;
                        }
                }
            } 
            this.setState({stolenCard: stolenCardClone, stolenCardOpponent:opponentIndex});
        } else if (this.state.attackingCard.cardName === CardObj.PICK_CARD){
            // The opponent's hand cards will be visible to the user, so that the user can pick
            let newIsVisible = [false, false, false, false];
            newIsVisible[opponentIndex] = true;
            this.setState({isHandCardsVisible: newIsVisible});
            this.stopHighlighting();
        }
    }

    /**
     * It handles modifying the logic and the view(if needed) when a player plays a card.
     * @param {Card} playedCard It's the card object for the played card.
     * @param {boolean} isPlayedSameCard is true if the play used "same card".
     * @param {Card} stolenCard is the card that was stolen by either normal shield stealing, 
     *  mirror shield stealing, or stone stealling.
     * @param {int} playerIndex It's the player index in props.playersData which is the same
     *  as myTurnIndex in BottomPlayer and PlayerSide.
     * @param {int} opponentField It's the filed index (0...3) that's targeted. (It sets to 0 if 
     *  playedCard does not target an oppoent).
     * @param {int} opponentIndex It's the opponent player index in props.playersData which is
     *   the same as myTurnIndex in BottomPlayer and PlayerSide. (It sets to 0 if playedCard
     *   does not target an oppoent).
     * @param {boolean} isPlayedCardPick true if the player is using pick a card.
     */
    setOnPlay = (playedCard, isPlayedSameCard, stolenCard, playerIndex, opponentField,
         opponentIndex, isPlayedCardPick = false) => {
        this.stopHighlighting();
        // check if it's one of the cards that should be displayed in the middle of the screen
        let allowedToBeDisplayed = [CardObj.HAMMER,
            CardObj.SHIELD_DETROYER, CardObj.STONE_STEALLING, CardObj.MIRROR_SHIELD_STEALLING, 
            CardObj.NORMAL_SHIELD_STEALLING, CardObj.PICK_CARD, CardObj.PLAY_TWICE, 
            CardObj.SAME_CARD, CardObj.PREVENT_NEXT_TURN];
        if (allowedToBeDisplayed.includes(playedCard.cardName)) {
            this.setState({lastNonShildStoneCard: playedCard});
        }
        // telling online opponents my play.
        if (this.gameMode === "online" && this.props.turnIndex === 0) {
            this.state.onlineOpponents.sendAct(["play", playedCard,
            isPlayedSameCard, stolenCard, this.props.turnIndex, opponentField,
            opponentIndex, (isPlayedCardPick) ? true : this.isPlayingPick()]);
        }
        // showing that this player has played a particular card
        this.setState({
            isInfoScreenShown: true,
            infoScreenType: "playingCard",
            shownCardObj: playedCard
        });
        // after finishing showing that info, the turn will be switched, and the card will be played
        setTimeout(() => {
            this.setState({
                isInfoScreenShown: false,
                infoScreenType: "",
                shownCardObj: null
            });
             // check if pick a card has been played.
            let havePlayedPick = (isPlayedCardPick) ? true 
            : this.isPlayingPick();
            this.props.playCard(playedCard, havePlayedPick, isPlayedSameCard,
                stolenCard, playerIndex, opponentField, opponentIndex);
            if (playedCard.cardName === CardObj.PLAY_TWICE) {
                this.drawCardHandler(this.props.turnIndex, 2);
            } else {
                // It switchs turns IF there's action cards that were used.
                let prevTurn = this.props.turnIndex;
                this.props.switchTurn().then(() => {
                    // let the next turn player draws cards.
                    if (this.props.playersData[this.props.turnIndex].player.cards.length < 4) {
                        this.drawCardHandler(this.props.turnIndex, 
                            4 - this.props.playersData[this.props.turnIndex].player.cards.length);
                    } else if (this.props.playersData[this.props.turnIndex].player.cards.length === 4 
                        && prevTurn === this.props.turnIndex && prevTurn !== 0) { 
                        // it means the other chance to play/waste is because of "play twice" card
                        if (!this.props.isGameFinished) {
                            this.opponentAct();
                        }
                    }
                    
                }); 
            }
            // reset state to the initial data
            this.setState({stolenCard: null, stolenCardOpponent: null,
                isHandCardsVisible: [false, false, false, false], 
                someonePlayingSame: false});
            // signiying if a player has been affected by "prevent next turn" or "pick card"
            if (playedCard.cardName === CardObj.PREVENT_NEXT_TURN || havePlayedPick) {
                let updatedPlayers = [false, false, false, false];
                updatedPlayers[opponentIndex] = true;
                this.setState({updatedPlayers: updatedPlayers});
                setTimeout(()=> {this.setState({updatedPlayers: null})}, 2000);
            }
        }, 1500);
    }

    /**
     * It handles the event of playing restore stone.
     * @param {Card} restoredStone is the card object of the stone that will be stored.
     */
    setOnPlatRestore = (restoredStone) => {
        this.stopHighlighting();
        // showing that this player has played a particular card
        this.setState({
            isInfoScreenShown: true,
            infoScreenType: "playingCard",
            shownCardObj: new CardObj(CardObj.RESTORE_STONE, 0)
        });
        // telling my online opponents about my play
        if (this.gameMode === "online" && this.props.turnIndex === 0) {
            this.state.onlineOpponents.sendAct(["playRestore", restoredStone]);
        }
        // after finishing showing that info, the turn will be switched, and the card will be played
        setTimeout(() => {
            this.setState({
                isInfoScreenShown: false,
                infoScreenType: "",
                shownCardObj: null
            });
            this.props.playRestoreCard(restoredStone, this.state.someonePlayingSame);
            // It switchs turns IF there's action cards that were used.
            let prevTurn = this.props.turnIndex;
            this.props.switchTurn().then(() => {
                // let the next turn player draws cards.
                if (this.props.playersData[this.props.turnIndex].player.cards.length < 4) {
                    this.drawCardHandler(this.props.turnIndex, 
                        4 - this.props.playersData[this.props.turnIndex].player.cards.length);
                } else if (this.props.playersData[this.props.turnIndex].player.cards.length === 4 
                    && prevTurn === this.props.turnIndex && prevTurn !== 0) { 
                    // it means the other chance to play/waste is because of "play twice" card
                    if (!this.props.isGameFinished) {
                        this.opponentAct();
                    }
                }
            }); 
            let playedCard = new CardObj(CardObj.RESTORE_STONE, 0);
            this.setState({stolenCard: null, stolenCardOpponent: null,
                isHandCardsVisible: [false, false, false, false], lastNonShildStoneCard: playedCard, 
                someonePlayingSame: false});
        }, 1500);
    }

    /**
     * It handels changing the state and view when a player selects a card to be wasted.
     * @param {Card} wasteedCard is the card that will be wasted.
     * @param {boolean} isForShowingOnly is true if the player has decided to play
     *  a stealling card then decide to waste the stolen cards, so that this handler needs
     *  to modifies the view without the state.
     * @param {int} opponentIndex is used to indicate the opponent in playersData array
     *  in case that a player has wated the picked card
     */
    setOnWaste = (wastedCard, isForShowingOnly, opponentIndex) => {
        this.stopHighlighting();
        let isPlayingPickCard = this.isPlayingPick();
        if (!isForShowingOnly) {
            // telling my opponent about my act of wating
            if (this.gameMode === "online" && this.props.turnIndex === 0) {
                this.state.onlineOpponents.sendAct(["waste", wastedCard, opponentIndex]);
            }
            this.props.wasteCard(wastedCard, isPlayingPickCard, this.state.someonePlayingSame, 
            opponentIndex);
            this.setState({ stolenCard: null, stolenCardOpponent: null,
                isHandCardsVisible: [false, false, false, false], someonePlayingSame: false});
        }
        // check if it's one of the cards that should be displayed in the middle of the screen
        // happens only if playing pick a card then picked cards
        let pickCard = new CardObj(CardObj.PICK_CARD, 0);
        if (this.isPlayingPick()) {
            this.setState({lastNonShildStoneCard: pickCard});
            // signify the affected player.
            let updatedPlayers = [false, false, false, false];
            updatedPlayers[opponentIndex] = true;
            this.setState({updatedPlayers: updatedPlayers});
            setTimeout(()=> {this.setState({updatedPlayers: null})}, 2000);
        }
        // showing info screen for the wasted card
        this.setState({
            isInfoScreenShown: true,
            infoScreenType: "wastingCard",
            shownCardObj: wastedCard
        });
        setTimeout(() => {
            this.setState({
                isInfoScreenShown: false,
                infoScreenType: "",
                shownCardObj: null
            });
            if (! isForShowingOnly) {
                // It switchs turns IF there's action cards that were used.
                let prevTurn = this.props.turnIndex;
                this.props.switchTurn().then(() => {
                // let the next turn player draws cards.
                if (this.props.playersData[this.props.turnIndex].player.cards.length < 4) {
                    this.drawCardHandler(this.props.turnIndex, 
                        4 - this.props.playersData[this.props.turnIndex].player.cards.length);
                } else if (this.props.playersData[this.props.turnIndex].player.cards.length === 4 
                    && prevTurn === this.props.turnIndex && prevTurn !== 0) { 
                    // it means the other chance to play/waste is because of "play twice" card
                    this.opponentAct();
                }
            });   
            } 
        }, 1500);
   }

   /**
    * It is used by BottomSidePlayer to set stolenCard to 
    * null as an indicator to cancelling stealling/picking also it does the same
    * for indicating if the player is using ""same card.
    */
   cancelSteallingSameCardHandler = () => {
       this.setState({stolenCardOpponent: null, stolenCard: null,
         isHandCardsVisible: [false, false, false, false], 
        someonePlayingSame: false});
   }


   /**
    * It checks if a player has seen whether or not has played pick card and has seen cards
    * @return {Boolean}
    */
   isPlayingPick = () => {
        for (let player = 0; player < this.props.playersData.length; player++) {
            if (this.state.isHandCardsVisible[player]) {
                return true;
            }
        }
        return false;
   }

    /**
     * It handles showing the animation of drawing cards with updating the the state.
     * @param {int} playerIndex is the index on props.playersData
     * @param {int} count is the number of cards that will be drawn
     * @return {Card[]} array of the Card objects.
     */
    drawCardHandler = (playerIndex, count) => {
        // start animation.
        const anims = [
            styles.CardsDeckAnimBottm,
            styles.CardsDeckAnimRight,
            styles.CardsDeckAnimTop,
            styles.CardsDeckAnimLeft
        ];
        let audio = new Audio(TickSound);
        for (let i = 0; i < count; i++) {
            // playing animation
            setTimeout(() => {
                audio.play();
                this.setState({cardDeckClass: styles.CardsDeck + " " + anims[playerIndex]});
            }, 100 + (i * 500));
            // update state after finishing the animation.
            setTimeout(() => {
                this.setState({cardDeckClass: styles.CardsDeck});
                // if the game has not finished already
                if (!this.props.isGameFinished) {
                    // append the drawn card to the player
                    this.props.drawCards(1).then(() => {
                        if (i + 1 === count) { // if it's done drawing cards.
                            this.opponentAct();
                        }
                    });
                }
            }, 300 + (i * 500));
        }
    };

    /**
     * It checks if it's an opponent turn, if so it lets the opponent
     * plays/wastes a card. If the opponet is online, then it notifies that opponent.
     * If the opponent is AI, then it calls a function from AIOpponent that decides
     *  the action of the opponent.
     */
    opponentAct = () => {
        if (this.props.turnIndex !== 0) { // if the player is not on the bottom side.
            // if the opponent is AI
            if (this.gameMode === "offline") {
                let cardsBoard = [];
                for (let player = 0; player < this.props.playersData.length; player++) {
                    cardsBoard.push(this.props.playersData[player].cardsBoard);
                }
                let action = AIOpponent.act(
                    this.props.playersData[this.props.turnIndex], 
                    this.props.turnIndex,
                    cardsBoard, 
                    this.props.turnCount, 
                    this.setOnWaste, this.setOnPlatRestore, this.setOnPlay);
            } else {
                this.state.onlineOpponents.act(this.setOnWaste, this.setOnPlatRestore, this.setOnPlay);
            }
            
        }
    }

    /**
     * It handles the event of clicking on play again button
     */
    setOnClickPlayAgain = () => {
        // reset state of gamePlay
        this.props.finishGame();
        this.setState({
            isLangRight: (navigator.language.slice(0, 2) === "ar"),
            playersNum: this.state.playersNum,
            isPopupShown: false,
            cardDeckClass: styles.CardsDeck,
            isInfoScreenShown: false,
            infoScreenType: "",
            shownCardObj: null, 
            highlightedFields: null,
            updatedFields: null,
            attackingCard: null, 
            highlightedPlayers: null,
            updatedPlayers: null,
            stolenCard: null, 
            stolenCardOpponent: null, 
            isHandCardsVisible: [false, false, false, false], 
            lastNonShildStoneCard: null, 
            someonePlayingSame: false, 
        });
        // restate of state of store
        this.restartGame(this.props);
    }

    render () {
        let fontSize = (window.screen.width > 500) ? "large" : "small";
        let indexes = [0, 1, 2, 2];
        let topPlayerIndex = (this.props.playersData !== null) ? indexes[this.props.playersData.length - 1]
         : 0;   
        return (
            <div className={styles.GamePlay}>
                <div className={styles.HeaderPos} >
                </div>
                <div className={styles.TopPos}>
                    {(this.props.playersData !== null) 
                    ? <PlayerSide isShown={this.state.isHandCardsVisible[topPlayerIndex]} 
                    playerName= {this.props.playersData[topPlayerIndex].player.playerName}
                    handCards={this.props.playersData[topPlayerIndex].player.cards}
                    cardsStacksObj={this.props.playersData[topPlayerIndex].cardsBoard}
                    pos="top"
                    highligted={(this.state.highlightedFields === null) ? [] 
                        : this.state.highlightedFields[topPlayerIndex]} // highlighted for fields
                    isPlayerHighlighted={(this.state.highlightedPlayers !== null )
                        ? this.state.highlightedPlayers[topPlayerIndex] : false}
                    isPlayerHandSideUpdated={(this.state.updatedPlayers !== null) 
                        ? this.state.updatedPlayers[topPlayerIndex] : false}
                    onClickCard={this.setOnClickOpponentCardHandler}
                    onClickHighlighted={this.setOnClickHighlighted}
                    myTurnIndex={topPlayerIndex} 
                    currTurnIndex={this.props.turnIndex}
                    playHandler={this.setOnClickPlay}
                    updatedFields={(this.state.updatedFields !== null) 
                        ? this.state.updatedFields[topPlayerIndex] 
                        : []} />
                    : null}
                </div> 
                <div className={styles.LeftPos}>
                    {(this.props.playersData !== null && this.state.playersNum === 4) 
                    ? <PlayerSide isShown={this.state.isHandCardsVisible[3]} 
                    playerName= {this.props.playersData[3].player.playerName}
                    handCards={this.props.playersData[3].player.cards}
                    cardsStacksObj={this.props.playersData[3].cardsBoard}
                    pos="left" 
                    highligted={(this.state.highlightedFields === null) ? [] 
                        : this.state.highlightedFields[3]}// highlighted for fields
                    isPlayerHighlighted={(this.state.highlightedPlayers !== null ) 
                        ? this.state.highlightedPlayers[3] : false}
                    isPlayerHandSideUpdated={(this.state.updatedPlayers !== null) 
                        ? this.state.updatedPlayers[3] : false}
                    onClickCard={this.setOnClickOpponentCardHandler}
                    onClickHighlighted={this.setOnClickHighlighted}
                    myTurnIndex={3} currTurnIndex={this.props.turnIndex}
                    playHandler={this.setOnClickPlay}
                    updatedFields={(this.state.updatedFields !== null) 
                        ? this.state.updatedFields[3]
                        : []} />
                    : null}
                </div> 
                <div className={styles.PlayedCardPos}>
                    {(this.state.lastNonShildStoneCard !== null) 
                    ?  <Card cardObj ={this.state.lastNonShildStoneCard} isShown={true}
                     width="95%" height="90%" margin="2px"/>
                    : null}
                </div> 
                <div className={styles.RightPos}>
                    {(this.props.playersData !== null && this.state.playersNum > 2) 
                    ? <PlayerSide isShown={this.state.isHandCardsVisible[1]} 
                    playerName= {this.props.playersData[1].player.playerName} 
                    handCards={this.props.playersData[1].player.cards}
                    cardsStacksObj={this.props.playersData[1].cardsBoard} 
                    pos="right"
                    highligted={(this.state.highlightedFields === null) ? [] 
                        : this.state.highlightedFields[1]} // highlighted for fields
                    isPlayerHighlighted={(this.state.highlightedPlayers !== null )
                        ? this.state.highlightedPlayers[1] : false}
                    isPlayerHandSideUpdated={(this.state.updatedPlayers !== null) 
                        ? this.state.updatedPlayers[1] : false}
                    onClickCard={this.setOnClickOpponentCardHandler}
                    onClickHighlighted={this.setOnClickHighlighted}
                    myTurnIndex={1} currTurnIndex={this.props.turnIndex}
                    playHandler={this.setOnClickPlay}
                    updatedFields={(this.state.updatedFields !== null) 
                        ? this.state.updatedFields[1]
                        : []} />
                    : null}
                </div> 
                <div className={styles.bottomLeftPos} onClick={this.drawCardHandler}>
                    <div className={this.state.cardDeckClass} >
                        <Card isShown={false} width="95%" height="90%" margin="2px"/>
                        <Card isShown={false} width="95%" height="90%" margin="2px"/>
                    </div> 
                </div>
                <div className={styles.BottomPos}>
                    {this.props.playersData !== null 
                    ? <BottomPlayerSide playerName={this.props.playersData[0].player.playerName}
                    handCards={this.props.playersData[0].player.cards}
                    cardsStackObj={this.props.playersData[0].cardsBoard}
                    stolenCard={this.state.stolenCard}
                    stolenCardOpponent={this.state.stolenCardOpponent}
                    lastPlayedCard={this.props.playersData[0].lastPlayedCard}
                    hasAValidMove={this.hasAValidMove}
                    myTurnIndex={0} currTurnIndex={this.props.turnIndex}
                    playHandler={this.setOnPlay}
                    wasteHandler={this.setOnWaste}
                    stopHighlighting={this.stopHighlighting}
                    cancelSteallingSameCardHandler={this.cancelSteallingSameCardHandler}
                    isPlayingPick={this.isPlayingPick}
                    attackingCard={this.state.attackingCard}
                    playRestoreHandler={this.setOnPlatRestore}
                    updatedFields={(this.state.updatedFields !== null) 
                        ? this.state.updatedFields[0]
                        : []}
                    isPlayerHandSideUpdated={(this.state.updatedPlayers !== null) 
                        ? this.state.updatedPlayers[0] : false}
                     />
                     : null}
                </div>  
                <div className={styles.BottomRightPos} >
                    {(this.props.playersData !== null) 
                    ? <div className={styles.inPosGameRules}>
                        <Button text={text.getText(text.GAME_RULES)} 
                        fontSize={fontSize} handler={this.ShowGameRulesWindow}/>
                        </div>
                    : null}
                </div>  
                <Popup isLangRight={this.state.isLangRight} isShown={this.state.isPopupShown}
                screen={this.state.screenPopUp} inputHandler={this.setPlayerNumHandler} 
                hideHandler={() => this.setIsPopupShownHandler(false)}
                playAgainHandler={this.setOnClickPlayAgain}
                setUserNameHandler= {this.setUserName}
                playersNum= {this.state.playersNum}
                setOpponentNum= {this.setPlayersNumberHandler}
                linkPlayersHandler = {this.linkPlayers}/> 
                 <InfoScreen isOn={this.state.isInfoScreenShown}
                    infoType={this.state.infoScreenType}
                    shownCardObj={this.state.shownCardObj}
                    winnerName={this.props.winnerName}/> 
                {(this.state.authUI !== null) 
                ? <StyledFirebaseAuth uiConfig={this.state.authUI} firebaseAuth={firebase.auth()} /> 
                : null} 
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.playersData === null) {return;} // if the game has not been set up yet.

        
        // checking if the game has been finished
        if (this.props.isGameFinished && !prevProps.isGameFinished) {
            if (this.gameMode === "online") {
                this.state.onlineOpponents.finishGame(); // finish the game on the server
            }
            this.setState({infoScreenType: "playerWon", isInfoScreenShown: true});
            setTimeout(()=> {
                this.setState({isPopupShown: true, isInfoScreenShown: false,
                     screenPopUp: "finish game"});
            }
            , 2000);
            return;
        } else if (this.props.isGameFinished || prevProps.isGameFinished) {
            // do not do anything below if the is finished.
            return;
        }
        // checking if the current turn is the user's turn to screen infrotmation
        if ((this.props.turnIndex !== prevProps.turnIndex ||
             (prevProps.playersData === null && this.props.playersData !== null)) 
            && this.props.turnIndex == 0) {
            // show "your turn" only if the game is not over.
            if (!this.props.isGameFinished) {
                this.setState({
                    isInfoScreenShown: true,
                    infoScreenType: "userTurn",
                    shownCardObj: null
                });
                setTimeout(() => {
                    this.setState({
                        isInfoScreenShown: false,
                        infoScreenType: "",
                        shownCardObj: null
                    });
                }, 1500);
            }
        }
        // checking if there's a field whose contents has changed, so that an animation signifies this.
        if (prevProps.playersData === null) {
            return;
        }
        let updatedFields = [];
        let currStacks = null;
        let hasChanged = false;
        for (let player = 0; player < this.props.playersData.length; player++) {
            currStacks = this.props.playersData[player].cardsBoard.cardsStacks;
            updatedFields.push([]);
            for (let field = 0; field < currStacks.length; field++) {
                if (currStacks[field].length !== 
                    prevProps.playersData[player].cardsBoard.cardsStacks[field].length) {
                    updatedFields[player].push(field);
                    hasChanged = true;
                }
            }
        }
        if (hasChanged) {
            this.setState({updatedFields: updatedFields});
            setTimeout(()=> {
                this.setState({updatedFields: null});
            }
            , 3050);
        }

        // checking if the cards deck is almost finished
        if (this.props.isCardDeckFinished && !prevProps.isCardDeckFinished) {
            if (this.gameMode === "offline") {
                this.props.addCardsToDeck(true, null);
            }
        }
    }
}

const mapStateToProps = state => {
    return {
        playersData: state.playersData,
        cardsDeck: state.cardsDeck,
        turnIndex: state.turnIndex, 
        turnCount: state.turnCount, 
        isGameFinished: state.isGameFinished,
        winnerName: state.winnerName,
        isCardDeckFinished: state.isCardDeckFinished
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setupOfflineGame: (num) => dispatch(actionsType.setupOfflineGame(num)),
        switchTurn: () => {
            return new Promise((resolve, reject) => {
                dispatch(actionsType.switchTurnAction())
            resolve()
        });},
        drawCards: (count) =>  {
            return new Promise((resolve, reject) => {
                dispatch(actionsType.drawCardAction(count));
                resolve()
            });},
        playCard: (playedCard, isPlayedCardPick, isPlayedSameCard, stolenCard, playerIndex, opponentCard, opponentIndex) =>
         dispatch(actionsType.playAction(playedCard, isPlayedCardPick, isPlayedSameCard, stolenCard, playerIndex, opponentCard, opponentIndex)),
        playRestoreCard: (restoredStone, isPlayedSameCard) => dispatch(actionsType.playRestoreAction(restoredStone, isPlayedSameCard)), 
        wasteCard: (wastedCard, isPlayingPick, isPlayedSameCard, opponentIndex) => dispatch(actionsType.wasteAction(wastedCard,
             isPlayingPick, isPlayedSameCard,  opponentIndex)),
        addCardsToDeck: (isOfflineMode, retievedCard) => dispatch(actionsType.addCardsToCardsDeck(isOfflineMode, retievedCard)), 
        finishGame: () => dispatch(actionsType.finishGame()),
        setupOnlineGame: (playersInfo, currTurn, cardsNames) =>
         dispatch(actionsType.setupOnlineGame(playersInfo, currTurn, cardsNames))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePlay);