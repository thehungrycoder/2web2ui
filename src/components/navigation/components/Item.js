import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { WindowSizeContext } from 'src/context/WindowSize';
import { Tag } from '@sparkpost/matchbox';
import { ChevronLeft } from '@sparkpost/matchbox-icons';
import classnames from 'classnames';
import styles from './Item.module.scss';

const TAGS = {
  beta: { label: 'BETA' },
  new: { color: 'blue', label: 'NEW' },
  labs: { label: 'LABS' }
};

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
      children,
      divider,
      icon: Icon,
      label,
      tag,
      to,
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
    let releaseTag;

    if (children) {
      return (
        <li>
          <a onClick={() => this.handleParentClick()} className={linkClasses}>
            <span className={styles.iconWrapper}><Icon size={21} className={styles.icon} /></span>
            <div className={styles.Label}>{label}</div>
            <ChevronLeft className={styles.chevron} />
          </a>
          {this.renderChildren()}
        </li>
      );
    }

    if (tag) {
      const tagSpec = TAGS[tag];
      releaseTag = <Tag color={tagSpec.color}>{tagSpec.label}</Tag>;
    }

    return (
      <li>
        {divider && <hr className={styles.divider}/>}
        <Link to={to} className={linkClasses} onClick={mobile ? toggleMobileNav : null}>
          {Icon && <span className={styles.iconWrapper}><Icon size={21} className={styles.icon} /></span>}
          <div className={styles.Label}>{label}</div>
          {releaseTag && <div className={styles.releaseTag}>{releaseTag}</div>}
        </Link>
      </li>
    );
  }

  render() {
    return <WindowSizeContext.Consumer children={this.renderItem} />;
  }
}

Item.propTypes = {
  tag: PropTypes.oneOf(['new', 'beta', 'labs'])
};

export default Item;
