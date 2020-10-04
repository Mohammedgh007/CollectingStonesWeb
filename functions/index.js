/*
/////////////////\\\\\\\\\\\\\\\\\\\\\
Author: Mohammed Alghamdi
Porpuse: This file contains the functions that are used to manage the server side.
Notes:
  1- This code is stored and executed in the servers, so clients cannot access it.
  2- Those functions are the only representation for the server side. 
  3- the players are identified by their phone numbers.
functions: 
  + prepareOnlineGameStart(data, context): Boolean -> It's used to start the process
  of linking a player with his/her online friends.
  + onAddPlayer(snapchat, context): Promise -> It's a database trigger that's called
  whenever a player is database to the database through prepareOnlineGameStart. 
  - linkOnlineOpponents(myData): Promise -> It's used inside onAddPlayer()
  for creating the game when all players have be added to the database.
  - finishLinking(data, opponentsData): Promise -> It's a heper function for 
  linkOnlineOpponents(data, opponentsData) That's called only after all players are added
  in the database. It performs the actual game creating after making sure that the listed
  opponents want to play withc each other.
  - hasTheSameOpponents(myData, potentialOpponentData): Boolean -> It's a helper function for
  finishLinking(). It checks if the given two players have the same phone number for the opponents
  or not.
  - createCardsDeck(): -> It's a helper function for finishLinking(). It creates the list of 
  cards' names for the cards' deck. 
  + onStartGame(snapchat, context): -> It's a trigger function that's called whenever a game
  is created to clean matchmaking from the players that are already matched.
  + sendAct(data, context): Promise -> This function should be called from the client 
  side when a player act(play or waste), so that the other opponet can sync. 
  + deleteGame(data, context): -> It deletes the node of the game, which 
  indicates the end of the game.
/////////////////\\\\\\\\\\\\\\\\\\\\\
*/

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);



/**
 * It begins the process of linking players by editing the opponents
 * numbers, which are inputted in the client side.
 * @note if the user do not want to play with 3 players, then -1 is used
 *  for opponent3Num and/or data.opponent2Num
 * @param {String} data.opponent1Num stores the phone number for opponent 1
 * @param {String} data.opponent2Num stores the phone number for opponent 2
 * @param {String} data.opponent3Num stores the phone number for opponent 3
 * @param {string} data.name stores the name of this player.
 * @return {boolean} true for success and false otherwise 
 */
exports.prepareOnlineGameStart = functions.https.onCall((data, context) => {
  if (data !== null && context.auth) {
    const phoneNumber = context.auth.token.phone_number;
    let playersNums = [phoneNumber];
    if (data.opponent1Num !== -1) {
      playersNums.push(data.opponent1Num);
    }
    if (data.opponent2Num !== -1) {
      playersNums.push(data.opponent2Num);
    }
    if (data.opponent3Num !== -1) {
      playersNums.push(data.opponent3Num);
    }
    playersNums.sort((p1, p2) =>  p1.localeCompare(p2));
    let gameID = "";
    for (let playerNum of playersNums) {
      gameID += playerNum;
    }

    // delete previous if exist then add a new one
    admin.database().ref("matchmaking/" + phoneNumber).remove().then((result) => {
      admin.database().ref("matchmaking/" + phoneNumber).set({
        name: data.name,
        phoneNumber: phoneNumber,
        opponent1Num: data.opponent1Num,
        opponent2Num: data.opponent2Num,
        opponent3Num: data.opponent3Num
      });
    })
    return [true, gameID];
  } else {
    return [false, null];
  }
});


/**
 * It's a database trigger that's called whenever a player is added by 
 * prepareOnlineGameStart(). The functionality of this function is that it
 * creates the game when all players have called prepareOnlineGameStart().
 */
exports.onAddPlayer = functions.
database.ref('/matchmaking/{phone_number}').onCreate((snapchat, context) => {
  if (snapchat.val().opponent1Num !== -1) {
    let myData = {
      opponent1Num: snapchat.val().opponent1Num,
      opponent2Num: snapchat.val().opponent2Num,
      opponent3Num: snapchat.val().opponent3Num,
      name: snapchat.val().name, 
      phoneNumber: snapchat.val().phoneNumber
    };
    return linkOnlineOpponents(myData); 
  }
})


