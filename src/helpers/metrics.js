import moment from 'moment';
import _ from 'lodash';
import { list as METRICS_LIST } from 'config/metrics';
import config from 'config/index';

const { metricsPrecisionMap: precisionMap, apiDateFormat, chartColors } = config;
const indexedPrecisions = _.keyBy(precisionMap, 'value');
const FILTER_KEY_MAP = {
  'Domain': 'domains',
  'Campaign': 'campaigns',
  'Template': 'templates',
  'Sending IP': 'sending_ips',
  'IP Pool': 'ip_pools',
  'Subaccount': 'subaccounts',
  'Sending/Bounce Domain': 'sending_domains'
};
const DELIMITERS = ',;:+~`!@#$%^*()-={}[]"\'<>?./|\\'.split('');

function getQueryFromOptions({ from, to, metrics, activeList = []}) {
  from = moment(from).utc();
  to = moment(to).utc();

  const apiMetricsKeys = getKeysFromMetrics(metrics);
  const delimiter = getDelimiter(activeList);
  const filters = getFilterSets(activeList, delimiter);

  return {
    metrics: apiMetricsKeys.join(delimiter),
    precision: getPrecision(from, to),
    from: from.format(apiDateFormat),
    to: to.format(apiDateFormat),
    delimiter,
    ...filters
  };
}

function pushToKey(obj, key, value) {
  const updated = { [key]: [], ...obj };
  updated[key].push(value);
  return updated;
}

function getFilterSets(filters = [], delimiter) {
  const hash = filters.reduce((result, { type, value }) => pushToKey(result, FILTER_KEY_MAP[type], value), {});
  return _.mapValues(hash, (v) => v.join(delimiter));
}

/**
 * Get an array of unique chars based on all filters and
 * find all delimiters that don't appear in that list, then
 * return the first one to use as the delimiter
 *
 * @param {array} filters
 */
function getDelimiter(filters = []) {
  const uniques = _.uniq(filters.map((f) => f.value).join(''));
  return _.difference(DELIMITERS, uniques).shift();
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

function getMetricsFromKeys(keys = []) {
  return keys.map((metric, i) => {
    const found = METRICS_LIST.find((M) => M.key === metric);
    return { ...found, name: found.key, stroke: chartColors[i] };
  });
}

function getKeysFromMetrics(metrics = []) {
  const flattened = _.flatMap(metrics, ({ key, computeKeys }) => computeKeys ? computeKeys : key);
  return _.uniq(flattened);
}

function computeKeysForItem(metrics = []) {
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
function transformData(data = [], metrics = []) {
  return data.map(computeKeysForItem(metrics));
}

export {
  getQueryFromOptions,
  getPrecision,
  getPrecisionType,
  getMetricsFromKeys,
  transformData
};
