import React from 'react';
import _ from 'lodash';
import { formatPercent } from 'src/helpers/units';
import HorizontalBar from '../charts/horizontalbar/HorizontalBar';
import TooltipMetric from '../charts/tooltip/TooltipMetric';
import EmptyDataCell from './EmptyDataCell';

const BarChartDataCell = ({ data, dataKey, label, max, relative = false }) => {
  const date = data.date;
  const value = data[dataKey];

  if (_.isNil(value)) {
    return <EmptyDataCell />;
  }

  return (
    <HorizontalBar
      color="#b252d1"
      tooltipContent={() => (
        <TooltipMetric
          color="#b252d1"
          label={label}
          value={relative ? formatPercent(value) : value.toLocaleString()}
        />
      )}
      value={{ date, value }}
      xRange={[0, relative ? 100 : max]}
    />
  );
};

export default BarChartDataCell;
