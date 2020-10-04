/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This UI component handles making a responsive styled button that
    execute a passed handler when clicked.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React from 'react';

import styles from './button.module.css';

const buttonUI = (props) => {
    return (
        <div className= {styles.ButtonUISurroundColor}>
            <button className= {styles.ButtonUI} onClick= {props.handler} style={{fontSize:props.fontSize}}>
                {props.text}
            </button>
        </div>
    );
};


export default buttonUI;