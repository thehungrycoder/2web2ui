import moment from 'moment';
import _ from 'lodash';
import { list as METRICS_LIST } from 'src/config/metrics';
import config from 'src/config';
import { getRelativeDates, getLocalTimezone } from 'src/helpers/date';
import { safeDivide, safeRate } from './math';

const { metricsPrecisionMap: precisionMap, apiDateFormat, chartColors = []} = config;
const indexedPrecisions = _.keyBy(precisionMap, 'value');
const FILTER_KEY_MAP = {
  'Recipient Domain': 'domains',
  'Campaign': 'campaigns',
  'Template': 'templates',
  'Sending IP': 'sending_ips',
  'IP Pool': 'ip_pools',
  'Subaccount': 'subaccounts',
  'Sending Domain': 'sending_domains'
};

const DELIMITERS = ',;:+~`!@#$%^*()-={}[]"\'<>?./|\\'.split('');

export function getQueryFromOptions({ from, to, metrics, filters = [], match = '', limit }) {
  from = moment(from);
  to = moment(to);

  const apiMetricsKeys = getKeysFromMetrics(metrics);
  const delimiter = getDelimiter(filters);
  const options = {
    metrics: apiMetricsKeys.join(delimiter),
    precision: getPrecision(from, to),
    from: from.format(apiDateFormat),
    to: to.format(apiDateFormat),
    delimiter,
    ...getFilterSets(filters, delimiter),
    timezone: getLocalTimezone()
  };
  if (match.length > 0) {
    options.match = match;
  }
  if (limit) {
    options.limit = limit;
  }
  return options;
}

export function pushToKey(obj, key, value) {
  const updated = { [key]: [], ...obj };
  updated[key].push(value);
  return updated;
}

export function getFilterSets(filters = [], delimiter) {
  const hash = filters.reduce((result, { type, value, id }) => pushToKey(result, FILTER_KEY_MAP[type], type === 'Subaccount' ? id : value), {});
  return _.mapValues(hash, (v) => v.join(delimiter));
}

/**
 * Get an array of unique chars based on all filters and
 * find all delimiters that don't appear in that list, then
 * return the first one to use as the delimiter
 *
 * @param {array} filters
 */
export function getDelimiter(filters = []) {
  const uniques = _.uniq(filters.map((f) => f.value).join(''));
  return _.difference(DELIMITERS, uniques).shift();
}

/**
 * Calculates the difference between 2 moment dates
 * and returns the closest precision value
 *
 */
export function getPrecision(from, to = moment()) {
  const diff = to.diff(from, 'minutes');
  return precisionMap.find(({ time }) => diff <= time).value;
}

export function getMomentPrecision(precision) {
  return (indexedPrecisions[precision].time <= (60 * 24)) ? 'minutes' : 'hours';
}

export function getPrecisionType(precision) {
  return (indexedPrecisions[precision].time <= (60 * 24 * 2)) ? 'hours' : 'days';
}

/**
 * Round 'from' and 'to' to nearest precision
 *
 * @param fromInput
 * @param toInput
 * @return {{to: *|moment.Moment, from: *|moment.Moment}}
 */
export function roundBoundaries(fromInput, toInput) {
  const from = moment(fromInput);
  const to = moment(toInput);

  const precision = getPrecision(from, to);
  const momentPrecision = getMomentPrecision(precision);
  // extract rounding interval from precision query param value
  const roundInt = _.parseInt(_.words(precision)[0]) || 1;

  floorMoment(from, roundInt, momentPrecision);
  // if we're only at a minute precision, don't round up to the next minute
  if (precision !== '1min') { ceilMoment(to, roundInt, momentPrecision); }

  return { to, from };
}

/**
 * Rounds down moment to precision and interval
 * @param time
 * @param roundInt
 * @param precision
 */
function floorMoment(time, roundInt = 1, precision = 'minutes') {
  const value = time.get(precision);
  const roundedValue = Math.floor(value / roundInt) * roundInt;
  time.set(precision, roundedValue).startOf(precision);
}

/**
 * Rounds up moment to precision and interval
 * @param time
 * @param roundInt
 * @param precision
 */
function ceilMoment(time, roundInt = 1, precision = 'minutes') {
  const value = time.get(precision);
  const roundedValue = Math.ceil(value / roundInt) * roundInt;
  time.set(precision, roundedValue).endOf(precision);
}

/**
 * Returns verified from and to dates; throws an error if date range is invalid - catch this to reset to last state
 *
 * @param from
 * @param to
 * @param now
 * @param roundToPrecision
 * @return {*}
 */
export function getValidDateRange({ from, to, now = moment(), roundToPrecision }) {
  // If we're not rounding, just check that 'to' is before 'now'
  const nonRoundCondition = () => roundToPrecision ? true : to.isBefore(now);
  const validDates = _.every(_.map([from, to, now], (date) => moment.isMoment(date) && date.isValid()));

  if (validDates && from.isBefore(to) && nonRoundCondition()) {
    if (!roundToPrecision) { return { from, to }; }
    // Use the user's rounded 'to' input if it's less than or equal to 'now' rounded up to the nearest precision,
    // otherwise use the valid range and precision of floor(from) to ceil(now).
    // This is necessary because the precision could change between the user's invalid range, and a valid range.
    const { from: roundedFromNow, to: roundedNow } = roundBoundaries(from, now);
    const { from: roundedFrom, to: roundedTo } = roundBoundaries(from, to);

    if (roundedTo.isSameOrBefore(roundedNow)) {
      from = roundedFrom;
      to = roundedTo;
    } else {
      from = roundedFromNow;
      to = roundedNow;
    }
    return { from, to };
  }

  throw new Error('Invalid date range selected');
}

export function _getMetricsFromKeys(keys = []) {
  return keys.map((metric, i) => {
    const found = METRICS_LIST.find((M) => M.key === metric || M.key === metric.key);

    if (!found) {
      throw new Error(`Cannot find metric: ${JSON.stringify(metric)}`);
    }

    return { ...found, name: found.key, stroke: chartColors[i] };
  });
}

export const getMetricsFromKeys = _.memoize(_getMetricsFromKeys, (keys = []) => keys.join(''));

export function getKeysFromMetrics(metrics = []) {
  const flattened = _.flatMap(metrics, ({ key, computeKeys }) => computeKeys ? computeKeys : key);
  return _.uniq(flattened);
}

export function computeKeysForItem(metrics = []) {
  return (item) => metrics.reduce((acc, metric) => {
    if (metric.compute) {
      acc[metric.key] = metric.compute(acc, metric.computeKeys) || 0;
    }
    return acc;
  }, item);
}

/**
 * Transforms API result into chart-ready data in 2 steps:
 * 1. compute any necessary computed metrics
 * 2. arrange metrics into groups sorted by unit/measure
 *
 * @param {Array} metrics - list of currently selected metrics objects from config
 * @param {Array} data - results from the metrics API
 */
export function transformData(data = [], metrics = []) {
  return data.map(computeKeysForItem(metrics));
}

// Extract from, to, filters (campaign, template, ...) and any other included update fields
// into a set of common options for metrics queries.
export function buildCommonOptions(reportOptions, updates = {}) {
  return {
    ...reportOptions,
    ...updates,
    ...getRelativeDates(reportOptions.relativeRange),
    ...getRelativeDates(updates.relativeRange)
  };
}

export function average(item, keys = []) {
  return safeDivide(item[keys[0]], item[keys[1]]);
}

export function rate(item, keys = []) {
  return safeRate(item[keys[0]], item[keys[1]]);
}
