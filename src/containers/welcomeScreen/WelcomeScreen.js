/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This view file shows and manages the welcome screen.  Next, after the user
    finishes from inputing the data, this class set ups the game and forwards the user
    to layout.js 
functions:
    + playOfflineHandler(): -> It takes the user to play offline mode.
    + playOnlineHandler(): -> It takes the user to play online mode.
    + playTutorial():  It takes the player to play tutorial Mode.
    - showOnlineMode(): React.Component -> The returned components handle taking inputs from
        the user and setup the online game.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import React, {Component} from 'react';

import * as text from '../../UI/lang/welcomeScreenLang.js';
import CardObj from '../../store/objects/Card.js';

import Button from '../../UI/Button/button.js';
import Card from '../../components/card/card.js'; // background cards.
import styles from './WelcomeScreen.module.css';

class WelcomeScreen extends Component{

    constructor(props) {
        super(props);
    }

    /**
     * It takes the user to paly offline mode
     */
    playOfflineHandler = () =>{
        this.props.history.replace("/offline");
    }

    /**
     * It takes the user to paly onnline mode
     */
    playOnlineHandler = () =>{
        this.props.history.replace("/online");
    }

    /**
     * It takes the user to paly tutorial mode
     */
    playTutorialModeHandler = () =>{
        this.props.history.replace("/tutorial");
    }
    
    render () {
        
        const cardWidth = "auto";
        const cardHeight = "auto";

        return (
            <div className= {styles.WelcomeScreen}>
                <header className={styles.TitleText}>{text.getText(text.WELCOME)}</header>
                <form >
                    {/*<p className={styles.SubTitleText}>{text.getText(text.SELECT_MODE)}</p>*/}
                    <span style={{marginTop: "12px"}}/>  
                    <Button text= {text.getText(text.PLAY_AI)} fontSize="large"
                    handler={this.playOfflineHandler}/>
                    <Button text= {text.getText(text.PLAY_ONLINE)} fontSize="large"
                    handler={this.playOnlineHandler}/>
                    {/*<Button text= {text.getText(text.PLAY_TUTORIAL)} fontSize="large"
                    handler={this.playTutorialModeHandler}/>*/}
                     
                </form>
                <span className={styles.CardsRow}>
                    <div className={styles.cardsSize}>
                        <Card isShown={true} cardObj={new CardObj(CardObj.ORANGE_STONE, 0)} 
                        width={cardWidth} height={cardHeight} margin="4px"/>
                    </div>
                    <div className={styles.cardsSize}>
                        <Card isShown={true} cardObj={new CardObj(CardObj.RED_STONE, 0)} 
                        width={cardWidth} height={cardHeight} margin="4px"/>
                    </div>
                    <div className={styles.cardsSize}>
                        <Card isShown={false} cardObj={null} 
                        width={cardWidth} height={cardHeight} margin="4px"/>
                    </div>
                    <div className={styles.cardsSize}>
                        <Card isShown={true} cardObj={new CardObj(CardObj.BLUE_STONE, 0)} 
                        width={cardWidth} height={cardHeight} margin="4px"/>
                    </div>
                    <div className={styles.cardsSize}>
                        <Card isShown={true} cardObj={new CardObj(CardObj.GREEN_STONE, 0)} 
                        width={cardWidth} height={cardHeight} margin="4px"/>
                    </div>
                    
                </span>
            </div>
        );
    }
}

export default WelcomeScreen;