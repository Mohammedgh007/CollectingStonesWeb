/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file manages showing window that contains options for how to use 
    his/her clicked card.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import React from 'react';
import styles from './optionsWindow.module.css';

import Button from '../../UI/Button/button.js';
import * as text from '../../UI/lang/gamePlayScreenLang';
import CardObj from '../../store/objects/Card.js';
import RadioBtn from '../../UI/RadioBtn/radioBtn';

const optionsWindow = (props) => {

    let buttons = [(<Button text={text.getText(text.WASTE)} key="wasteBtn"
     handler={() => props.clickWasteHandler(props.cardName)} />)];
    let canBePlayable;
    if (Array.isArray(props.playable)) {
        canBePlayable = props.playable.includes(true);
    } else {
        canBePlayable = props.playable;
    }
    if (canBePlayable) {
        buttons.push((<Button text={text.getText(text.PLAY)} key="playBtnOpt" 
        handler={() => props.clickPlayHandler(props.cardName)}/>));
    }

    let shownText = "";
    switch(props.cardName) {
        case CardObj.RED_STONE:
            shownText = text.getText(text.RED_STOEN);
        break;
        case CardObj.ORANGE_STONE:
            shownText = text.getText(text.ORANGE_STOEN);
        break;
        case CardObj.BLUE_STONE:
            shownText = text.getText(text.BLUE_STOEN);
        break;
        case CardObj.GREEN_STONE:
            shownText = text.getText(text.GREEN_STOEN);
            break;
        case CardObj.MULTICOLOR_STONE:
            shownText = text.getText(text.MULTICOLOR_STONE);
            break;
        case CardObj.NORMAL_SHIELD:
            shownText = text.getText(text.NORMAL_SHIELD);
            break;
        case CardObj.MIRROR_SHIELD:
            shownText = text.getText(text.MIRROR_SHIELD);
            break;
        case CardObj.ABSOLUTE_SHIELD:
            shownText = text.getText(text.ABSOLUTE_SHIELD);
            break;
        case CardObj.HAMMER:
            shownText = text.getText(text.HAMMER);
            break;
        case CardObj.SHIELD_DETROYER:
            shownText = text.getText(text.SHEILD_DESTROYER);
            break;
        case CardObj.STONE_STEALLING:
            shownText = text.getText(text.STONE_STEALLING);
            break;
        case CardObj.MIRROR_SHIELD_STEALLING:
            shownText = text.getText(text.MIRROR_SHIELD_STEALLING);
            break;
        case CardObj.NORMAL_SHIELD_STEALLING:
            shownText = text.getText(text.NORMAL_SHEILD_STEALLING);
            break;
        case CardObj.PICK_CARD:
            shownText = text.getText(text.PICK_CARD);
            break;
        case CardObj.PLAY_TWICE:
            shownText = text.getText(text.ANOTHER_TURN);
            break;
        case CardObj.RESTORE_STONE:
            shownText = text.getText(text.RESTORE);
            break;
        case CardObj.SAME_CARD:
            shownText = text.getText(text.SAME_CARD);
            break;
        case CardObj.PREVENT_NEXT_TURN:
            shownText = text.getText(text.PREVENT_PLAYING);
            break;
    }

    let restoredCardOptions = null; // canBePlayable
    if (Array.isArray(props.playable) || 1 === 1) {
        restoredCardOptions = (
            <div>
                <RadioBtn text={text.getText(text.SELECT_PLAYERS_NUM)}
                    isLangRight={((navigator.language.slice(0, 2) === "ar"))} 
                    handler={props.selectRestoredHandler}
                    radioBtnType={"select resoted stone"}
                    playableArr={props.playable}/>
                    <span style={{marginTop:"15px"}}/>
            </div>
        );
    }
    return ( (props.visible) ?
        <div className={styles.ContainerWindow}>
            <div className={styles.BackgroundDiv} onClick={props.closeHandler}/>
            <div className={styles.OptionsWindow}>
                <label>{shownText}</label>
                <div className={styles.OptionsWindowBtnLayout}>
                    {buttons}
                </div>
                {restoredCardOptions}    
            </div>
        </div>
        : null
    );
};

export default optionsWindow;