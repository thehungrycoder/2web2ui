import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart as RechartsBarchart, Bar, Tooltip, XAxis, YAxis, CartesianGrid, Rectangle } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';
import './BarChart.scss';

class BarChart extends Component {

  renderBar = ({ key, fill }) => {
    const { onClick, xKey, selected, yKeys, selectedFill } = this.props;

    return (
      <Bar
        cursor='pointer'
        stackId='stack'
        key={key}
        dataKey={key}
        onClick={onClick}
        fill={fill}
        isAnimationActive={false}
        shape={
          ({ payload, ...rest }) => (
            <Rectangle {...rest} fill={!yKeys && payload[xKey] === selected ? selectedFill : fill} />
          )
        }
      />
    );
  }

  renderBars = () => {
    const { yKeys, yKey, fill } = this.props;

    if (yKeys) {
      return yKeys.map(this.renderBar);
    }

    return this.renderBar({ key: yKey, fill });
  }

  renderBackgrounds = () => {
    const { xKey, selected, yKeys, onClick } = this.props;

    return (
      <Bar
        cursor='pointer'
        dataKey='noKey'
        stackId='stack'
        fill='#5DCFF5'
        isAnimationActive={false}
        onClick={onClick}
        shape={
          ({ payload, background, ...rest }) => (
            <Rectangle {...rest} {...background} opacity={yKeys && payload[xKey] === selected ? 0.4 : 0} />
          )
        }
      />
    );
  }

  render() {
    const { gap, height, timeSeries, tooltipContent, width, xKey, xAxisProps, yDomain, yAxisProps } = this.props;

    return (
      <ResponsiveContainer height={height} width={width}>
        <RechartsBarchart barCategoryGap={gap} data={timeSeries} margin={{ top: 5, left: 5, right: 18, bottom: 5 }}>
          {this.renderBackgrounds()}
          <CartesianGrid vertical={false} />
          <YAxis axisLine={false} tickLine={false} width={25} domain={yDomain} {...yAxisProps} />
          <XAxis axisLine={false} tickLine={false} dataKey={xKey} type='category' padding={{ top: 0, left: 0, right: 0 }} {...xAxisProps} />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={<TooltipWrapper children={tooltipContent} />}
          />
          {this.renderBars()}
        </RechartsBarchart>
      </ResponsiveContainer>
    );
  }
}

BarChart.propTypes = {
  fill: PropTypes.string,
  gap: PropTypes.number,
  onClick: PropTypes.func,
  tooltipContent: PropTypes.func,
  yKeys: PropTypes.arrayOf(PropTypes.object)
};

BarChart.defaultProps = {
  fill: '#B157CE',
  gap: 1,
  height: 250,
  selectedFill: '#28C0C4',
  width: '99%',
  xKey: 'date',
  yKey: 'value',
  yRange: ['auto', 'auto']
};

export default BarChart;
