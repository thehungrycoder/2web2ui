import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Text } from 'recharts';
import _ from 'lodash';
import './LineChart.scss';

function orderDesc(a, b) {
  return b.value - a.value;
}

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
      lines = [],
      syncId,
      xTickFormatter = _.identity,
      yTickFormatter = _.identity,
      tooltipLabelFormatter = _.identity,
      tooltipValueFormatter = _.identity
    } = this.props;

    return (
      <ResponsiveContainer width='99%' height={120 * lines.length}>
        <LineChart data={data} syncId={syncId}>
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
          <Text
            angle={270}
          >By Count</Text>
          <Tooltip
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipValueFormatter}
            itemSorter={orderDesc}
          />
          {this.renderReferenceLines()}
          {this.renderLines()}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
