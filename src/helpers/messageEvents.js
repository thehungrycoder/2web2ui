/* eslint-disable */
import qs from 'query-string';
import _ from 'lodash';

/**
 * Reshapes message event documentation for tooltips
 */
export function formatDocumentation(data) {
  const events = {};

  _.each(data, (event) => {
    const { type, ...rest } = event;
    events[event.type.sampleValue] = _.mapValues(rest, ({ description }) => description);
  });

  return events;
}

export function parseSearch(search) {
  const { from, to, range, ...rest } = qs.parse(search);
  let dateOptions = {};

  if (from) {
    dateOptions.from = new Date(from);
  }

  if (to) {
    dateOptions.to = new Date(to);
  }

  if (range) {
    dateOptions.relativeRange = range;
  }

  const options = _.mapValues(rest, (filter, key) => {
    return typeof filter === 'string' ? [filter] : filter
  });

  return { dateOptions, ...options };
}
