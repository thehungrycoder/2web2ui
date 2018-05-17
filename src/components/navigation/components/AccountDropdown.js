import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LINKS } from 'src/constants';
import { WindowSizeContext } from 'src/context/WindowSize';
import { isHeroku } from 'src/helpers/conditions/user';
import { logout } from 'src/actions/auth';
import { UnstyledLink, Popover, ActionList } from '@sparkpost/matchbox';
import { ArrowDropDown, OpenInNew, Person } from '@sparkpost/matchbox-icons';
import styles from './AccountDropdown.module.scss';

class AccountDropdown extends Component {
  state = {
    // Using controlled open state so we can close the popover on click
    open: false
  }

  toggleDropdown = () => {
    this.setState({ open: !this.state.open });
  }

  renderActivator = ({ mobile }) => (
    <UnstyledLink className={styles.Email} onClick={this.toggleDropdown}>
      {mobile ? <Person size={24}/> : <Fragment>{this.props.email} <ArrowDropDown/></Fragment>}
    </UnstyledLink>
  );

  render() {
    const { logout, isHeroku } = this.props;

    const activator = <WindowSizeContext children={this.renderActivator} />;
    const docsContent = <Fragment>API Documentation <div className={styles.FloatIcon}><OpenInNew size={15}/></div></Fragment>;

    return (
      <Popover left trigger={activator} open={this.state.open} onClose={this.toggleDropdown}>
        <ActionList className={styles.AccountList} onClick={this.toggleDropdown}
          sections={[[
            { content: 'Profile', to: '/account/profile', component: Link },
            { content: 'Billing', to: '/account/billing', component: Link },
            { content: 'Manage Users', to: '/account/users', component: Link }
          ],
          ...(!isHeroku ? [
            [{ content: docsContent, external: true, to: LINKS.DOCS }],
            [{ content: 'Log Out', onClick: logout }]
          ] : [])
          ]}/>
      </Popover>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.currentUser.email,
  isHeroku: isHeroku(state)
});
export default connect(mapStateToProps, { logout })(AccountDropdown);
