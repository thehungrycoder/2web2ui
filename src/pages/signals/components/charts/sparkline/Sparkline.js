import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import TooltipWrapper from '../tooltip/Tooltip';
import _ from 'lodash';

class Sparkline extends Component {

  renderTooltip = (props) => {
    const date = _.get(props, 'payload[0].payload.date');
    const content = _.get(props, 'payload[0]', {});
    return <TooltipWrapper date={date} children={this.props.tooltipContent(content)} />;
  };

  render() {
    const { data, height, width, dataKey, dot, activeDot, stroke, onClick } = this.props;

    return (
      <ResponsiveContainer height={height} width={width}>
        <LineChart data={data} onClick={onClick}>
          <Line
            activeDot={activeDot}
            dataKey={dataKey}
            dot={dot}
            stroke={stroke}
            strokeWidth={1}
            isAnimationActive={false}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={false}
            content={this.renderTooltip}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

Sparkline.defaultProps = {
  dataKey: 'value',
  dot: false,
  height: 30,
  stroke: '#000000',
  tooltipContent: _.noop,
  width: '100%'
};

export default Sparkline;
