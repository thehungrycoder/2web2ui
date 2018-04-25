import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { SparkPost } from 'src/components';
import Item from './Item';
import Footer from './Footer';
import selectNavItems from 'src/selectors/navItems';
import { Close } from '@sparkpost/matchbox-icons';
import styles from './Navigation.module.scss';

export class Navigation extends Component {
  state = {
    open: false
  };

  renderItems(items) {
    return this.props.navItems.map((item, key) => (
      <Item {...item} location={this.props.location} key={key} />
    ));
  }

  handleClick = () => {
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
          onClick={this.handleClick} />

        <nav className={navClasses}>
          <div className={styles.wrapper}>
            <ul className={styles.list}>
              <div className={styles.logo}><SparkPost.Logo type='white' /></div>
              {this.renderItems()}
            </ul>
            <Footer />
          </div>
          <Close
            className={styles.close}
            size={33}
            onClick={this.handleClick} />
        </nav>

        <nav className={styles.bar}>
          <div className={styles.mobileLogo}><SparkPost.Logo type='white' /></div>
          <a className={styles.open} onClick={this.handleClick}>
            <span className={styles.hamburger} />
          </a>
        </nav>
      </div>
    );
  }
}

export default withRouter(connect((state) => ({
  navItems: selectNavItems(state)
}))(Navigation));
