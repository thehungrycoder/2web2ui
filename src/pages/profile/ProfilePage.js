import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Page, Panel } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';
import { get as getCurrentUser } from 'src/actions/currentUser';
import { confirmPassword } from 'src/actions/auth';
import { showAlert } from 'src/actions/globalAlert';
import { openSupportTicket } from 'src/actions/support';

import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';
import TfaManager from './components/TfaManager';
import { AccessControl } from 'src/components/auth';
import { LabelledValue } from 'src/components';
import ErrorTracker from 'src/helpers/errorTracker';
import { all, not } from 'src/helpers/conditions';
import { isHeroku, isAzure } from 'src/helpers/conditions/user';

export class ProfilePage extends Component {
  requestCancellation = () => {
    this.props.openSupportTicket({ issueId: 'account_cancellation' });
  }

  updateProfile = (values) => {
    const { username } = this.props.currentUser;
    const data = { first_name: values.firstName, last_name: values.lastName };

    return this.props.updateUser(username, data)
      .then(
        // update success, re-fetch current user but ignore re-fetch errors
        () => this.props.getCurrentUser().catch((err) => {
          ErrorTracker.report('silent-ignore-refetch-current-user', err);
        })
      );
  }

  updatePassword = (values) => {
    const { username } = this.props.currentUser;
    const { currentPassword, newPassword } = values;

    return this.props.confirmPassword(username, currentPassword)
      .then(() => this.props.updateUser(username, { password: newPassword }));
  }

  render () {
    const {
      username,
      email,
      customer
    } = this.props.currentUser;

    return (
      <Page title='Profile'>
        <Panel sectioned>
          <LabelledValue label='Account ID' value={customer}/>
          <LabelledValue label='Username' value={username}/>
          <LabelledValue label='Email Address' value={email}/>
        </Panel>

        <AccessControl condition={all(not(isAzure), not(isHeroku))}>
          <TfaManager />

          <Panel sectioned title='Edit Profile'>
            <NameForm onSubmit={this.updateProfile} />
          </Panel>

          <Panel sectioned title='Update Password'>
            <PasswordForm onSubmit={this.updatePassword} />
          </Panel>
        </AccessControl>

        <Panel sectioned title="Cancel Account">
          <p>Cancelling your account is permanent and cannot be undone.</p>
          <Button destructive onClick={this.requestCancellation}>Cancel Account</Button>
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ account, currentUser }) => ({
  account,
  currentUser
});

const mapDispatchToProps = {
  confirmPassword,
  getCurrentUser,
  openSupportTicket,
  showAlert,
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
