import moment from 'moment';
import _ from 'lodash';
import { getPrecisionType } from './metrics';

function getDayLines(data, precision = 'day') {
  if (getPrecisionType(precision) !== 'hours') {
    return [];
  }
  const lastIndex = data.length - 1;
  return data.filter(({ ts }, i) => {
    if (i === 0 || i === lastIndex) {
      return false;
    }
    if (new Date(ts).getHours() !== 0) {
      return false;
    }
    return true;
  });
}

const getTimeTickFormatter = _.memoize((precisionType) => {
  const tickFormat = (precisionType === 'hours') ? 'ha' : 'MMM Do';
  return (tick) => moment(tick).format(tickFormat);
});

const formatLargeNumber = (value) => {
  if (value < 1000) {
    return value.toLocaleString();
  }
  if (value < 1000000) {
    return `${(value / 1000).toFixed(0).toLocaleString()}K`;
  }
  if (value < 100000000) {
    return `${(value / 1000000).toFixed(0).toLocaleString()}M`;
  }
  return value.toPrecision(2);
};

const getUnitTickFormatter = (unit) => (value) => {
  if (!unit) {
    return formatLargeNumber(value);
  }
  return `${value}${unit}`;
};

const getTooltipLabelFormatter = _.memoize((precisionType) => {
  let labelFormat = 'MMMM Do';
  if (precisionType === 'hours') {
    labelFormat = 'MMM Do [at] LT';
  }
  return (label) => moment(label).format(labelFormat);
});

function getLineChartFormatters(precision) {
  const formatters = {};
  const precisionType = getPrecisionType(precision);

  formatters.xTickFormatter = getTimeTickFormatter(precisionType);
  // formatters.yTickFormatter = getUnitTickFormatter();
  formatters.tooltipLabelFormatter = getTooltipLabelFormatter(precisionType);
  formatters.tooltipValueFormatter = (value) => Number(value).toLocaleString();

  return formatters;
}

export {
  getDayLines,
  getTimeTickFormatter,
  getUnitTickFormatter,
  getTooltipLabelFormatter,
  getLineChartFormatters
};
