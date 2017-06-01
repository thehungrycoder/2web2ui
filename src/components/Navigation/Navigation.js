import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Item from './Item';
import Footer from './Footer';
import navItems from './navItems';
import styles from './Navigation.module.scss';

class Navigation extends Component {
  renderItems () {
    return navItems.map((item, key) => <Item {...item} location={this.props.location} key={key} />);
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

export default withRouter(Navigation);
