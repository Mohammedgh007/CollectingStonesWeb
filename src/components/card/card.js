/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This component is a view object that represent a card. Each shown card in the 
    screen is represented by this component.
Note:
    cardObj: It's instance of /store/object/card that store the card name/type.
    isShown: whether the card front is shown to the user or not. Usually false 
        for opponents' cards.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React from 'react';
import CardObj from '../../store/objects/Card.js';

import backCard from '../../assets/Logos/cardBack.svg';
import redStone from '../../assets/Logos/redStone.svg';
import orangeStone from '../../assets/Logos/orangeStone.svg';
import blueStone from '../../assets/Logos/blueStone.svg';
import greenStone from '../../assets/Logos/greenStone.svg';
import multicolorStone from '../../assets/Logos/multicolorStone.svg';
import absoluteShield from '../../assets/Logos/absoluteShield.svg';
import normalShield from '../../assets/Logos/normalShield.svg';
import mirrorShield from '../../assets/Logos/mirrorShield.svg';
import hammer from '../../assets/Logos/hammer.svg';
import shieldDestroyer from '../../assets/Logos/sheildDestroyer.svg';
import stoneStealling from '../../assets/Logos/stoneStealling.svg';
import mirrorShieldStealling from '../../assets/Logos/mirrorShieldStealling.svg';
import normalShieldStealing from '../../assets/Logos/normalShieldStealling.svg';
import pickCard from '../../assets/Logos/pickCard.svg';
import playTwice from '../../assets/Logos/playTwice.svg';
import restoreStone from '../../assets/Logos/restoreStone.svg';
import sameCard from '../../assets/Logos/sameCard.svg';
import preventNextTurn from '../../assets/Logos/preventPlaying.svg';

const card = (props) => {
    let cardObj = props.cardObj;
    let imgSrc = "";
    let onClickEvt = null;
    if (props.handler) {
        onClickEvt = props.handler.bind(cardObj);
    }
    if (props.isShown) {
        switch (cardObj.cardName) {
            case CardObj.RED_STONE: 
                imgSrc = redStone;
            break;
            case CardObj.ORANGE_STONE: 
                imgSrc = orangeStone;
            break;
            case CardObj.BLUE_STONE: 
                imgSrc = blueStone;
            break;
            case CardObj.GREEN_STONE: 
                imgSrc = greenStone;
            break;
            case CardObj.NORMAL_SHIELD: 
                imgSrc = normalShield;
            break;
            case CardObj.MIRROR_SHIELD: 
                imgSrc = mirrorShield;
            break;
            case CardObj.ABSOLUTE_SHIELD: 
                imgSrc = absoluteShield;
            break;
            case CardObj.HAMMER: 
                imgSrc = hammer;
            break;
            case CardObj.SHIELD_DETROYER: 
                imgSrc = shieldDestroyer;
            break;
            case CardObj.STONE_STEALLING: 
                imgSrc = stoneStealling;
            break;
            case CardObj.NORMAL_SHIELD_STEALLING: 
                imgSrc = normalShieldStealing;
            break;
            case CardObj.MIRROR_SHIELD_STEALLING: 
                imgSrc = mirrorShieldStealling;
            break;
            case CardObj.PICK_CARD: 
                imgSrc = pickCard;
            break;
            case CardObj.PLAY_TWICE: 
                imgSrc = playTwice;
            break;
            case CardObj.PREVENT_NEXT_TURN: 
                imgSrc = preventNextTurn;
            break;
            case CardObj.RESTORE_STONE: 
                imgSrc = restoreStone;
            break;
            case CardObj.SAME_CARD: 
                imgSrc = sameCard;
            break;
            case CardObj.MULTICOLOR_STONE: 
                imgSrc = multicolorStone;
            break;
        }
    } else {
        imgSrc = backCard;
    }

    return (
        <img src= {imgSrc}
         width={props.width}
         height= {props.height}
         style={{display:"block", margin:props.margin}} 
         onClick={onClickEvt} />
    );
};

export default card;