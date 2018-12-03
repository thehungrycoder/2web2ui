import React, { Component } from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis, Rectangle } from 'recharts';
// import TooltipWrapper from '../tooltip/Tooltip'; TODO when sparkline pr is merged
import _ from 'lodash';

class HorizontalBar extends Component {
  renderBar = (props) => (
    <Rectangle radius={[0, 4, 4, 0]} {...props} />
  )

  render() {
    const { data, height, width, dataKey, onClick, domain } = this.props;

    return (
      <ResponsiveContainer height={height} width={width}>
        <BarChart
          barCategoryGap={0}
          barGap={0}
          barSize={height}
          data={[data]}
          layout='vertical'
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <YAxis hide dataKey='date' type='category' />
          <XAxis hide dataKey={dataKey} type='number' domain={domain} />
          <Bar
            dataKey={dataKey}
            isAnimationActive={false}
            shape={this.renderBar}
            onClick={onClick} />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            // content={this.renderTooltip} TODO when sparkline pr is merged
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

HorizontalBar.defaultProps = {
  dataKey: 'value',
  domain: [0, 100],
  height: 25,
  tooltipContent: _.noop,
  width: '99%' // Not responsive with 100%
};

export default HorizontalBar;