/**
 * It's called when there's a write inside onAddPlayer(). It checks if all
 * the players are added to the database. If so, then it creates the game 
 * deleting their data from matchmaking and create a node in activeGame.
 * @param {Object} myData is the node's values in database for that causes
 * calling onAddPlayer. 
 * @return {Promise} for fulfiling the rules of Cloud Functions.
 */
function linkOnlineOpponents(myData) {
    // searching for the opponents cunccrently by using promises
    let findOpponentsPromises = [];
    let retrievedData = [null, null, null];
    findOpponentsPromises.push(
      new Promise((resolve, reject) => {
        admin.database().ref("matchmaking/" + myData.opponent1Num).once('value').
          then((snapchat) => {
            if (snapchat.val() !== null) {
              retrievedData[0] = snapchat.val();
              resolve(true);
            } else {
              resolve(false);
            }
          });
      })
    );
    // fidning opponent 2
    if (myData.opponent2Num !== -1) {
      findOpponentsPromises.push(
        new Promise((resolve, reject) => {
          admin.database().ref("matchmaking/" + myData.opponent2Num).once('value').
            then((snapchat) => {
              if (snapchat.val() !== null) {
                retrievedData[1] = snapchat.val();
                resolve(true);
              } else {
                resolve(false);
              }
            });
        })
      );
    }

    // finding opponent 3
    if (myData.opponent3Num !== -1) {
      findOpponentsPromises.push(
        new Promise((resolve, reject) => {
          admin.database().ref("matchmaking/" + myData.opponent3Num).once('value').
            then((snapchat) => {
              if (snapchat.val() !== null) {
                retrievedData[2] = snapchat.val();
                resolve(true);
              } else {
                resolve(false);
              }
            });
        })
      );
    }

    let wrapperPromise = new Promise((resolve, reject) => {
      Promise.all(findOpponentsPromises).then((results) => {
        // check if the users' inputed numbers that are found; otherwise, it returns []
        for (let result of results) {
          if (!result) { // true result if the opponent number is found on the database
            resolve(false);
            return;
          }
        }
        let cleanedData = []; // removing nulls from retrievedData
        for (let i = 0; i < 3; i++) {
          if (retrievedData[i] !== null) {
            cleanedData.push(retrievedData[i]);
          }
        }

        // assuring that the opponents want to play with each other.
        for (let opponentData of cleanedData) {
          if (!hasTheSameOpponents(myData, opponentData)) {
            // return empty because not both players want to play with
            // each other
            return;
          }
        }
        resolve(finishLinking(myData, cleanedData));
      });
    })
    return  wrapperPromise;
}

/**
 * It's a heper function for 
 * linkOnlineOpponents(data, opponentsData) That's called only after all players are added
 * in the database. It performs the actual game creating after making sure that the listed
 * opponents want to play withc each other.
 * @param {Object} data represent the node's value for the last added player.
 * @param {Object[]} opponentsData is an array that holds objects as data ^^ but for opponents.
 */
function finishLinking(data, opponentsData) {
  return new Promise((resolve, reject) => {
    // the linking is finished by either returning the names of players in a 
    // unified order based on the phone numbers' sorting, or returning the same
    // after writing their data on the database by the user whose phone number is
    // the first at the sorted list, so that the writing occur by one user.
    let myData = data;
    let playersInfo = [myData];
    for (let opponent of opponentsData) {
      playersInfo.push(opponent);
    }
    playersInfo.sort((p1, p2) =>  p1.phoneNumber.localeCompare(p2.phoneNumber));
    let gameID = "";
    for (let player of playersInfo) {
      gameID += player.phoneNumber;
    }
    // do the writing and return the unified list.
    const cardsDeck = createCardsDeck();
    admin.database().ref("activeGame/" + gameID).set({
      gameID: gameID,
      playersInfo: playersInfo,
      cardsDeck: cardsDeck,
      act: "no yet",
      actID: 0
  }).then((value) => {resolve(true);});
  })    
}

/**
 * It's a helper function for linkOnlineOpponents() that checks if the found opponent have the 
 * opponents' data, so that it ensures that each user want to play with the
 * same players. It returns true if both opponents have the same opponents.
 * @param {Object} myData is the node's values in database for that causes
 * calling onAddPlayer.
 * @param {Object} potentialOpponentData is the same as myData but for the opponent.
 * @return {Boolean} true if both players want to play with each other, false otherwise.
 */
