import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';
import _ from 'lodash';

/**
 * HorizontalBar
 * @example
 *    <HorizontalBar
 *      barData={{ value: 50, fill: 'blue', date: new Date() }}
 *      xRange={[0,50]}
 *      tooltipContent={(payload) => <div>Value: {payload.value}</div>} />
 */

class HorizontalBar extends Component {
  renderTooltip = (props) => {
    const content = _.get(props, 'payload[0]', {});
    const date = _.get(content, 'payload.date');
    return <TooltipWrapper date={date} children={this.props.tooltipContent(content)} />;
  };

  render() {
    const { barData, height, width, xKey, onClick, xRange, tooltipContent } = this.props;

    return (
      <div className='LiftTooltip'>
        <ResponsiveContainer height={height} width={width}>
          <BarChart
            barCategoryGap={0}
            barGap={0}
            barSize={height}
            data={[barData]}
            layout='vertical'
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <YAxis hide type='category' />
            <XAxis hide dataKey={xKey} type='number' domain={xRange} />
            <Bar
              dataKey={xKey}
              isAnimationActive={false}
              onClick={onClick} />
            {tooltipContent && (
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                content={this.renderTooltip}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

HorizontalBar.propTypes = {
  tooltipContent: PropTypes.func,
  barData: PropTypes.object.isRequired,
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
