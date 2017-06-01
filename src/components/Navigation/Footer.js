import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

import styles from './Navigation.module.scss';

export class Footer extends Component {
  render () {
    return (
      <ul className={styles.footer}>
        <li><a className={styles.link}>Help &amp; API</a></li>
        <li><a className={styles.link} onClick={() => this.props.logout()}>Log Out</a></li>
      </ul>
    );
  }
}

export default connect(null, { logout })(Footer);
