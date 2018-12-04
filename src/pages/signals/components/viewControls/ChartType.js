import React from 'react';
import PropTypes from 'prop-types';
import ControlGroup from './ControlGroup';
import { ShowChart, BarChart } from '@sparkpost/matchbox-icons';

const options = {
  line: <ShowChart/>,
  bar: <BarChart/>
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
