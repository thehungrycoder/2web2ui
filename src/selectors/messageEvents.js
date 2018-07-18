import _ from 'lodash';
import { formatDateTime } from 'src/helpers/date';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

const getMessageEvents = (state) => state.messageEvents.events;
const getMessageHistory = (state) => state.messageEvents.history;
export const getMessageIdParam = (state, props) => props.match.params.messageId;
const getEventIdParam = (state, props) => props.match.params.eventId;

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
  [selectMessageHistory, getEventIdParam],
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
  (history, id) => _.get(history, id, []).length === 0
);

export const getSelectedEventFromMessageHistory = createSelector(
  [selectMessageHistory, getEventIdParam],
  (messageHistory, eventId) => _.find(messageHistory, (event) => event.event_id === eventId)
);

export const getSelectedEventFromEventsList = createSelector(
  [getMessageEvents, getEventIdParam],
  (messageEvents, eventId) => _.find(messageEvents, (event) => event.event_id === eventId)
);

//whether the event is without a message_id (defaulted to _noid_)
const isOrphanEvent = createSelector(
  [getMessageIdParam], (messageId) => messageId === '_noid_'
);

const getSelectedEvent = createSelector(
  [isOrphanEvent, getSelectedEventFromEventsList, getSelectedEventFromMessageHistory], (isOrphanEvent, eventFromEventList, eventFromMessageHistory) => isOrphanEvent ? eventFromEventList : eventFromMessageHistory
);

export const eventPageMSTP = (state, props) => createStructuredSelector({
  isMessageHistoryEmpty: isMessageHistoryEmpty,
  isOrphanEvent: isOrphanEvent,
  loading: (state) => !!(state.messageEvents.historyLoading || state.messageEvents.documentationLoading),
  messageHistory: selectMessageHistory,
  messageId: getMessageIdParam,
  documentation: (state) => state.messageEvents.documentation,
  selectedEventId: selectInitialEventId,
  selectedEvent: getSelectedEvent
});

