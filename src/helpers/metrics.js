import moment from 'moment';
import _ from 'lodash';

const apiDateFormat = 'YYYY-MM-DDTHH:mm';
const precisionMap = [
  { time: 60, value: '1min', format: 'h:mma' },
  { time: 60 * 2, value: '5min', format: 'h:mma' },
  { time: 60 * 4, value: '15min', format: 'h:mma' },
  { time: 60 * 24 * 2, value: 'hour', format: 'h:mma' },
  { time: 60 * 24 * 7, value: '12hr', format: 'MMM Do' },
  { time: 60 * 24 * 33, value: 'day', format: 'MMM Do' },
  { time: 60 * 24 * 190, value: 'week', format: 'MMM Do' },
  { time: Infinity, value: 'month', format: 'MMM YY' }
];

const indexedPrecisions = _.keyBy(precisionMap, 'value');

export {
  getQueryFromOptions,
  getLineChartFormatters,
  getPrecision,
  getDayLines
};

const getTickFormatter = _.memoize((precisionType) => {
  let tickFormat = (precisionType === 'hours') ? 'h:mma' : 'MMM Do';
  return (tick) => moment(tick).format(tickFormat);
});

const getTooltipLabelFormatter = _.memoize((precisionType) => {
  let labelFormat = 'MMMM Do';
  if (precisionType === 'hours') {
    labelFormat = 'MMM Do [at] h:mma';
  }
  return (label) => moment(label).format(labelFormat);
});

function getLineChartFormatters ({ precision }) {
  const formatters = {};
  const precisionType = getPrecisionType(precision);

  formatters.tickFormatter = getTickFormatter(precisionType);
  formatters.tooltipLabelFormatter = getTooltipLabelFormatter(precisionType);
  formatters.tooltipValueFormatter = (value) => Number(value).toLocaleString();

  return formatters;
}

function getQueryFromOptions ({ from, to, metrics }) {
  from = from ? moment(from).utc() : moment.utc().subtract(1, 'day');
  to = to ? moment(to).utc() : moment.utc();

  return {
    metrics: metrics.join(','),
    precision: getPrecision(from, to),
    from: from.format(apiDateFormat),
    to: to.format(apiDateFormat)
  };
}

/**
 * Calculates the difference between 2 moment dates
 * and returns the closest precision value
 *
 */
function getPrecision (from, to = moment()) {
  const diff = to.diff(from, 'minutes');
  return precisionMap.find(({ time }) => diff <= time).value;
}

function getPrecisionType (precision) {
  return (indexedPrecisions[precision].time <= (60 * 24 * 2)) ? 'hours' : 'days';
}

function getDayLines (data, { precision = 'day' }) {
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
