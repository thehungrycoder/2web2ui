import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer, ReferenceLine } from 'recharts';
import _ from 'lodash';
import './LineChart.scss';
const colors = ['#37aadc', '#9bcd5a', '#b70c9e', '#e3af00', '#6D39A1'];

export default class SpLineChart extends React.Component {
  constructor (props) {
    super(props);
    const { lines = [] } = this.props;

    let colorIndex = 0;

    this.state = {
      lines: lines.map((line) => ({
        stroke: colors[colorIndex++],
        strokeWidth: 2,
        activeDot: { r: 6 },
        dot: false,
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
      xTickFormatter = _.identity,
      yTickFormatter = _.identity,
      tooltipLabelFormatter = _.identity,
      tooltipValueFormatter = _.identity
    } = this.props;

    return (
      <ResponsiveContainer width='99%' height={480}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="4 1"/>
          <XAxis
            tickFormatter={xTickFormatter}
            dataKey='ts'
            interval={1}
            height={30} />
          <YAxis
            tickLine={false}
            width={30}
            tickFormatter={yTickFormatter}/>

          <Tooltip
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipValueFormatter}
          />
          <Legend
            verticalAlign='bottom'
            iconType='circle'/>
          {this.renderReferenceLines()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
