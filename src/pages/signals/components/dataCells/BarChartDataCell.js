import React from 'react';
import { formatPrecisePercent } from 'src/helpers/units';
import HorizontalBar from '../charts/horizontalbar/HorizontalBar';
import TooltipMetric from '../charts/tooltip/TooltipMetric';
import colorMapByRank from '../../constants/colorMapByRank';
import EmptyDataCell from './EmptyDataCell';

const BarChartDataCell = ({ data, dataKey, label, max, onClick = () => {}, relative }) => {
  const date = data.date;
  const value = data[dataKey];

  if (value === null) {
    return <EmptyDataCell />;
  }

  return (
    <HorizontalBar
      color={colorMapByRank[data.ranking]}
      onClick={() => { onClick(data); }}
      tooltipContent={() => (
        <TooltipMetric
          color={colorMapByRank[data.ranking]}
          label={label}
          value={relative ? formatPrecisePercent(value) : value.toLocaleString()}
        />
      )}
      value={{ date, value }}
      xRange={[0, max]}
    />
  );
};

export default BarChartDataCell;
