import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';
import { update as updateCurrentUser } from 'src/actions/currentUser';
import { confirmPassword } from 'src/actions/auth';
import { showAlert } from 'src/actions/globalAlert';

import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';
import { LabelledValue } from 'src/components';

export class ProfilePage extends Component {
  updateProfile = (values) => {
    const { username } = this.props.currentUser;
    const data = { first_name: values.firstName, last_name: values.lastName };

    return this.props.updateUser(username, data)
      .then(() => this.props.updateCurrentUser(data))
      .catch((err) => showAlert({ type: 'error', message: 'Unable to update profile' }));
  }

  updatePassword = (values) => {
    const { username } = this.props.currentUser;
    const { showAlert } = this.props;
    const { currentPassword, newPassword } = values;

    return this.props.confirmPassword(username, currentPassword)
      .then(() => this.props.updateUser(username, { password: newPassword }))
      .catch((err) => showAlert({ type: 'error', message: 'Unable to update password' }));
  }

  render() {
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

        <Panel sectioned title='Edit Profile'>
          <NameForm onSubmit={this.updateProfile} />
        </Panel>

        <Panel sectioned title='Update Password'>
          <PasswordForm onSubmit={this.updatePassword} />
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ account, currentUser }) => ({
  account,
  currentUser
});

export default connect(mapStateToProps, { updateUser, confirmPassword, showAlert, updateCurrentUser })(ProfilePage);
