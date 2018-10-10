/* eslint-disable */
import qs from 'query-string';
import _ from 'lodash';
import { getRelativeDates } from 'src/helpers/date';

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
  const { from, to, range, ...rest } = qs.parse(search);
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
