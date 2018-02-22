import moment from 'moment';
import _ from 'lodash';
import { list as METRICS_LIST } from 'src/config/metrics';
import config from 'src/config';
import { getRelativeDates } from 'src/helpers/date';

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

export function getQueryFromOptions({ from, to, metrics, filters = []}) {
  from = moment(from).utc();
  to = moment(to).utc();

  const apiMetricsKeys = getKeysFromMetrics(metrics);
  const delimiter = getDelimiter(filters);

  return {
    metrics: apiMetricsKeys.join(delimiter),
    precision: getPrecision(from, to),
    from: from.format(apiDateFormat),
    to: to.format(apiDateFormat),
    delimiter,
    ...getFilterSets(filters, delimiter)
  };
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

export function getPrecisionType(precision) {
  return (indexedPrecisions[precision].time <= (60 * 24 * 2)) ? 'hours' : 'days';
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