function hasTheSameOpponents(myData, potentialOpponentData) {
  let myPlayers = [myData.opponent1Num, myData.opponent2Num, myData.opponent3Num,
     myData.phoneNumber];
  let myOpponentPlayers = [potentialOpponentData.opponent1Num, potentialOpponentData.opponent2Num,
    potentialOpponentData.opponent3Num, potentialOpponentData.phoneNumber];
  let found = [false, false, false, false];
  let sreachedIn = [0, 1, 2, 3];
  let deletedIndex = 0;
  for (let i = 0; i < 4; i++) {
    for (let seachingIndex of sreachedIn) {
      if (myPlayers[i] === myOpponentPlayers[seachingIndex]) {
        found[i] = true;
        deletedIndex = sreachedIn.indexOf(seachingIndex);
        break;
      }
    }
    if (found[i]) {
      sreachedIn.splice(deletedIndex, 1);
    }
  }
  for (let hasfound of found) {
    if (!hasfound) {
      return false;
    }
  }
  return true;
}

/**
 * this is a helper function for finishLinking(). It creates a string list of cards' names
 * for cards' deck.
 * @return {String[]} the names of cards in a randomized order.
 */
function createCardsDeck() {
  // create an array of cards' names with specifying quantities
  let cardsTypes = [
    ["red stone", 8],
    ["orange stone", 8],
    ["blue stone", 8],
    ["green stone", 8],
    ["multicolor stone", 8], 
    ["normal shield", 32],
    ["mirror shield", 8],
    ["absolute shield", 4],
    ["hammer", 32],
    ["shield detroyer", 4],
    ["normal shield stealling", 4],
    ["mirror shield stealling", 4],
    ["stone stealling", 3],
    ["pick card", 3], // see oponent cards and pick one.
    ["play twice", 8],
    ["restore stone", 4],
    ["same card", 4], //same card as last turn.
    ["prevent next turn", 4]
  ];

  // create arrays of cards
  let cardsNameSeq = [];
  for (let arr of cardsTypes) {
      for(let i = 0; i < arr[1]; i++) {
        cardsNameSeq.push(arr[0]);
      }
  }

  // shuffle
  let currIndex = cardsNameSeq.length;
  let randomIndex = 0;
  let tempVal = 0;
  while (currIndex != 0) {
      randomIndex = Math.floor(Math.random() * currIndex);
      currIndex -= 1;

      tempVal = cardsNameSeq[currIndex];
      cardsNameSeq[currIndex] = cardsNameSeq[randomIndex];
      cardsNameSeq[randomIndex] = tempVal;
  } 
  return cardsNameSeq;
}

/**
 * It's a trigger function that's called whenever a game is created to clean matchmaking from
 * the players that are already matched.
 */
exports.onStartGame = 
functions.database.ref("/activeGame/{new_game_id}").onCreate((snapchat, context) => {
  admin.database().ref("matchmaking/" + snapchat.val().playersInfo[0].phoneNumber).remove();
  admin.database().ref("matchmaking/" + snapchat.val().playersInfo[1].phoneNumber).remove();
  admin.database().ref("matchmaking/" + snapchat.val().playersInfo[2].phoneNumber).remove();
  admin.database().ref("matchmaking/" + snapchat.val().playersInfo[3].phoneNumber).remove();
})


/**
 * This function should be called from the client side when a player act(play or waste), so that
 * the other opponet can sync. 
 * @param {String} data.gameID is the id of the game in activeGame.
 * @param {Object} data.act is json object that stores the data related to the act.
 * @return {String} done for seccuss, not done for error, cancelled when the game was cancelled
 * because an opponet has left.
 */
exports.sendAct = functions.https.onCall((data, context) => {
  if (data !== null && context.auth) {
    return new Promise((resolve, reject) => {
    admin.database().ref("activeGame/" + data.gameID).once('value').then((snapchat) => {
      if (snapchat.val() !== null) {
        admin.database().ref("activeGame/" + data.gameID).update({
          act: data.act,
          actID: data.actID
        });
        resolve("done");
      } else {
        resolve("not done");
      }
    })
  });
  } else {
    return "note done"
  }
})

/**
 * It deletes the node of the game, which indicates the end of the game.
 * @param {String} data.gameID is the id of the game in activeGame.
 */
exports.deleteGame = functions.https.onCall((data, context) => {
  if (data !== null && context.auth) {
    admin.database().ref("activeGame/" + data.gameID).remove();
    return "done";
  } else {
    return "ERROR";
  }
})