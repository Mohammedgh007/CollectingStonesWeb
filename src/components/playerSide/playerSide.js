/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file represents a player side of hand's cards and played cards.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React from 'react';
import Card from '../card/card.js';
import CardObj from '../../store/objects/Card.js';
import styles from './playerSide.module.css';
import * as text from '../../UI/lang/gamePlayScreenLang.js';

const playerSide = (props) => {
    // making a space that represents an empty spot.
    let emptySpot = (
        <div style={{margin:"3px", width:"20%", height:"100%"}}/>
    );
    // adding the cards to the correct spot.
    let handCard = [];
    let handCardObjs = props.handCards;
    let handCardWidth = (100 / handCardObjs.length) - 3;
    handCardWidth = handCardWidth.toString() + "%";
    let playedCard = [emptySpot, emptySpot, emptySpot, emptySpot];
    for (let i = 0; i < handCardObjs.length; i++) {
        handCard.push((
            <Card isShown={props.isShown} cardObj={handCardObjs[i]}
                key={handCardObjs[i].cardName + i.toString() + props.playerName + "hand"} 
                margin="3px"
                width={handCardWidth}
                height="90%"
                handler={() => {
                    props.onClickCard(handCardObjs[i], props.myTurnIndex);
                }}/>
        ));
    }
    let cardsStacks = props.cardsStacksObj.cardsStacks;
    for (let i = 0; i < 4; i++) {
        playedCard[i] = [];
        for (let j = 0; j < cardsStacks[i].length; j++) {
            playedCard[i].unshift((
                <Card isShown={true} cardObj={cardsStacks[i][j]}
                    key={cardsStacks[i][j].cardName + i.toString() + props.playerName} 
                    margin="3px"
                    width="100%"
                    height="100%"
                    handler={() => {}}/>
            ));
        }
    }
        
    
    // selecting the right css class based on the turn or being clickable by the user.
    let classesName = styles.PlayerSide;
    // notify the user if it's now the opponent's turn 
    let clickSideHandler = null;
    if (props.currTurnIndex === props.myTurnIndex) {
        classesName += " " + styles.BackgroundCurrTurnAnim;
    } else if (props.isPlayerHighlighted) {
        // determinning if there's an event for clicking the player side
        clickSideHandler = () => props.onClickHighlighted(-1, props.myTurnIndex);
        classesName += " " + styles.HighlightedPlayerSide;
    }

    // selecting the right class for showing cards' stack and determinning if there's click event
    // or to show a change in a stack's contents.
    let cardsStackClass = [styles.OneCardStack, styles.OneCardStack, styles.OneCardStack, styles.OneCardStack];
    let clickFieldHandle = [null, null, null, null];
    for (let i of props.updatedFields) {
        cardsStackClass[i] = styles.OneCardStackUpdated;
    } 
    for (let i of props.highligted) {
        cardsStackClass[i] = styles.OneCardStackHighlighted;
        clickFieldHandle[i] = () => props.onClickHighlighted(i, props.myTurnIndex);
    }

    // selecting the css class for handside, which is either regular looking or orange for
    // signifying playing "prevent next turn" or "pick a card"
    let handSideClass;
    if (props.isPlayerHandSideUpdated) {
        handSideClass = styles.HandSideUpdated;
    } else {
        handSideClass = styles.HandSide;
    }
    return (
        <div className={classesName} onClick={clickSideHandler}>
            <div className={handSideClass}>
                    <div className={styles.HandSideCards}>
                        {handCard}
                    </div>
                    <div className={styles.HandSideName}>
                        {props.playerName}
                    </div>
                </div>
            <div className={styles.PlayedCardSide}>
                <div className={cardsStackClass[0]} onClick={clickFieldHandle[0]}>
                    {playedCard[0]}
                    <label className={styles.HandSideName}>1</label>
                </div>
                <div className={cardsStackClass[1]} onClick={clickFieldHandle[1]}>
                    {playedCard[1]}
                    <label className={styles.HandSideName}>2</label>
                </div>
                <div className={cardsStackClass[2]} onClick={clickFieldHandle[2]}>
                    {playedCard[2]}
                    <label className={styles.HandSideName}>3</label>
                </div>
                <div className={cardsStackClass[3]} onClick={clickFieldHandle[3]}>
                    {playedCard[3]}
                    <label className={styles.HandSideName}>4</label>
                </div>
            </div>
        </div>
    );
};


export default playerSide;