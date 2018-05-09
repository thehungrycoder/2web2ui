import { createSelector } from 'reselect';
import moment from 'moment';
import _ from 'lodash';

const selectNotifications = (state) => state.notifications.list;
const selectLastSeenDate = (state) => _.get(state, 'currentUser.options.ui.notificationsLastSeenDate', state.account.created);

/**
 * Takes a string date and returns a moment comparison precision
 * value if the date is only YMD, otherwise undefined
 *
 * @param {String} date
 */
const getPrecision = (date) => {
  if (!date) {
    return;
  }
  if (date.length === 10) {
    return 'day';
  }
};

const filterNotificationsByTimeWindow = (now) => ({ meta }) => {
  const active = now.isSameOrAfter(meta.activeDate, getPrecision(meta.activeDate));
  const expired = (meta.expirationDate && now.isSameOrBefore(meta.expirationDate, getPrecision(meta.expirationDate)));

  return active && !expired;
};

const sortNotificationsByActiveDate = (a, b) => new Date(b.meta.activeDate).getTime() - new Date(a.meta.activeDate).getTime();

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
    return notifications.map((notification) => {
      const { meta } = notification;
      const unread = cutoff.isBefore(meta.activeDate, getPrecision(meta.activeDate));
      return { ...notification, meta: { ...meta, unread }};
    });
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
