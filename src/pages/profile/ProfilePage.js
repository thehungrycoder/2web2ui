import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';
import { get as getCurrentUser } from 'src/actions/currentUser';
import { confirmPassword } from 'src/actions/auth';
import { showAlert } from 'src/actions/globalAlert';
import { isSSOAccountSelector } from 'src/selectors/accountBillingInfo';

import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';
import TfaManager from './components/TfaManager';
import { LabelledValue } from 'src/components';
import ErrorTracker from 'src/helpers/errorTracker';

export class ProfilePage extends Component {
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

  render() {
    const {
      username,
      email,
      customer,
      isSSOAccount
    } = this.props.currentUser;

    return (
      <Page title='Profile'>
        <Panel sectioned>
          <LabelledValue label='Account ID' value={customer}/>
          <LabelledValue label='Username' value={username}/>
          <LabelledValue label='Email Address' value={email}/>
        </Panel>

        { !isSSOAccount && <TfaManager /> }

        { !isSSOAccount &&
          <Panel sectioned title='Edit Profile'>
            <NameForm onSubmit={this.updateProfile} />
          </Panel>
        }

        { !isSSOAccount &&
          <Panel sectioned title='Update Password'>
            <PasswordForm onSubmit={this.updatePassword} />
          </Panel>
        }
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  currentUser: state.currentUser,
  isSSOAccount: isSSOAccountSelector(state)
});

export default connect(mapStateToProps, { updateUser, confirmPassword, showAlert, getCurrentUser })(ProfilePage);
