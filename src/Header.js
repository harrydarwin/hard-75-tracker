import React from 'react';
import PropTypes from 'prop-types';
import Stats from './Stats';

const Header = ({ players, title }) => {
  // const { players, title } = props;
    return (
      <header>
        <Stats
            players={players}
        />
        <h1>{ title }</h1>
        {/* <Stopwatch /> */}
      </header>
    );
  }

  Header.propTypes = {
    title: PropTypes.string,
    players: PropTypes.arrayOf(PropTypes.object)
  }

  Header.defaultProps = {
    title: 'Scoreboard',
  }

  export default Header;