import moment from 'moment';
import _ from 'lodash';
import { list as METRICS_LIST } from 'config/metrics';
import config from 'config/index';

const { metricsPrecisionMap: precisionMap, apiDateFormat, chartColors } = config;
const indexedPrecisions = _.keyBy(precisionMap, 'value');

function getQueryFromOptions({ from, to, metrics }) {
  from = moment(from).utc();
  to = moment(to).utc();

  metrics = getMetricsForQuery(metrics);

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

function getMetricsFromList(list) {
  return list.map((metric, i) => {
    const found = METRICS_LIST.find((M) => M.key === metric);
    return { ...found, name: found.key, stroke: chartColors[i] };
  });
}

function getMetricsForQuery(metrics) {
  const flattened = _.flatMap(metrics, ({ key, computeKeys }) => computeKeys ? computeKeys : key);
  return _.uniq(flattened);
}

function computeKeysForItem(metrics) {
  return (item) => metrics.reduce((acc, metric) => {
    if (metric.compute) {
      acc[metric.key] = metric.compute(acc, metric.computeKeys);
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
function transformData(data, metrics) {
  // const charts = metrics.reduce((acc, { measure = 'count' }) => ({ ...acc, [measure]: [] }), {});
  return data.map(computeKeysForItem(metrics));
}

export {
  getQueryFromOptions,
  getPrecision,
  getPrecisionType,
  getMetricsFromList,
  transformData
};
