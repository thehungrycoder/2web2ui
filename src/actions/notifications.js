import markdownNotifications from 'src/components/notifications/staticMarkdownNotifications';
import { updateUserUIOptions } from 'src/actions/currentUser';
import _ from 'lodash';

function getId() {
  return _.uniqueId('notification-');
}

export function loadNotifications() {
  return {
    type: 'LOAD_NOTIFICATIONS_SUCCESS',
    payload: markdownNotifications.map((n) => ({ ...n, id: getId() }))
  };
}

export function addNotification(notification) {
  return {
    type: 'ADD_NOTIFICATION',
    payload: { ...notification, id: getId() }
  };
}

export function markAllAsRead() {
  const now = new Date();
  return (dispatch) => {
    dispatch({
      type: 'MARK_ALL_NOTIFICATIONS_AS_READ',
      payload: now
    });
    dispatch(updateUserUIOptions({
      notificationsLastSeenDate: now
    }));
  };
}
