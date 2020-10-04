/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file shows and manages a popup window that receives inputs from the user.
    Those inputs are selected based on the prop screen.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React, { useRef } from 'react';

import RadioBtn from '../RadioBtn/radioBtn.js';
import Button from '../Button/button.js';
import TextField from '../TextField/textFieldUI';
import Card from '../../components/card/card.js';
import CardObj from '../../store/objects/Card.js';
import * as text from '../../UI/lang/gamePlayScreenLang.js';
import * as textRules from '../../UI/lang/gameRulesLang.js'; 
import styles from './popup.module.css';

const Popup = (props) => {
    let elements = null;
    let direct = (props.isLangRight) ? "rtl" : "ltr";
    let textAllign = (props.isLangRight) ? "right" : "left";
    const popupElement = useRef();
    switch (props.screen) {
        case "offlineSetUp":
            elements = (
                <div className={styles.Background}>
                    <div className={styles.Popup} ref={popupElement}>
                        <RadioBtn text={text.getText(text.SELECT_PLAYERS_NUM)}
                        isLangRight={props.isLangRight} handler={props.inputHandler}
                        radioBtnType={"players number"}/>
                        <span style={{marginTop:"15px"}}/>
                        <Button text= {text.getText(text.BEGIN_PLAY)}
                         handler={props.hideHandler}/>
                    </div>
                </div>
            );
        break;
        case "onlineSetUp":
            elements = (
                <div className={styles.Background}>
                    <div className={styles.Popup} ref={popupElement}>
                        <TextField allignRight={(props.isLangRight)}
                          text={text.getText(text.USER_NAME)}
                          handler={props.setUserNameHandler}
                          playerIndex = {0}/>
                        <RadioBtn text={text.getText(text.SELECT_PLAYERS_NUM)}
                          isLangRight={props.isLangRight} handler={props.inputHandler}
                          radioBtnType={"players number"}/>
                        <TextField allignRight={(props.isLangRight)}
                          text={text.getText(text.OPPONENT1NUM)}
                          handler={props.setOpponentNum}
                          playerIndex = {1}/>
                        <span style={{marginTop: 20}}/>
                        {(props.playersNum >= 3) 
                        ? <TextField allignRight={(props.isLangRight)}
                            text={text.getText(text.OPPONENT2NUM)}
                            handler={props.setOpponentNum}
                            playerIndex = {2}/>
                        : null}
                        <span style={{marginTop: 20}}/>
                        {(props.playersNum == 4) 
                        ? <TextField allignRight={(props.isLangRight)}
                            text={text.getText(text.OPPONENT3NUM)}
                            handler={props.setOpponentNum}
                            playerIndex = {3}/>
                        : null}
                        <span style={{marginTop: 50}}/>
                        <label>{text.getText(text.PHONE_NOTE)}</label>
                        <Button text= {text.getText(text.BEGIN_PLAY)} 
                          handler={props.linkPlayersHandler}/>
                    </div>
                </div>
            );
        break;
        case "loading":
                elements = (
                <div className={styles.Background}>
                    <div className={styles.Popup} ref={popupElement}>
                        <div className={styles.loader}>Loading...</div>
                    </div>
                </div>
                );
        break;
        case "game rules":
            let cardHeight = "fit-content";
            let cardWidth = "10%";
            let clickBackgroundHieght = (popupElement.current === null)  ? "100%"
            : popupElement.current.clientHeight;
            elements = (
                <div className={styles.Background} >
                    <div className={styles.ClickBackgound} onClick={props.hideHandler}
                     />
                    <div className={styles.Popup} ref={popupElement}>
                        <p>{textRules.getText(textRules.FUNDEMENTAL_RULES)}</p>
                        <ul style={{direction:direct, textAlign: textAllign}}>
                            <li>{textRules.getText(textRules.RULE1)}</li>
                            <li>{textRules.getText(textRules.RULE2)}</li>
                            <li>{textRules.getText(textRules.RULE3)}</li>
                            <li>{textRules.getText(textRules.RULE4)}</li>
                            <li>{textRules.getText(textRules.RULE5)}</li>
                            <li>{textRules.getText(textRules.RULE6)}</li>
                            <li>{textRules.getText(textRules.RULE7)}</li>
                            <li>{textRules.getText(textRules.RULE8)}</li>
                            <li>{textRules.getText(textRules.RULE9)}</li>
                            <li>{textRules.getText(textRules.RULE10)}</li>
                        </ul>
                        <p>{textRules.getText(textRules.CARD_DISC)}</p>
                        <ul style={{direction:direct, textAlign: textAllign}}>
                            <li>
                                {textRules.getText(textRules.CARD_RED_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.RED_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_ORANGE_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.ORANGE_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_BLUE_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.BLUE_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_GREEN_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.GREEN_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_NORMAL_SHIELD)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.NORMAL_SHIELD, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_MIRROR_SHIELD)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.MIRROR_SHIELD, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_ABSOLUTE_SHIELD)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.ABSOLUTE_SHIELD, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_HAMMER)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.HAMMER, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_SHIELD_DETROYER)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.SHIELD_DETROYER, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_STONE_STEALLING)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.STONE_STEALLING, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_NORMAL_SHIELD_STEALLING)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.NORMAL_SHIELD_STEALLING, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_MIRROR_SHIELD_STEALLING)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.MIRROR_SHIELD_STEALLING, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_PICK_CARD)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.PICK_CARD, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_PLAY_TWICE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.PLAY_TWICE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_PREVENT_NEXT_TURN)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.PREVENT_NEXT_TURN, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_RESTORE_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.RESTORE_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_SAME_CARD)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.SAME_CARD, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                            <li>
                                {textRules.getText(textRules.CARD_MULTICOLOR_STONE)}
                                <Card isShown={true} cardObj={new CardObj(CardObj.MULTICOLOR_STONE, 0)} 
                                width={cardWidth} height={cardHeight} margin="1px"/>
                            </li>
                        </ul>
                        <Button text= {textRules.getText(textRules.CLOSE)}
                         handler={props.hideHandler}/>
                    </div>
                </div>
            );
        break;
        case "finish game":
            elements = (
                <div className={styles.Background}>
                    <div className={styles.PopupFinishGame}>
                        <Button text= {text.getText(text.PLAY_AGAIN)}
                         handler={props.playAgainHandler} fontSize={"50pt"}/>
                    </div>
                </div>
            );
        break;
    }

    return (
        props.isShown ? elements : null
    );
};


export default Popup;