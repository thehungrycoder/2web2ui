import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { formatDate } from 'src/helpers/date';
import _ from 'lodash';
import styles from './Sparkline.module.scss';

const TooltipWrapper = ({ children, ...props }) => (
  <div className={styles.TooltipWrapper}>
    <div className={styles.TooltipDate}>
      {formatDate(_.get(props, 'payload[0].payload.date'))}
    </div>
    <div className={styles.TooltipContent}>
      {children}
    </div>
  </div>
);

const SparkLine = ({ data, height, width, dataKey, dot, activeDot, tooltipContent, stroke, onClick }) => (
  <div>
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
          content={(props) => <TooltipWrapper children={tooltipContent(_.get(props, 'payload[0]', {}))} />}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

SparkLine.defaultProps = {
  dataKey: 'value',
  dot: false,
  height: 30,
  stroke: '#000000',
  tooltipContent: _.noop,
  width: '100%'
};

export default SparkLine;
