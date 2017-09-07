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
  const tickFormat = (precisionType === 'hours') ? 'h:mma' : 'MMM Do';
  return (tick) => moment(tick).format(tickFormat);
});

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
  formatters.tooltipLabelFormatter = getTooltipLabelFormatter(precisionType);

  return formatters;
}

export {
  getDayLines,
  getLineChartFormatters
};
