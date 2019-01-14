import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis, CartesianGrid, Rectangle, Text } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';
import _ from 'lodash';
import styles from './DivergingBar.module.scss';

class DivergingBar extends Component {
  getData = () => {
    const { data, xKey, positiveFill, negativeFill } = this.props;
    return data && data.map((item) => ({ ...item, fill: item[xKey] > 0 ? positiveFill : negativeFill }));
  }

  getHeight = () => {
    const { data, barHeight } = this.props;
    return data && data.length * barHeight;
  }

  renderBar = ({ key, background, payload, ...props }) => {
    const { selected, yKey } = this.props;
    const width = background.x + background.width;
    return (
      <g>
        <rect
          {...props}
          key={`${key}-bg`}
          x={0}
          x1={0}
          x2={width}
          width={width}
          fill='#5DCFF5'
          opacity={selected && selected === payload[yKey] ? 0.3 : 0}
        />
        <Rectangle key={key} {...props} />
      </g>
    );
  }

  renderYTick = ({ payload, ...props }) => {
    const { data, selected, yKey, yLabel } = this.props;
    const match = _.find(data, [yKey, selected]) || {};
    const label = yLabel ? yLabel(payload) : payload.value;

    if (payload.value === match[yKey]) {
      return <Text {...props} fill='#0B83D6'>{label}</Text>;
    }

    return <Text {...props}>{label}</Text>;
  }

  render() {
    const { tooltipContent, onClick, width, xDomain, xKey, yKey } = this.props;
    return (
      <ResponsiveContainer height={this.getHeight()} width={width} className={styles.DivergingBar}>
        <BarChart data={this.getData()} layout='vertical' barCategoryGap={2}>
          <CartesianGrid
            horizontal={false}
            shapeRendering='crispEdges'
            stroke='#d2d2d7'
          />
          <Bar
            cursor='pointer'
            dataKey={xKey}
            onClick={onClick}
            isAnimationActive={false}
            shape={this.renderBar}
            minPointSize={1}
          />
          <YAxis
            type='category'
            tickLine={false}
            axisLine={false}
            interval={0}
            dataKey={yKey}
            padding={{ bottom: 5 }}
            tick={this.renderYTick}
            width={140}
          />
          <XAxis
            hide
            type='number'
            tickLine={false}
            domain={xDomain}
            dataKey={xKey}
            shapeRendering='crispEdges'
            ticks={[0]}
          />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={<TooltipWrapper children={tooltipContent} />}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

DivergingBar.propTypes = {
  negativeFill: PropTypes.string,
  onClick: PropTypes.func,
  positiveFill: PropTypes.string,
  tooltipContent: PropTypes.func,
  xDomain: PropTypes.array,
  xKey: PropTypes.string,
  yKey: PropTypes.string,
  yLabel: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

DivergingBar.defaultProps = {
  barHeight: 35,
  xDomain: ['dataMin', 'dataMax'],
  xKey: 'value',
  yKey: 'label',
  width: '99%',
  negativeFill: '#DB2F2D',
  positiveFill: '#8CBE3C'
};

export default DivergingBar;
