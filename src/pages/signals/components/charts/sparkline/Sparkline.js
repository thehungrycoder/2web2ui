import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';

/**
 * Sparkline
 * @example
 *    <Sparkline
 *      timeSeries={[{ hits: 0.1, date: new Date() }, ...]}
 *      yRange={[0,1]}
 *      yKey='hits'
 *      tooltipContent={(payload) => <div>Hits: {payload.value}</div>} />
 */

const Sparkline = ({ timeSeries, height, width, yKey, dot, yRange, activeDot, stroke, onClick, tooltipContent }) => (
  <div className='LiftTooltip'>
    <ResponsiveContainer height={height} width={width}>
      <LineChart data={timeSeries} onClick={onClick} margin={{ top: 2, left: 18, bottom: 2, right: 18 }}>
        <YAxis hide dataKey={yKey} type='number' domain={yRange} />
        <Line
          activeDot={activeDot}
          dataKey={yKey}
          dot={dot}
          stroke={stroke}
          strokeWidth={1}
          isAnimationActive={false}
        />
        <Tooltip
          isAnimationActive={false}
          cursor={false}
          content={<TooltipWrapper children={tooltipContent} />}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

Sparkline.propTypes = {
  tooltipContent: PropTypes.func,
  timeSeries: PropTypes.array.isRequired,
  yKey: PropTypes.string,
  yRange: PropTypes.array
};

Sparkline.defaultProps = {
  dot: false,
  height: 25,
  stroke: '#000000',
  width: '100%',
  yKey: 'value',
  yRange: ['auto', 'auto']
};

export default Sparkline;
