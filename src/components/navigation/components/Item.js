import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { WindowSizeContext } from 'src/context/WindowSize';
import { ChevronLeft } from '@sparkpost/matchbox-icons';
import classnames from 'classnames';
import styles from './Item.module.scss';

export class Item extends Component {
  state = {
    open: false
  };

  isActive() {
    const { to, location } = this.props;
    return location.pathname.includes(to);
  }

  handleParentClick() {
    this.setState({ open: !this.state.open });
  }

  componentDidMount() {
    if (this.isActive()) {
      this.setState({ open: true });
    }
  }

  renderChildren() {
    const { children, location, mobile, toggleMobileNav } = this.props;

    return (
      <ul className={styles.NestedList}>
        {children.map((child, key) => <Item {...child} mobile={mobile} location={location} key={key} toggleMobileNav={toggleMobileNav} />)}
      </ul>
    );
  }

  renderItem = ({ mobile }) => {
    const {
      to,
      icon: Icon,
      label,
      children,
      toggleMobileNav
    } = this.props;

    const active = this.isActive();
    const linkClasses = classnames(
      styles.Link,
      active && styles.isActive,
      children && styles.hasChildren,
      this.state.open && styles.isOpen,
      mobile && styles.mobile
    );

    return (
      <span>
        {children ? (
          <li>
            <a onClick={() => this.handleParentClick()} className={linkClasses}>
              <span className={styles.iconWrapper}><Icon size={21} className={styles.icon} /></span>
              {label}
              <ChevronLeft className={styles.chevron} />
            </a>
            {this.renderChildren()}
          </li>
        ) : (
          <li>
            <Link to={to} className={linkClasses} onClick={mobile ? toggleMobileNav : null}>
              {Icon && <span className={styles.iconWrapper}><Icon size={21} className={styles.icon} /></span>}
              {label}
            </Link>
          </li>
        )}
      </span>
    );
  }

  render() {
    return <WindowSizeContext.Consumer children={this.renderItem} />;
  }
}

export default Item;
