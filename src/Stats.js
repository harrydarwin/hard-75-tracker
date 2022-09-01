import React from 'react';
import PropTypes from 'prop-types';


const Stats = (props) => {

    const totalPLayers = props.players.length;
    const totalPoints = props.players.reduce( (total, player) => {
        return total + player.score;
    }, 0);

    return (
        <table className="stats">
  <tbody>
    <tr>
      <td>Players:</td>
      <td>{ totalPLayers }</td>
    </tr>
    <tr>
      <td>Team total:</td>
      <td>{ totalPoints }</td>
    </tr>
  </tbody>
</table>
    );
}

Stats.propTypes = {
  players: PropTypes.arrayOf(PropTypes.shape({
    score: PropTypes.number
  }))
}

export default Stats;