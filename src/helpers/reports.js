import moment from 'moment';
import qs from 'query-string';
import _ from 'lodash';

// Creates search options object from shared filter data
function getFilterSearchOptions(filters) {
  return {
    from: moment(filters.from).utc().format(),
    to: moment(filters.to).utc().format(),
    filters: filters.activeList.map((filter) => {
      const subaccount = filter.type === 'Subaccount' ? `:${filter.id}` : '';
      return `${filter.type}:${filter.value}${subaccount}`;
    })
  };
}

// Converts object to search string
function getSearch(options) {
  return _.isEmpty(options) ? '' : `?${qs.stringify(options, { encode: false })}`;
}

// Converts object to search string with window location
function getShareLink(options) {
  return `${window.location.href.split('?')[0]}${getSearch(options)}`;
}

/**
 * Parses filters from search string
 * @param  {Array} filters - Array parsed from qs
 * @return {Array} - Array of filter objects ready to be used with addFilter action
 * 'Subaccount:1234 (ID 554):554' -> { type: 'Subaccount', value: '1234 (ID 554)', id: '554' }
 */
function getFilterListFromSearch(filters) {
  const filtersList = typeof filters === 'string' ? [filters] : filters;

  return filtersList.map((filter) => {
    const parts = filter.split(':');
    const type = parts.shift();
    let value;
    let id;

    if (type === 'Subaccount') {
      value = parts[0];
      id = parts[1];
    } else {
      value = parts.join(':');
    }

    return { value, type, id };
  });
}

export {
  getFilterSearchOptions,
  getFilterListFromSearch,
  getSearch,
  getShareLink
};
