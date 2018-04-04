import _ from 'lodash';
import { formatDateTime } from 'src/helpers/date';
import moment from 'moment';
import { createSelector } from 'reselect';

const getMessageEvents = (state) => state.messageEvents.events;
const getMessageHistory = (state) => state.messageEvents.history;
const getMessageIdParam = (state, props) => props.match.params.messageId;
const getEventIdLocationState = (state, props) => _.get(props, 'location.state.selectedEventId');

export const selectMessageEvents = createSelector(
  [ getMessageEvents ],
  (events) => _.map(events, (event) => ({
    ...event,
    formattedDate: formatDateTime(event.timestamp)
  }))
);

export const selectMessageHistory = createSelector(
  [getMessageHistory, getMessageIdParam],
  (history, id) => _.map(history[id], (event) => ({
    ...event,
    formattedDate: formatDateTime(event.timestamp)
  }))
);

export const selectInitialEventId = createSelector(
  [selectMessageHistory, getEventIdLocationState],
  (messageHistory, selectedEventId) => selectedEventId || _.get(messageHistory[0], 'event_id')
);

const selectMessageEventsDateOptions = (state) => ({
  from: moment(_.get(state, 'messageEvents.search.dateOptions.from')).utc().format(),
  to: moment(_.get(state, 'messageEvents.search.dateOptions.to')).utc().format(),
  range: _.get(state, 'messageEvents.search.dateOptions.relativeRange')
});

const selectSearch = (state) => _.omit(state.messageEvents.search, ['dateOptions']);

/**
 * Converts reportOptions for url sharing for message events
 */
export const selectMessageEventsSearchOptions = createSelector(
  [selectMessageEventsDateOptions, selectSearch],
  (dates, search) => ({ ...dates, ...search })
);

export const isMessageHistoryEmpty = createSelector(
  [getMessageHistory, getMessageIdParam],
  (history, id) => history.hasOwnProperty(id) && history[id].length === 0
);
