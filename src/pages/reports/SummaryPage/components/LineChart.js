import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import _ from 'lodash';
import './LineChart.scss';



export default class SpLineChart extends React.Component {
  renderLines() {
    const { lines = []} = this.props;
    return lines.map((line) => {
      const lineProps = {
        strokeWidth: 2,
        activeDot: { r: 6 },
        dot: false,
        type: 'linear',
        ...line
      };
      return <Line {...lineProps} />;
    });
  }

  renderReferenceLines() {
    const { referenceLines = []} = this.props;
    return referenceLines.map((props) => <ReferenceLine {...props} />);
  }

  render() {
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
          {/* <Legend
            verticalAlign='top'
            align='left'
            height={80}
            iconType='square'/> */}
          {this.renderReferenceLines()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
