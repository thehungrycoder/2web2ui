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

  const newSearchQueries = getSearchQueriesFromFilters(rest);
  return { dateOptions, searchQueries: newSearchQueries, ...options };
}


export function getDetailsPath(messageId, eventId){
  return `/reports/message-events/details/${messageId ? `${messageId}/${eventId}` : `_noid_/${eventId}`}`;
}

/**
 * Creates the filters arrays
 *
 * First create an object with all search filters as keys and set each value to [].
 * Then replace the values with values calculated from searchqueries
 */
export function getFiltersFromSearchQueries({searchQueries = []}) {

  const filtersList = getEmptyFilters();

  searchQueries.forEach((filter) => {
    filtersList[filter.key] = stringToArray(filter.value);
  });
  return filtersList;
}


/**
 * Creates the the search queries from the filter arrays.
 *
 */
export function getSearchQueriesFromFilters(search) {

  //Filters out all search terms that are not part of the search query in AdvancedFilters
  const { dateOptions, searchQueries, recipients, events, ...rest } = search;

  const newSearchQueries = [];
  _.forEach(rest, (value, key) => {
    if(value.length>0) {
      newSearchQueries.push({ key, value: typeof value === 'string' ? value : value.join(','), error: null })
    }
  });
  return newSearchQueries;
}

export function getEmptyFilters() {
  const emptyFilters = {};
  EVENTS_SEARCH_FILTERS.forEach(({value}) => {
    emptyFilters[value] = [];
  });
  return emptyFilters;
}


