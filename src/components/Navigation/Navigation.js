import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';

import navItems from './navItems';
import styles from './Navigation.module.scss';

const NavItem = ({ to, label, children }) => {
  const renderChildren = () => (
    <ul className={styles.nestedList}>{ children.map((child, key) => <NavItem {...child} key={key} />) }</ul>
  );

  return (
      <li className={styles.item}>
        <Link to={ to } className={styles.link}>{ label }</Link>
        { children && renderChildren() }
      </li>
  );
};

export class Navigation extends Component {
  render () {
    // const { logout } = this.props;

    const renderItems = () => navItems.map((item, key) => <NavItem {...item} key={key} />);

    return (
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          { renderItems() }
          {/* <li><a style={{ cursor: 'pointer' }} onClick={() => logout()}>Log out</a></li> */}
        </ul>
      </nav>
    );
  }
}

export default connect(({ auth }) => ({ auth }), { logout })(Navigation);
