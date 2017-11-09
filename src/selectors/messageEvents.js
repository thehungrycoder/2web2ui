import _ from 'lodash';
import moment from 'moment';

export const formatMessageEvents = (events) => _.map(events, (event) => ({
  ...event,
  formattedDate: moment(event.timestamp).format('YYYY/MM/DD HH:mm')
}));
