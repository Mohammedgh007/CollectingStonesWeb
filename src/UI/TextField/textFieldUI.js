/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This UI component handles showing a label with text input with storing the
    user input.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React from 'react';

import styles from './textFieldUI.module.css';
import * as text from '../lang/gamePlayScreenLang.js';

const textFieldUI = (props) => {
    let allignClass = null;
    if (props.allignRight) {
        allignClass = styles.langRight;
    } else {
        allignClass = styles.langLeft;
    }

    let onChangeFun = (props.playerIndex !== 0) 
    ?  (event) => props.handler(event.target.value, props.playerIndex)
    : (event) => props.handler(event.target.value);
    return (
        <span className={allignClass}>
            <label >{props.text}</label>
            <input onChange={onChangeFun}
             placeholder={text.getText(text.TYPE_HERE)}
             className={allignClass}/>
        </span>
    );
};


export default textFieldUI;