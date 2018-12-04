import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';
import _ from 'lodash';
import './Sparkline.scss';

class Sparkline extends Component {

  renderTooltip = (props) => {
    const content = _.get(props, 'payload[0]', {});
    const date = _.get(content, 'payload.date');
    return <TooltipWrapper date={date} children={this.props.tooltipContent(content)} />;
  };

  render() {
    const { timeSeries, height, width, yKey, dot, yRange, activeDot, stroke, onClick, tooltipContent } = this.props;

    return (
      <div className='SparklineWrapper'>
        <ResponsiveContainer height={height} width={width}>
          <LineChart data={timeSeries} onClick={onClick}>
            <YAxis hide dataKey={yKey} type='number' domain={yRange} />
            <Line
              activeDot={activeDot}
              dataKey={yKey}
              dot={dot}
              stroke={stroke}
              strokeWidth={1}
              isAnimationActive={false}
            />
            {tooltipContent && (
              <Tooltip
                isAnimationActive={false}
                cursor={false}
                content={this.renderTooltip}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

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
  yRange: [0, 100]
};

export default Sparkline;
