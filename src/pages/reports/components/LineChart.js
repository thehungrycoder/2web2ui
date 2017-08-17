import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import _ from 'lodash';
import './LineChart.scss';

// const colors = ['#37aadc', '#9bcd5a', '#b70c9e', '#e3af00', '#6D39A1'];
const colors = ['#20578E', '#F38415', '#45A6FF', '#FFD300', '#41B5AB', '#6BEAA8'];

export default class SpLineChart extends React.Component {
  renderLines () {
    const { lines = [] } = this.props;
    let colorIndex = 0;
    return lines.map((line) => {
      const lineProps = {
        strokeWidth: 2,
        activeDot: { r: 6 },
        dot: false,
        type: 'linear',
        ...line,
        stroke: line.stroke || colors[colorIndex++]
      };
      return <Line {...lineProps} />;
    });
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
            verticalAlign='top'
            align='left'
            height={80}
            iconType='square'/>
          {this.renderReferenceLines()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
