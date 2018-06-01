import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { WindowSizeContext } from 'src/context/WindowSize';
import { selectAccountNavItems } from 'src/selectors/navItems';
import { UnstyledLink, Popover, ActionList } from '@sparkpost/matchbox';
import { ArrowDropDown, Person } from '@sparkpost/matchbox-icons';
import styles from './AccountDropdown.module.scss';

export class AccountDropdown extends Component {
  state = {
    // Using controlled open state so we can close the popover on click
    open: false
  }

  toggleDropdown = () => {
    this.setState({ open: !this.state.open });
  }

  renderActivator = () => (
    <WindowSizeContext.Consumer>
      {({ mobile }) => (
        <UnstyledLink className={styles.Email} onClick={this.toggleDropdown}>
          {(mobile || !this.props.email) ? <Person size={24}/> : <Fragment>{this.props.email} <ArrowDropDown/></Fragment>}
        </UnstyledLink>
      )}
    </WindowSizeContext.Consumer>
  );

  getItems() {
    const { accountNavItems, dispatch } = this.props;
    const items = accountNavItems.map(({ action, label, external, condition, icon: Icon, ...rest }) => {
      const content = Icon
        ? <Fragment>{label} <div className={styles.FloatIcon}><Icon size={15} /></div></Fragment>
        : label;
      const listItem = { content, external, ...rest };

      if (!external) {
        listItem.component = Link;
      }

      if (action) {
        listItem.onClick = () => dispatch(action());
      }

      return listItem;
    });

    return items;
  }

  render() {
    return (
      <Popover left trigger={this.renderActivator()} open={this.state.open} onClose={this.toggleDropdown}>
        <ActionList
          className={styles.AccountList}
          onClick={this.toggleDropdown}
          actions={this.getItems()}
        />
      </Popover>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.currentUser.email,
  accountNavItems: selectAccountNavItems(state)
});

export default connect(mapStateToProps)(AccountDropdown);
