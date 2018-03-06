import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { UnstyledLink } from '@sparkpost/matchbox';
import { LINKS } from 'src/constants';

import styles from './Navigation.module.scss';

export class Footer extends Component {
  render() {
    const { logout, currentUser } = this.props;
    const isHerokuUser = currentUser.access_level === 'heroku';

    return (
      isHerokuUser
        ? null
        : <ul className={styles.footer}>
          <li><UnstyledLink className={styles.link} to={LINKS.DOCS} external>Help &amp; API</UnstyledLink></li>
          <li><UnstyledLink className={styles.link} onClick={logout}>Log Out</UnstyledLink></li>
        </ul>
    );
  }
}

const mapStateToProps = ({ currentUser }) => ({
  currentUser
});

export default connect(mapStateToProps, { logout })(Footer);
