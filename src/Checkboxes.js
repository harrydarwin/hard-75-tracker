import React from 'react';
import PropTypes from 'prop-types';

const Checkboxes = ({ goal, score }) => {
    let unchecked = goal - score;

      return (
        <div className="checkbox-grid">
            {score >= 0 ? [...Array(score)].map((e, h) => <span className='d-flex justify-content-center align-item-center' key={h}><i className="fas fa-check-square"></i></span>) : null}

            {[...Array(unchecked)].map((e, i) => <span className='d-flex justify-content-center align-item-center' key={i}><i className="far fa-square"></i></span>)}
        </div>
      );
    }

    Checkboxes.propTypes = {
        goal: PropTypes.number,
        score: PropTypes.number,
      }

  export default Checkboxes;