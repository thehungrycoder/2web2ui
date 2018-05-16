import { createSelector } from 'reselect';
import moment from 'moment';
import _ from 'lodash';

import {
  filterNotificationsByTimeWindow,
  sortNotificationsByActiveDate,
  applyUnreadStatus
} from './helpers/transformNotifications';

const selectNotifications = (state) => state.notifications.list;
const selectLastSeenDate = (state) => _.get(state, 'currentUser.options.ui.notificationsLastSeenDate', state.account.created);

export const selectActiveNotifications = createSelector(
  [selectNotifications],
  (notifications) => {
    // only calculate "now" once
    const now = moment();
    // spread notifications to "clone" and avoid mutating redux state bc Array.sort sucks
    return [
      ...notifications.filter(filterNotificationsByTimeWindow(now))
    ].sort(sortNotificationsByActiveDate);
  }
);

export const selectTransformedNotifications = createSelector(
  [selectActiveNotifications, selectLastSeenDate],
  (notifications, lastSeen) => {
    const cutoff = moment(lastSeen);
    return notifications.map(applyUnreadStatus(cutoff));
  }
);

export const selectUnread = createSelector(
  [selectTransformedNotifications],
  (notifications) => notifications.filter(({ meta }) => meta.unread)
);

export const selectUnreadCount = createSelector(
  [selectUnread],
  (unread) => unread.length
);
