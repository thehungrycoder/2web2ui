import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

import Item from './Item';
import Footer from './Footer';
import navItems from './navItems';
import styles from './Navigation.module.scss';

class Navigation extends Component {
  renderItems () {
    return navItems.map((item, key) => <Item {...item} key={key} />);
  }

  render () {
    return (
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          { this.renderItems() }
        </ul>
        <Footer />
      </nav>
    );
  }
}

export default connect(({ auth }) => ({ auth }), { logout })(Navigation);
