import moment from 'moment';
import _ from 'lodash';

const apiDateFormat = 'YYYY-MM-DDTHH:mm';
const precisionMap = [
  { time: 60, value: '1min', format: 'ha' },
  { time: 60 * 2, value: '5min', format: 'ha' },
  { time: 60 * 4, value: '15min', format: 'ha' },
  { time: 60 * 24 * 2, value: 'hour', format: 'ha' },
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
  getDayLines,
  getEndOfDay
};

const getTickFormatter = _.memoize((precisionType) => {
  const tickFormat = (precisionType === 'hours') ? 'ha' : 'MMM Do';
  return (tick) => moment(tick).format(tickFormat);
});

const getTooltipLabelFormatter = _.memoize((precisionType) => {
  let labelFormat = 'MMMM Do';
  if (precisionType === 'hours') {
    labelFormat = 'MMM Do [at] LT';
  }
  return (label) => moment(label).format(labelFormat);
});

function getLineChartFormatters({ precision }) {
  const formatters = {};
  const precisionType = getPrecisionType(precision);

  formatters.xTickFormatter = getTickFormatter(precisionType);
  formatters.yTickFormatter = (value) => {
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
  formatters.tooltipLabelFormatter = getTooltipLabelFormatter(precisionType);
  formatters.tooltipValueFormatter = (value) => Number(value).toLocaleString();

  return formatters;
}

function getQueryFromOptions({ from, to, metrics }) {
  from = moment(from).utc();
  to = moment(to).utc();

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
function getPrecision(from, to = moment()) {
  const diff = to.diff(from, 'minutes');
  return precisionMap.find(({ time }) => diff <= time).value;
}

function getPrecisionType(precision) {
  return (indexedPrecisions[precision].time <= (60 * 24 * 2)) ? 'hours' : 'days';
}

function getDayLines(data, { precision = 'day' }) {
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

function getEndOfDay(date) {
  const end = new Date(date);
  end.setHours(11);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(0);

  return end;
}
