import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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

  getDomain() {
    const { yLabel, yScale } = this.props;
    let domain = yScale === 'log' ? domain = [0.001, 'auto'] : [0, 'auto'];

    if (yLabel === 'Percent') {
      domain = [0, 100];
    }

    return domain;
  }

  render() {
    const {
      data,
      lines = [],
      syncId,
      xTickFormatter = _.identity,
      yTickFormatter = _.identity,
      yScale = 'linear', // eslint-disable-line
      tooltipLabelFormatter = _.identity,
      tooltipValueFormatter = _.identity,
      showXAxis,
      yLabel
    } = this.props;

    const domain = this.getDomain();

    return (
      <div className='sp-linechart-wrapper'>
        <ResponsiveContainer width='99%' height={120 * lines.length}>
          <LineChart data={data} syncId={syncId}>
            <CartesianGrid vertical={false} strokeDasharray="4 1"/>
            <XAxis
              tickFormatter={xTickFormatter}
              dataKey='ts'
              interval='preserveEnd'
              height={30}
              hide={!showXAxis} />
            <YAxis
              tickFormatter={yTickFormatter}
              tickLine={false}
              width={60}
              scale={yScale}
              domain={domain}
              allowDataOverflow={yScale === 'log'} />
            <Tooltip
              labelFormatter={tooltipLabelFormatter}
              formatter={tooltipValueFormatter}
              itemSorter={orderDesc} />
            {this.renderReferenceLines()}
            {this.renderLines()}
          </LineChart>
        </ResponsiveContainer>
        <span className='sp-linechart-yLabel'>{yLabel}</span>
      </div>
    );
  }
}
