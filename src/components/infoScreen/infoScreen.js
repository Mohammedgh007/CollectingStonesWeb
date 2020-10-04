/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: It shows information for the user during the game. The information are either:
 1- It's the user's turn,
 2- A player has played a card.
 3- A player has wasted a card.
 4- Or a player has won. 
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import React from 'react';
import styles from './infoScreen.module.css';
import * as text from '../../UI/lang/gamePlayScreenLang.js';
import Card from '../card/card.js';

const infoScreen = (props) => {
    if (props.infoType === "wastingCard" && props.isOn) {
        return (
            <div className={styles.InfoScreen}>
                <label className={styles.ShownText}>{text.getText(text.WASTING)}</label>
                <Card isShown={true} cardObj={props.shownCardObj} 
                        width="30%" height="40%" margin="auto"/>
            </div>
        );
    }  else  if (props.infoType === "playingCard" && props.isOn) {
        return (
            <div className={styles.InfoScreen}>
                <label className={styles.ShownText}>{text.getText(text.PLAYING)}</label>
                <Card isShown={true} cardObj={props.shownCardObj} 
                        width="30%" height="40%" margin="auto"/>
            </div>
        );
    } else if (props.infoType === "userTurn" && props.isOn) {
        return (
            <div className={styles.InfoScreen}>
                <label className={styles.ShownText}>{text.getText(text.YOUR_TURN)}</label>
            </div>
        );
    } else if (props.infoType === "playerWon" && props.isOn) {
        return (
            <div className={styles.InfoScreen}>
                <label className={styles.ShownText}>{props.winnerName}</label>
                <label className={styles.ShownText}>{text.getText(text.WON_PLAYER)}</label>
            </div>
        );
    } else {
        return null;
    }
};

export default infoScreen;