import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { WindowSizeContext } from 'src/context/WindowSize';
import { selectAccountNavItems } from 'src/selectors/navItems';
import { logout } from 'src/actions/auth';
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
    const { accountNavItems } = this.props;
    const items = accountNavItems.map(({ label, external, condition, icon: Icon, ...rest }) => {
      const content = Icon
        ? <Fragment>{label} <div className={styles.FloatIcon}><Icon size={15} /></div></Fragment>
        : label;
      const listItem = { content, external, ...rest };

      if (!external) {
        listItem.component = Link;
      }

      return listItem;
    });
    // TODO: move this transformation into matchbox ActionList for declarative sectioning
    // i.e. actions key is treated as sections = sort/group/values ...
    // if there's just one it will look the same as it does now
    const sorted = _.sortBy(items, 'section');
    const sections = _.groupBy(sorted, 'section');
    return _.values(sections);
  }

  render() {
    return (
      <Popover left trigger={this.renderActivator()} open={this.state.open} onClose={this.toggleDropdown}>
        <ActionList
          className={styles.AccountList}
          onClick={this.toggleDropdown}
          sections={this.getItems()}
        />
      </Popover>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.currentUser.email,
  accountNavItems: selectAccountNavItems(state)
});
export default connect(mapStateToProps, { logout })(AccountDropdown);
