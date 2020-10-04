/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file manages the radio button element.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/
import React, {useState} from 'react';

import * as text from '../lang/gamePlayScreenLang.js';
import styles from './radioBtn.module.css';
import Card from '../../components/card/card.js';
import CardObj from '../../store/objects/Card.js';

const RadioBtn = (props) => {
    const [hasCalledHandler, setHasCalledHandler] = useState(false);
    let langDirection = "";
    if (props.isLangRight) {
        langDirection = styles.langRight;
    } else {
        langDirection = styles.langLeft;
    }

    if (props.radioBtnType === "players number") {
        return (
            <div className={styles.container}>
                <p className={(props.isLangRight) ? styles.rightText : null}>{props.text}</p>
                <span className={langDirection} onClick={() => props.handler(2)}>
                    <label>
                        {(props.isLangRight) ? text.getText(text.NUM_2) : null}
                        <input type="radio" className={styles.option_input} name="playersNum" defaultChecked/>
                        {(props.isLangRight) ? null : text.getText(text.NUM_2)}
                    </label>
                </span>
                <span  className={langDirection} onClick={() => props.handler(3)}>
                    <label >
                        {(props.isLangRight) ? text.getText(text.NUM_3) : null} 
                        <input type="radio" className={styles.option_input} name="playersNum"/>
                        {(props.isLangRight) ? null : text.getText(text.NUM_3)}
                    </label>
                </span>
                <span className={langDirection} onClick={() => props.handler(4)}>
                    <label>
                        {(props.isLangRight) ? text.getText(text.NUM_4) : null}
                        <input type="radio" className={styles.option_input} name="playersNum"/>
                        {(props.isLangRight) ? null : text.getText(text.NUM_4)}
                    </label>
                </span>
            </div>
        );
    } else {
        let isDefaultCheck = [props.playableArr[0]]; 
        isDefaultCheck.push(!isDefaultCheck[0] && props.playableArr[1]);
        isDefaultCheck.push(!isDefaultCheck[0] && !isDefaultCheck[1] && props.playableArr[2]);
        isDefaultCheck.push(!isDefaultCheck[0] && !isDefaultCheck[1] && !isDefaultCheck[2] &&
            props.playableArr[3]);
        // call the handler only once in case the user has not clicked any one
        if (!hasCalledHandler) {
            for (let i = 0; i < isDefaultCheck.length; i++) {
                if (isDefaultCheck[i]) {
                    props.handler(i);
                    setHasCalledHandler(true);
                }
            }
        }
        return (
            <div className={styles.containerVertical}>
                {(props.playableArr[0]) 
                ? <div className={styles.cardRadioBtn}>
                    <label >
                        <Card isShown={true} cardObj={new CardObj(CardObj.ORANGE_STONE, 0)} 
                            width={"80%"} height={"100%"} margin="4px" />
                        <input type="radio" className={styles.option_input} name="playersNum"
                        defaultChecked={isDefaultCheck[0]} onClick={() => props.handler(0)}/>
                    </label>
                </div> 
                : null}
                {(props.playableArr[1]) 
                ? <div className={styles.cardRadioBtn}>
                    <label>
                        <Card isShown={true} cardObj={new CardObj(CardObj.RED_STONE, 0)} 
                        width={"80%"} height={"100%"} margin="4px"/>
                        <input type="radio" className={styles.option_input} name="playersNum"
                        defaultChecked={isDefaultCheck[1]} onClick={() => props.handler(1)}/>
                    </label>
                </div> 
                : null}
                {(props.playableArr[2]) 
                ? <div className={styles.cardRadioBtn}>
                    <label>
                        <Card isShown={true} cardObj={new CardObj(CardObj.GREEN_STONE, 0)} 
                        width={"80%"} height={"100%"} margin="4px"/>
                        <input type="radio" className={styles.option_input} name="playersNum" 
                        defaultChecked={isDefaultCheck[2]} onClick={() => props.handler(2)}/>
                    </label>
                </div> 
                : null}
                {(props.playableArr[3]) 
                ? <div className={styles.cardRadioBtn}>
                    <label>
                        <Card isShown={true} cardObj={new CardObj(CardObj.BLUE_STONE, 0)} 
                        width={"80%"} height={"100%"} margin="4px"/>
                        <input type="radio" className={styles.option_input} name="playersNum" 
                        defaultChecked={isDefaultCheck[3]} onClick={() => props.handler(3)}/>
                    </label>
                </div> 
                : null}
            </div>
        );
    }
    
};


export default RadioBtn;
