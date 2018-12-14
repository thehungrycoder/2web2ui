/* eslint-disable */
import qs from 'query-string';
import _ from 'lodash';
import { getRelativeDates } from 'src/helpers/date';
import { EVENTS_SEARCH_FILTERS} from 'src/constants';
import { stringToArray } from 'src/helpers/string';



/*
 * Translate the array of event definitions from /message-events/events/documentation
 * into an map of event type to event field descriptions.
 * [ {[fieldName]: { sampleValue, description }}, ... ] -> { type: { [fieldName]: description }, ... displayName, description }
 *
 * Note: we treat display_name and event_description fields specially. They are not true event fields.
 * They're metadata and their sampleValue fields contain their 'value'.
 */
export function formatDocumentation(data) {
  const events = {};

  _.each(data, (event) => {
    const {
      type,
      display_name: { sampleValue: displayName },
      event_description: { sampleValue: description },
      ...rest
    } = event;
    const fieldDescriptions = _.mapValues(rest, ({ description }) => description);
    events[type.sampleValue] = {
      displayName,
      description,
      ...fieldDescriptions
    };
  });

  return events;
}
export function parseSearch(search) {
  const { from, to, range, searchQueries, ...rest } = qs.parse(search);
  let dateOptions = {};

  if (from) {
    dateOptions.from = new Date(from);
  }

  if (to) {
    dateOptions.to = new Date(to);
  }

  if (range) {
    dateOptions = { ...dateOptions, ...getRelativeDates(range) };
  }

  const options = _.mapValues(rest, (filter, key) => {
    return typeof filter === 'string' ? [filter] : filter
  });

  return { dateOptions, ...options };
}


export function getDetailsPath(messageId, eventId){
  return `/reports/message-events/details/${messageId ? `${messageId}/${eventId}` : `_noid_/${eventId}`}`;
}

/**
 * Creates the filters from the search query.
 *
 * @param {Object[]} searchQueries An array of query objects.
 * @returns {Object} An object containing the search parameters as keys and the search terms as values.
 */
export function getFiltersFromSearchQueries(searchQueries = []) {

  const filtersList = getEmptyFilters();

  searchQueries.forEach((filter) => {
    filtersList[filter.key] = stringToArray(filter.value);
  });
  return filtersList;
}


/**
 * Creates the search queries from the filter arrays.
 * @param {Object} filters An object containing the search parameters as keys and the search terms as values.
 * @returns {Object[]}  An array of query objects.
 */
export function getSearchQueriesFromFilters(filters) {

  //Filters out all search terms that are not part of the search query in AdvancedFilters
  const { dateOptions, recipients, events, ...rest } = filters;

  const nonEmptyFilters = removeEmptyFilters(rest);
  const newSearchQueries = _.map(nonEmptyFilters, (value, key) => {
    return ({ key, value: value.join(',')});
    });
  return newSearchQueries;
}

/**
 * Creates an object with all existing filters set to an empty array
 */
export function getEmptyFilters() {
  const emptyFilters = _.reduce(EVENTS_SEARCH_FILTERS, (result, {value}) => {
    result[value] = [];
    return result;
  }, {});
  return emptyFilters;
}

export function removeEmptyFilters(allFilters) {
  return _.pickBy(allFilters, (value) => value.length>0);
}

