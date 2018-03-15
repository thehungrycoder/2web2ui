import _ from 'lodash';
import { formatDateTime } from 'src/helpers/date';
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
