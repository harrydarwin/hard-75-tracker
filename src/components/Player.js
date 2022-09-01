import React ,{ PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Counter from './Counter';
import Checkboxes from './Checkboxes';
import LogoutButton from './LogoutButton';

class Player extends PureComponent {

  static propTypes = {
    changeScore: PropTypes.func,
    removePlayer: PropTypes.func,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    id: PropTypes.string,
    index: PropTypes.number
  }

  render() {

    const { name, index, score, id, goal, isHighscore, removePlayer, changeScore, player, attempts, currentPlayer } = this.props;
    console.log(currentPlayer)
    // console.log(currentPlayer.uid, player.uid)
    const removeBtn = currentPlayer.uid && currentPlayer.uid == player.uid ? <LogoutButton removePlayer={removePlayer} userId={id} failedAttempts={currentPlayer.attemptsFailed}/> : '';
    console.log(removeBtn)
    const addBtn =  currentPlayer.uid && currentPlayer.uid == player.uid;
    return (
      <div className="player py-1">
        <span className="player-name">

          {/* <button className="remove-player" onClick={() => removePlayer(id)}>✖</button> */}
        {removeBtn}

          <Icon isHighscore={isHighscore} />

          { player.displayName != "false" ? player.displayName : name}
        </span>

        <Counter
            changeScore={ changeScore }
            index={index}
            score={ score }
            showAddBtn={addBtn} />
        <Checkboxes
            goal={goal}
            score={score}
             />
      </div>
    );
  }
}

export default Player;