import { createSelector } from 'reselect';
import moment from 'moment';

const getAccountCreated = (state) => state.account.created;
export const selectAccountAgeInWeeks = createSelector(
  [getAccountCreated],
  (created) => moment.duration(moment.utc().diff(created)).asWeeks()
);

export const selectAccountAgeInDays = createSelector(
  [getAccountCreated],
  (created) => moment.duration(moment.utc().diff(created)).asDays()
);
