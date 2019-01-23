import React from 'react';
import PropTypes from 'prop-types';
import { Rectangle, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';

/**
 * HorizontalBar
 * @example
 *    <HorizontalBar
 *      value={{ value: 50, fill: 'blue', date: new Date() }}
 *      xRange={[0,50]}
 *      tooltipContent={(payload) => <div>Value: {payload.value}</div>} />
 */

const HorizontalBar = ({ color, value, height, width, xKey, onClick, xRange, tooltipContent }) => (
  <div className='LiftTooltip'>
    <ResponsiveContainer height={height} width={width}>
      <BarChart
        barCategoryGap={0}
        barGap={0}
        barSize={height}
        data={[value]}
        layout='vertical'
        margin={{ top: 0, left: 18, bottom: 0, right: 18 }}
      >
        <YAxis hide type='category' />
        <XAxis hide dataKey={xKey} type='number' domain={xRange} />
        <Bar
          dataKey={xKey}
          isAnimationActive={false}
          onClick={onClick}
          shape={(props) => <Rectangle {...props} fill={color} />}
        />
        <Tooltip
          cursor={false}
          isAnimationActive={false}
          content={<TooltipWrapper children={tooltipContent} />}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

HorizontalBar.propTypes = {
  tooltipContent: PropTypes.func,
  value: PropTypes.object.isRequired,
  xKey: PropTypes.string,
  XRange: PropTypes.array
};

HorizontalBar.defaultProps = {
  height: 25,
  width: '99%', // Not responsive with 100%
  xKey: 'value',
  xRange: [0, 100]
};

export default HorizontalBar;
