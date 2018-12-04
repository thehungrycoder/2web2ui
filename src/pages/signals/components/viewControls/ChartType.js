import React from 'react';
import PropTypes from 'prop-types';
import ControlGroup from './ControlGroup';

const options = {
  line: 'Line',
  bar: 'Bar'
};

const ChartType = (props) => (
  <ControlGroup {...props} options={options} />
);

ChartType.propTypes = {
  initialSelected: PropTypes.oneOf(['bar', 'line']),
  onChange: PropTypes.func
};

ChartType.defaultProps = {
  initialSelected: 'line'
};

export default ChartType;
