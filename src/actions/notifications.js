import markdownNotifications from 'src/components/notifications/staticMarkdownNotifications';
import { updateUserUIOptions } from 'src/actions/currentUser';

export function loadNotifications() {
  return {
    type: 'LOAD_NOTIFICATIONS_SUCCESS',
    payload: markdownNotifications
  };
}

export function addNotification(notification) {
  return {
    type: 'ADD_NOTIFICATION',
    payload: notification
  };
}

export function markAllAsRead(date = new Date()) {
  return (dispatch) => {
    dispatch({
      type: 'MARK_ALL_NOTIFICATIONS_AS_READ',
      payload: date
    });
    dispatch(updateUserUIOptions({
      notificationsLastSeenDate: date
    }));
  };
}
