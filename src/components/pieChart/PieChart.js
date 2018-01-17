import React from 'react';
import ActiveLabel from './ActiveLabel';
import Legend from './Legend';
import Chart from './Chart';

class PieChart extends React.Component {
  static ActiveLabel = ActiveLabel;
  static Legend = Legend;
  static Chart = Chart;
}

export default PieChart;
