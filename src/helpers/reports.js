import moment from 'moment';
import qs from 'query-string';
import { getRelativeDates } from 'src/helpers/date';

/**
 * Creates search options object from shared report options. Page specific options not included (ie. summary chart selected metrics)
 * @param  {Object} filters - reportFilters state
 * @return {Object} - formatted search options object
 */
export function getFilterSearchOptions(filters) {
  return {
    from: moment(filters.from).utc().format(),
    to: moment(filters.to).utc().format(),
    range: filters.relativeRange,
    filters: filters.activeList.map((filter) => {
      const subaccount = filter.type === 'Subaccount' ? `:${filter.id}` : '';
      return `${filter.type}:${filter.value}${subaccount}`;
    })
  };
}

/**
 * Parses search string
 * @param  {string} search - location.search
 * @return {Object}
 *   {
 *     options - options for refresh actions
 *     filters - array of objects ready to be called with reportFilters.addFilter action
 *   }
 */
export function parseSearch(search) {
  if (!search) {
    return { options: {}};
  }

  const { from, to, range = 'custom', metrics = [], filters = []} = qs.parse(search);
  const metricsList = typeof metrics === 'string' ? [metrics] : metrics;
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

  const options = {
    metrics: metricsList,
    from: new Date(from),
    to: new Date(to),
    ...getRelativeDates(range), // invalid or custom ranges produce {} here
    relativeRange: range
  };

  // filters are used in pages to dispatch updates to Redux store
  return { options, filters: filtersList };
}
