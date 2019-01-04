import React from 'react';
import _ from 'lodash';
import { Dot } from 'recharts';
import { formatPrecisePercent } from 'src/helpers/units';
import colorMapByRank from '../../constants/colorMapByRank';
import Sparkline from '../charts/sparkline/Sparkline';
import TooltipMetric from '../charts/tooltip/TooltipMetric';
import EmptyDataCell from './EmptyDataCell';

const StyledDot = (props) => (
  <Dot {...props} fill={colorMapByRank[props.payload.ranking]} stroke="#FFFFFF" />
);

const SparklineDataCell = ({ data, dataKey, label, onClick = () => {}, relative }) => {
  const currentDate = _.last(data).date;
  const isEmpty = data.every((values) => values[dataKey] === null);

  if (isEmpty) {
    return <EmptyDataCell />;
  }

  return (
    <Sparkline
      activeDot={StyledDot}
      dot={(props) => {
        if (props.payload.date === currentDate) { // only show for current date
          return <StyledDot {...props} />;
        }

        return null;
      }}
      onClick={(data) => {
        if (data) { // if a user doesn't click a dot, data === null
          onClick(data.activePayload[0].payload);
        }
      }}
      timeSeries={data}
      tooltipContent={({ payload, value = null }) => {
        if (value === null) {
          return null;
        }

        return (
          <TooltipMetric
            color={colorMapByRank[payload.ranking]}
            label={label}
            value={relative ? formatPrecisePercent(value) : value.toLocaleString()}
          />
        );
      }}
      yKey={dataKey}
    />
  );
};

export default SparklineDataCell;
