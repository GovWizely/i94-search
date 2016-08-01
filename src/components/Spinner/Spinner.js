import React, { PropTypes } from 'react';
import 'spinkit/css/spinners/8-circle.css';
import './Spinner.scss';

const Spinner = (props) => {
  if (!props.active) return null;
  return (
    <div className="explorer__spinner">
      <div className="sk-circle">
        <div className="sk-child sk-circle1"></div>
        <div className="sk-child sk-circle2"></div>
        <div className="sk-child sk-circle3"></div>
        <div className="sk-child sk-circle4"></div>
        <div className="sk-child sk-circle5"></div>
        <div className="sk-child sk-circle6"></div>
        <div className="sk-child sk-circle7"></div>
        <div className="sk-child sk-circle8"></div>
        <div className="sk-child sk-circle9"></div>
        <div className="sk-child sk-circle10"></div>
        <div className="sk-child sk-circle11"></div>
        <div className="sk-child sk-circle12"></div>
      </div>
    </div>
  );
};

Spinner.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default Spinner;
