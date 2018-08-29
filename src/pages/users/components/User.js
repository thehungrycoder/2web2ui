import React, { Fragment } from 'react';
import styles from './User.module.scss';

const User = ({ name, email }) => (
  <Fragment>
    <p className={styles.Name}>
      <strong>{name}</strong>
    </p>
    <p className={styles.Email}>
      <em>{email}</em>
    </p>
  </Fragment>
);

export default User;
