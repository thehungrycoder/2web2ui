import { stringToArray } from 'src/helpers/string';
import _ from 'lodash';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import { getEmptyFilters } from 'src/helpers/messageEvents';

/**
 * Creates the filters from the search query.
 *
 * @param {Object[]} searchQueries An array of query objects.
 * @returns {Object} An object containing the search parameters as keys and the search terms as values.
 */
export function getFiltersFromSearchQueries(searchQueries = []) {

  // Build a single object containing a key for each filter, initialised to an empty array
  const emptyFilters = getEmptyFilters(EVENTS_SEARCH_FILTERS);

  // Collect queries into an array of objects of form {key: value}
  const queries = searchQueries.map(({ key, value }) => ({ [key]: stringToArray(value) }));

  return Object.assign(emptyFilters, ...queries);
}

/**
 * Creates the search queries from the filter arrays.
 * @param {Object} filters - An object containing the search parameters as keys and the search terms as values.
 * @returns {Object[]} - An array of query objects.
 */
export function getSearchQueriesFromFilters(filters) {

  //Filters out all search terms that are not part of the search query in AdvancedFilters
  const { dateOptions, recipients, events, ...rest } = filters;

  const nonEmptyFilters = removeEmptyFilters(rest);
  const newSearchQueries = _.map(nonEmptyFilters, (value, key) => ({ key, value: value.join(',') }));
  return newSearchQueries;
}

/**
 * Creates an array with all possible search filters as an object with a value=key and a label
 * @param {Object} filters - An object with the form {key: {label:''}, ...}.
 * @returns {Object[]} - An array of event objects in the form of {key: 'foo',label: 'bar'}.
 */
export function getFiltersAsArray(filters) {
  const filtersAsArray = _.map(filters, ({ label }, key) =>
    ({ value: key, label }));
  return filtersAsArray;
}

/**
 * Transforms an array of event types into an object.
 * @param [events] - A String array with the names of enabled event types with the form ['foo'].
 * @returns {Object} - An event object with the key = the event type and the value = boolean, ex: {foo:true, bar:false}.
 */
export function getBooleanEventsObject(events) {
  return (events.reduce((accumulator, event) => {
    accumulator[event] = true;
    return accumulator;
  }, {}));
}

export function removeEmptyFilters(allFilters) {
  return _.pickBy(allFilters, (value) => value.length > 0);
}
