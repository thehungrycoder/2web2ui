import React from 'react';
import classnames from 'classnames';
import { formatDate } from 'src/helpers/date';
import styles from './Notification.module.scss';

const Notification = ({
  component: Content,
  title,
  activeDate,
  unread
}) => (
  <div className={styles.Notification}>
    <div className={styles.Content}>
      <p className={styles.Date}>{formatDate(activeDate)}</p>
      <h6 className={classnames(styles.Title, unread && styles.unread)}>
        {title}
      </h6>
      <Content/>
    </div>
  </div>
);

export default Notification;
