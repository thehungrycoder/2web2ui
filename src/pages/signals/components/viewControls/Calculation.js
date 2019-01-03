import React from 'react';
import PropTypes from 'prop-types';
import ControlGroup from './ControlGroup';

const options = {
  absolute: 'Absolute',
  relative: 'Relative'
};

const Calculation = (props) => (
  <ControlGroup {...props} options={options} />
);

Calculation.propTypes = {
  initialSelected: PropTypes.oneOf(['absolute', 'relative']),
  onChange: PropTypes.func
};

Calculation.defaultProps = {
  initialSelected: 'absolute'
};

export default Calculation;
