import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getPlayers, addNewPlayer, auth, updatePlayerData, logout, resetUser, registerWithEmailAndPassword } from "./firebase";
import PropTypes from 'prop-types';
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";


const quoteArray = [
  "Drink more water,",
  "Lets get this bread!",
  "Proud of you,",
  "This is the encouragement bar,",
  "Grower Gang or die,",
  "Hell yes this is baby shit,",
  "You're lookin good today,",
  "Have you called your mother recently,",
  "Drop and give me 20,",


]
const today = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();

class App extends Component {
  state = {
    goal: 75,
    today: today,
    loggedIn: false,
    currentUser: {},
    players:  [],
    inactivePlayers: [],
    quotes: quoteArray
  };


  // Player id counter
  prevPlayerId = 4;



  componentDidMount() {

    this.handleGetPlayers();
    this.currentUserCheck();
  }

  getQuote = () => {
    const quoteArray = this.state.quotes;
    const quote =  quoteArray[Math.floor(Math.random()*quoteArray.length)];
    console.log(quote);
    return quote;
  }

  currentUserCheck = () => {
    this.setState(prevState => ({
      loggedIn:   prevState.currentUser !== {} ? true : false,
    }))

  }

  handleGetPlayers = () => {
    const currentPlayers = getPlayers();
    // console.log(currentPlayers)
    currentPlayers.then(data => {
      let currentUser = false;
      if(auth.currentUser){
        const playerId = auth.currentUser['uid']
        // console.log(data, auth, playerId)
        let allPlayers = data.active.concat(data.inactive);
          currentUser = allPlayers.filter(u => u.uid === playerId);
      }
      // console.log(currentUser)
      this.setState({
        ...this.state,
        currentUser: currentUser[0] ? currentUser[0] : {},
        players: data.active,
        inactivePlayers: data.inactive
      })
    })
  }

  handleLogout = () => {
    if(this.state.loggedIn){
      logout();
    }
    this.setState(prevstate => ({
      loggedIn: !prevstate.loggedIn
    }))
  }

  handleCurrentUser = (user) => {
    // console.log(user);
    const currentPlayers = getPlayers();
    // const loggedUser = checkUser();
    currentPlayers.then(data => {
      let currentUser = false;
      if(auth.currentUser){
        const playerId = auth.currentUser['uid'];
        let allPlayers = data.active.concat(data.inactive);
          currentUser = allPlayers.filter(u => u.uid === playerId);
      }
      console.log(currentUser)
      this.setState({
        currentUser: currentUser[0],
        loggedIn: true
      });
    })
  }

  handleScoreChange = (index, delta) => {

    if (this.state.players[index].lastDate !== today) {
      const pl = this.state.players[index];
      updatePlayerData(pl.uid, pl.score + 1, today);
      this.setState(prevState => ({
        score: prevState.players[index].score += delta,
        players: prevState.players.map(function (player, i) {
          if (i === index) {
            return { ...player, lastDate: today }
          }
          return player
        })
      }));
    } else {
      console.log('Cheating is not permitted...');
    }
  }


  getHighScore = () => {
    const scores = this.state.players.map(p => p.score);
    const highScore = Math.max(...scores);
    if (highScore) {
      return highScore;
    }
    return null;
  }

  handleAddPlayer = (name) => {
    addNewPlayer(this.state.currentUser.uid, name);
    this.handleGetPlayers();
    this.setState(prevState => {
      return {
        players: [
          ...prevState.players,
          {
            name,
            score: 0,
            id: this.prevPlayerId += 1
          }
        ]
      }
    });
  }

  handleRegister = (name, email, password) => {
    registerWithEmailAndPassword(name, email, password);
    this.handleGetPlayers();
  }


  handleRemovePlayer = (id, prevAttempts) => {
console.log(prevAttempts)
    resetUser(id, prevAttempts);
    this.handleGetPlayers();
    // this.setState(prevState => {
    //   return {
    //     players: prevState.players.filter(p => p.id !== id)
    //   };
    // });
  }

  render() {
    // console.log(this.state, this.state.currentUser)
    const highscore = this.getHighScore();
    return (
      <div className="app d-flex flex-column justify-content-center align-items-around">
      <h1 className='text-center mt-2'>75 Hard</h1>
      <h2 className='text-center mt-2'>Grower Gang edition</h2>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login
            handleCurrentUser={this.handleCurrentUser}
           />} />
          <Route exact path="/register" element={<Register
            registerUser={this.handleRegister}
           />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard
              getPlayers={this.handleGetPlayers}
              currentUser={this.state.currentUser}
              players={this.state.players}
              goal={this.state.goal}
              getQuote={this.getQuote}
              highscore={highscore}
              fLogout={this.handleLogout}
              changeScore={ this.handleScoreChange }
              removePlayer={this.handleRemovePlayer}
              addPlayer={this.handleAddPlayer}
            />} />
        </Routes>
      </Router>
      {/* <div className="scoreboard">
        <Header
          title="GM - 75 Hard"
          players={this.state.players}
        />

        * Players list *
        {this.state.players.map( (player, index) =>
          <Player
            name={player.name}
            score={player.score}
            goal={this.state.goal}
            id={player.uid}
            player={player}
            key={player.uid}
            index={ index }
            attempts={player.attempts}
            currentPlayer={this.state.currentUser}
            isHighscore={highscore === player.score}
            changeScore={ this.handleScoreChange }
            removePlayer={this.handleRemovePlayer}
          />
        )}

          <AddPlayerForm
            addPlayer={this.handleAddPlayer}
            currentPlayer={this.state.currentUser}
           />
      </div> */}
    </div>
    );
  }
}

App.propTypes = {
  players: PropTypes.array,
  handleScoreChange: PropTypes.func,
  removePlayer: PropTypes.func
}

export default App;
