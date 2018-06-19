import moment from 'moment';
import _ from 'lodash';
import { getPrecisionType } from './metrics';
import { roundToPlaces } from 'src/helpers/units';

function getDayLines(data, precision = 'day') {
  if (getPrecisionType(precision) !== 'hours') {
    return [];
  }
  const lastIndex = data.length - 1;
  return data.filter(({ ts }, i) => {
    if (i === 0 || i === lastIndex) {
      return false;
    }
    if (moment(ts).hours() !== 0) {
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

function formatYAxisPercent(v) {
  return `${roundToPlaces(v, v < 1 ? 3 : 1)}%`;
}

export {
  getDayLines,
  getTimeTickFormatter,
  getTooltipLabelFormatter,
  getLineChartFormatters,
  formatYAxisPercent
};
