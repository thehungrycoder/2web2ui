import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import Item from './Item';
import Footer from './Footer';
import navItems from './navItems';
import { Icon } from '@sparkpost/matchbox';
import styles from './Navigation.module.scss';

class Navigation extends Component {
  state = {
    open: false
  }

  renderItems() {
    return navItems.map((item, key) => <Item {...item} location={this.props.location} key={key} />);
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const navClasses = classnames(
      styles.navigation,
      this.state.open && styles.showNav
    );

    const overlayClasses = classnames(
      styles.overlay,
      this.state.open && styles.showOverlay
    );

    return (
      <div>
        <div
          className={overlayClasses}
          onClick={() => this.handleClick()} />

        <nav className={navClasses}>
          <div className={styles.wrapper}>
            <ul className={styles.list}>
              { this.renderItems() }
            </ul>
            <Footer />
          </div>
          <Icon
            name='Close'
            className={styles.close}
            size={33}
            onClick={() => this.handleClick()} />
        </nav>

        <nav className={styles.bar}>
          <a className={styles.open} onClick={() => this.handleClick()}>
            <span className={styles.hamburger} />
          </a>
        </nav>
      </div>
    );
  }
}

export default withRouter(Navigation);
