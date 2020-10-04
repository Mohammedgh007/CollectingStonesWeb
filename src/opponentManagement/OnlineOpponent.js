/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This class handles sending the user acts and receiving the acts
of the other online users. 
methods:
   + setUser(user: AuthObject): -> It's setter for the field user.
   + startLinking(myName: String, opponent1Num: String, opponent2Num: String,
    opponent3Num: String, setupGameFun: function): -> It's used to link the players online then
    to set the game.
   + act(setOnWaste: function, setOnPlatRestore: function, setOnPlay: function): -> It listens to 
   the act of the online opponents. 
   + sendAct(actData: Object[]): -> sends the act that the online opponents are waiting for.
   + finishGame(): -> handles finishing the game in the server side.
fields:
    - user AuthObject -> It's the received object from the firebase
    authorization. 
    - turnMapping int[] -> It's used to handle the indexing's differences 
    between the server and this client. Note that each client has its index 
    as zero at ITS OWN side, which can be different from the server side.
    - myName String -> stores the name that the user inputed for himself/herself.
    + gameID String -> it is the id for the game in the server which's created only
    by the server. 
    - actID int -> It's a counter that ensures that we do not read an act twice. 
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

import Card from "../store/objects/Card";

const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/functions");


class OnlineOpponent {
    constructor() {
        this.app = firebase.initializeApp({
            apiKey: 'AIzaSyAaDEP6FrgttH-cD4LaYEhakpRYcL-51Kk ',
            authDomain: 'collectingstonegame.firebaseapp.com',
            projectId: 'collectingstonegame',
            databaseURL: 'https://collectingstonegame.firebaseio.com/',
          });
        this.user = null;
        this.turnMapping = []; 
        this.myName = "";
        this.gameID = "";
        this.actID = 0;
    }

    /**
     * it's a setter for the field user.
     * @param {AuthObject} user is the received object from firebase authorization. 
     */
    setUser(user) {
        this.user = user;
    }

    /**
     * it's used to start linking the players online to establish the game start. After it
     * starts linking, it waits the server until it establish the game then it uses the passed
     * function to setup the game.
     * @param {String} myName is the name the user has selected for himself/herself.
     * @param {String} opponent1Num the phone number of opponent 1
     * @param {String} opponent2Num the phone number of opponent 2
     * @param {String} opponent3Num the phone number of opponent 3
     * @param {function} setupGameFun is used to setup the game to start playing when the
     * game has been set up in the server side.
     */
    startLinking(myName, opponent1Num, opponent2Num, opponent3Num, setupGameFun) {
        this.myName = myName;

        const prepareLinking = firebase.functions().httpsCallable('prepareOnlineGameStart');
        let data = {
            name : myName,
            opponent1Num: opponent1Num,
            opponent2Num: opponent2Num,
            opponent3Num: opponent3Num
        };
        prepareLinking(data).then((result) => {
            if (result.data.length > 1 && result.data[0] === true) {
                this.gameID = result.data[1];
                // start listening/waiting for the game to be setup once all players joined.
                firebase.database().ref("activeGame/" + this.gameID).on("value", (snapchat) => {
                    if (snapchat.val() !== null) {
                        firebase.database().ref("activeGame/" + this.gameID).off();
                        // OnlineOpponent need to reorder gamePlayers
                        // playersInfo in a way that this user is at index 0 with maintain
                        // the same order of the others relatively to where they were
                        // and playerinfo does not include the user name for this user
                        let userIndex = 0;
                        let playersInfo = snapchat.val().playersInfo;
                        for (let i = 0; i < playersInfo.length; i++) {
                            if (playersInfo[i].phoneNumber === this.user.phoneNumber){
                                userIndex = i;
                                playersInfo[i].name = this.myName;
                            }
                        }
                        this.turnMapping.push(userIndex);
                        let i = userIndex;
                        while (this.turnMapping.length !== playersInfo.length) {
                            if (i + 1 < playersInfo.length) {
                                i++;
                            } else {
                                i = 0;
                            }
                            this.turnMapping.push(i);
                        }

                        // reorder playersInfo to make this user at index 0.
                        while (playersInfo[0].phoneNumber !== this.user.phoneNumber) {
                            playersInfo.push(playersInfo.shift());
                        }
                        setupGameFun(playersInfo, this.turnMapping[0], snapchat.val().cardsDeck);
                    }
                });               
            } else {
                alert("Try again");
            }
        })
    }

    /**
     * It listening to the act of the online opponents. 
     * @param {function} setOnWaste is the function that act() should use when the act is 
     * wasting a card. 
     * @param {function} setOnPlatRestore is the function that act() should use when the act is 
     * restoring a stone.
     * @param {function} setOnPlay is the function that act() should call when the act is playing
     * a card.
     */
    act(setOnWaste, setOnPlatRestore, setOnPlay) {
        // and a change happen at a database
        firebase.database().ref("activeGame/" + this.gameID).on("value", (snapchat) => {
            if (snapchat.val().actID > this.actID) {
                this.actID = snapchat.val().actID;
                const action = snapchat.val().act;
                // modifying playersIndex and converting the card objects to Card
                if (action[0] === "waste") {
                    action[2] = this.turnMapping[action[2]];
                    action[1] = new Card(action[1].cardName, action[1].setNum);
                    setOnWaste(action[1], false, action[2]);
                } else if (action[0] === "playRestore") {
                    action[1] = new Card(action[1].cardName, action[1].setNum);
                    setOnPlatRestore(action[1]);
                }else {
                    if (action[4] !== -1) {
                        action[4] = this.turnMapping[action[4]]
                    } 
                    if (action[6] !== -1) {
                        action[6] = this.turnMapping[action[6]]
                    }
                    action[1] = new Card(action[1].cardName, action[1].setNum);
                    if (action[3] !== undefined && action[3] !== null) {
                        action[3] = new Card(action[3].cardName, action[3].setNum);  
                    } 
                    setOnPlay(action[1],action[2], action[3], action[4],
                         action[5], action[6], action[7]);
                    // if the opponent waste the stolen stone/shield
                    if (action[1].cardName.includes("stealling") && action[3].setNum === -1) {
                        setOnWaste(action[3], true, -1);
                    }
                }
                firebase.database().ref("activeGame/" + this.gameID).off();
            }
        })
    }

    /**
     * It sends the act to the server, which the online opponents will listening to. 
     * @param {Object[]} actData It should have the same order of data as in setOnPlay() in GamePlay
     */
    sendAct(actData) {
        const writeAct = firebase.functions().httpsCallable('sendAct');
        // modifying the turnIndex to fit it to what's saved in the server
        if (actData[0] === "waste" && actData[2] !== null) {
            actData[2] = this.turnMapping[actData[2]];
        } else if (actData[0] === "play") {
            if (actData[4] !== -1) {
                actData[4] = this.turnMapping[actData[4]];
            } 
            if (actData[6] !== -1) {
                actData[6] = this.turnMapping[actData[6]]
            }
        }
        this.actID += 1;
        const data = {
            gameID: this.gameID,
            act: actData,
            actID: this.actID
        };
        writeAct(data);
    }


    /**
     * It handles deleting the data of the game in the server to indicate the end of 
     * the game.
     */
    finishGame() {
        const deleteGame = firebase.functions().httpsCallable('deleteGame');
        let data = {
            gameID: this.gameID
        };
        deleteGame(data);
    }
}

export default OnlineOpponent;