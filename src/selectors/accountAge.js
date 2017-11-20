import { createSelector } from 'reselect';
import moment from 'moment';

const getAccountCreated = (state) => state.account.created;
const selectAccountAgeInWeeks = createSelector(
  [getAccountCreated],
  (created) => moment.duration(moment.utc().diff(created)).asWeeks()
);

export default selectAccountAgeInWeeks;
