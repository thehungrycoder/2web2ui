/* eslint-disable */
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

  getYDomain() {
    const { yLabel, yScale } = this.props;
    const max = this.getMax();
    let domainMax = 100; // Defaults to 100 max domain so y axis always renders at least 0 - 100

    if (yLabel !== 'Percent' && max) {
      domainMax = `dataMax + ${max * 0.08}`; // Adds 8% top 'padding'
    }

    return yScale === 'log' ? [0.001, domainMax] : [0, domainMax];
  }

  // Gets max value for this LineChart
  getMax() {
    const { lines, data } = this.props;
    const lineData = _.flatten(lines.map((line) => data.map((d) => d[line.key])));
    return _.max(lineData);
  }

  getYTicks() {
    const { yLabel, yScale } = this.props;
    if (yLabel === 'Percent' && yScale === 'linear') {
      return { ticks: [0, 25, 50, 75, 100]};
    }

    // The ticks prop does not have a default value
    // Need to spread an empty object automatically set them
    return {};
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

    const yDomain = this.getYDomain();
    const yTicks = this.getYTicks();
    console.log(data);
    return (
      <div className='sp-linechart-wrapper'>
        <ResponsiveContainer width='99%' height={150 + (40 * lines.length)}>
          <LineChart data={data} syncId={syncId}>
            <CartesianGrid vertical={false} strokeDasharray="4 1"/>
            <XAxis
              tickFormatter={xTickFormatter}
              scale='utcTime'
              dataKey='ts'
              interval='preserveEnd'
              height={30}
              hide={!showXAxis} />
            <YAxis
              tickFormatter={yTickFormatter}
              {...yTicks}
              tickLine={false}
              width={60}
              scale={yScale}
              domain={yDomain}
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
