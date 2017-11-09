import _ from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';

const getMessageEvents = (state) => state.messageEvents.events;

export const selectMessageEvents = createSelector(
  [ getMessageEvents ],
  (events) => _.map(events, (event) => ({
    ...event,
    formattedDate: moment(event.timestamp).format('YYYY/MM/DD HH:mm')
  }))
);
