import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import styles from './Navigation.module.scss';

const Chevron = () => (
  <svg className={styles.chevron} height="1792" viewBox="0 0 1792 1792" width="1792" xmlns="http://www.w3.org/2000/svg">
  <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"/></svg>
);

export class Item extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false
    };
  }

  renderChildren () {
    const { children, location } = this.props;

    return (
      <ul className={styles.nestedList}>
        { children.map((child, key) => <Item {...child} location={location} key={key} />) }
      </ul>
    );
  }

  handleClick () {
    this.setState({ open: !this.state.open });
  }

  componentWillMount () {
    const { to, location } = this.props;
    if (location.pathname.includes(to)) {
      this.setState({
        open: true
      });
    }
  }

  render () {
    const {
      to,
      icon,
      label,
      location,
      children
    } = this.props;

    const active = location.pathname.includes(to); // Not sure if this is the best way to do this
    const linkClasses = classnames(
      styles.link,
      active && styles.isActive,
      children && styles.hasChildren,
      this.state.open && styles.isOpen
    );

    return (
      <span>
        { children
          ? <li>
              <a onClick={() => this.handleClick()} className={linkClasses}>
                <span className={styles.icon}>{ icon }</span>
                { label }
                <Chevron />
              </a>
              { this.renderChildren() }
            </li>

          : <li>
              <Link to={ to } className={linkClasses}>
                { icon && <span className={styles.icon}>{ icon }</span>}
                { label }
              </Link>
            </li>
        }
      </span>
    );
  }
}
export default withRouter(Item);
