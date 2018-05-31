import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, UnstyledLink } from '@sparkpost/matchbox';
import { Notifications, NotificationsUnread } from '@sparkpost/matchbox-icons';
import Notification from './Notification';
import * as notificationActions from 'src/actions/notifications';
import { selectTransformedNotifications, selectUnreadCount } from 'src/selectors/notifications';
import styles from './NotificationCenter.module.scss';

export class NotificationCenter extends Component {

  componentDidMount() {
    this.props.loadNotifications();
  }

  renderNotificationsList = () => {
    const { notifications } = this.props;

    if (!notifications || notifications.length === 0) {
      return <div className={styles.Empty}><small>No notifications at this time.</small></div>;
    }

    return notifications.map(({ id, meta, ...rest }) => <Notification {...rest} {...meta} key={id} />);
  }

  render() {
    const icon = (this.props.unreadCount > 0)
      ? <NotificationsUnread className={styles.UnreadIcon} size={22} />
      : <Notifications size={22} />;

    return (
      <React.Fragment>
        <span onClick={() => this.props.addNotification({
          component: () => <p>This is a new random notification at aas lorem ips um dolsd  {new Date().toString()}</p>,
          meta: {
            title: `A new notification lorem upsu dol fdi sdfs nfignd eddsa ${new Date().toString()}`,
            activeDate: new Date(),
            type: 'info'
          }
        })}>add</span>
        <Popover
          left
          onClose={this.props.markAllAsRead}
          trigger={<UnstyledLink className={styles.IconWrapper}>{icon}</UnstyledLink>}>
          <div className={styles.ListWrapper}>
            {this.renderNotificationsList()}
          </div>
        </Popover>
      </React.Fragment>
    );
  }
}

const mstp = (state) => ({
  notifications: selectTransformedNotifications(state),
  unreadCount: selectUnreadCount(state)
});
export default connect(mstp, notificationActions)(NotificationCenter);
