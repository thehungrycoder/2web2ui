import React from 'react';
import MDXComponent from 'src/components/mdxComponent/MDXComponent';
import { updateUserUIOptions } from 'src/actions/currentUser';

// webpack require.context magic reads all files in from a directory,
// matching a regex, and gives you a list of paths you can then use
// req to load via standard webpack loading (uses mdx loader here)
const req = require.context('src/notifications', true, /.*\.mdx?$/);
const markdownNotifications = req.keys().map((k) => {
  const n = req(k);
  // n.default is the mdx-loaded component, converted from markdown
  // n.meta is the YAML front matter from the mdx loaded file
  // MDXComponent wraps the loaded component and alters some elements like links
  return { component: () => <MDXComponent component={n.default} />, meta: n.meta };
});

export function loadNotifications () {
  return {
    type: 'LOAD_NOTIFICATIONS_SUCCESS',
    payload: markdownNotifications
  };
}

export function addNotification (notification) {
  return {
    type: 'ADD_NOTIFICATION',
    payload: notification
  };
}

export function markAllAsRead (date = new Date()) {
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
