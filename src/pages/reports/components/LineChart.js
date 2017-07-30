import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import _ from 'lodash';

const colors = ['#37aadc', '#9bcd5a', '#b70c9e', '#e3af00', '#6D39A1'];

export default class SpLineChart extends React.Component {
  constructor (props) {
    super(props);
    const { lines = [] } = this.props;

    let colorIndex = 0;

    this.state = {
      lines: lines.map((line) => ({
        stroke: colors[colorIndex++],
        activeDot: { r: 6 },
        type: 'linear',
        ...line
      }))
    };
  }

  renderLines () {
    const { lines = [] } = this.state;
    return lines.map((props) => <Line {...props} />);
  }

  renderReferenceLines () {
    const { referenceLines = [] } = this.props;
    return referenceLines.map((props) => <ReferenceLine {...props} />);
  }

  render () {
    const {
      data,
      tickFormatter = _.identity,
      tooltipLabelFormatter = _.identity,
      tooltipValueFormatter = _.identity
    } = this.props;

    return (
      <ResponsiveContainer width='100%' aspect={2}>
        <LineChart data={data}>
          <XAxis tickFormatter={tickFormatter} dataKey='ts'/>
          <YAxis/>
          <CartesianGrid strokeDasharray="2 2"/>
          <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />
          <Legend verticalAlign='top' wrapperStyle={{ paddingBottom: '30px' }} />
          {this.renderReferenceLines()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
