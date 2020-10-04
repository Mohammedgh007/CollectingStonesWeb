import React from 'react';
import './App.css';
import WelcomeScreen from './containers/welcomeScreen/WelcomeScreen.js';
import GamePlay from './containers/GamePlay/GamePlay.js';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {

  let fontLang = '';
  if (navigator.language.slice(0, 2) === "en") {
      fontLang = "'Do Hyeon', sans-serif";
  } else {
      fontLang = "'Changa', sans-serif";
  }
  
  return (
    <div className="App" style={{fontFamily: fontLang}}>
      <BrowserRouter>
      <Switch>
        <Route path='/:gameMode' component={GamePlay}/>
        <Route path='/' component={WelcomeScreen}/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
