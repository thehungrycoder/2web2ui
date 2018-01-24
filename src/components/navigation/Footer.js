import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

import styles from './Navigation.module.scss';

export class Footer extends Component {
  render() {
    const { logout } = this.props;

    return (
      <ul className={styles.footer}>
        <li><a className={styles.link} href='https://www.sparkpost.com/docs/' target='_blank' rel='noopener noreferrer'>Help &amp; API</a></li>
        <li><a className={styles.link} onClick={logout}>Log Out</a></li>
      </ul>
    );
  }
}

export default connect(null, { logout })(Footer);
