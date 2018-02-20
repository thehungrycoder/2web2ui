import moment from 'moment';
import _ from 'lodash';
import qs from 'query-string';
import { getRelativeDates } from 'src/helpers/date';

const DEFAULT_LINK_PARAMS = [
  'from',
  'to',
  'range',
  'filters'
];

export function stringifyFilter(filter) {
  const subaccount = filter.type === 'Subaccount' ? `:${filter.id}` : '';
  return `${filter.type}:${filter.value}${subaccount}`;
}

export function dedupeFilters(filters) {
  return _.uniqBy(filters, stringifyFilter);
}

/**
 * Creates search options object from all possible query string params.
 * By default, only returns the DEFAULT_LINK_PARAMS, but report-specific
 * params may be included with extraLinkParams (ie. summary chart selected metrics)
 *
 * @param  {Object} reportOptions - reportOptions state
 * @param {Array} extraLinkParams - optional array of keys to include, in addition to default keys
 * @return {Object} - formatted search options object
 */
export function getReportSearchOptions(reportOptions, extraLinkParams = []) {
  const { filters = [], metrics = []} = reportOptions;
  const options = {
    from: moment(reportOptions.from).utc().format(),
    to: moment(reportOptions.to).utc().format(),
    range: reportOptions.relativeRange,
    filters: filters.map(stringifyFilter),
    metrics: metrics.map((metric) => typeof metric === 'string' ? metric : metric.key)
  };
  return _.pick(options, [ ...DEFAULT_LINK_PARAMS, ...extraLinkParams ]);
}

/**
 * Parses search string
 * @param  {string} search - location.search
 * @return {Object}
 *   {
 *     options - options for refresh actions
 *     filters - array of objects ready to be called with reportOptions.addFilter action
 *   }
 */
export function parseSearch(search) {
  if (!search) {
    return { options: {}};
  }

  const { from, to, range, metrics, filters = []} = qs.parse(search);
  const filtersList = (typeof filters === 'string' ? [filters] : filters).map((filter) => {
    const parts = filter.split(':');
    const type = parts.shift();
    let value;
    let id;

    // Subaccount filters include 3 parts
    // 'Subaccount:1234 (ID 554):554' -> { type: 'Subaccount', value: '1234 (ID 554)', id: '554' }
    if (type === 'Subaccount') {
      value = parts[0];
      id = parts[1];
    } else {
      value = parts.join(':');
    }

    return { value, type, id };
  });


  let options = {};

  if (metrics) {
    options.metrics = (typeof metrics === 'string') ? [metrics] : metrics;
  }

  if (from) {
    options.from = new Date(from);
  }

  if (to) {
    options.to = new Date(to);
  }

  if (range) {
    options = { ...options, ...getRelativeDates(range), relativeRange: range };
  }

  // filters are used in pages to dispatch updates to Redux store
  return { options, filters: filtersList };
}
