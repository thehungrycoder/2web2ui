import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';
import { get as getCurrentUser } from 'src/actions/currentUser';
import { confirmPassword } from 'src/actions/auth';

import VerifyEmailBanner from 'src/components/verifyEmailBanner/VerifyEmailBanner';
import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';
import TfaManager from './components/TfaManager';
import { AccessControl } from 'src/components/auth';
import { LabelledValue } from 'src/components';
import ErrorTracker from 'src/helpers/errorTracker';
import { all, not } from 'src/helpers/conditions';
import { isHeroku, isAzure, isSso } from 'src/helpers/conditions/user';

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
    const { email, email_verified, username, verifyingEmail } = this.props.currentUser;

    return (
      <Page title='Profile'>

        {email_verified === false && (
          <VerifyEmailBanner verifying={verifyingEmail} />
        )}

        <Panel sectioned>
          <LabelledValue label='Username' value={username}/>
          <LabelledValue label='Email Address' value={email}/>
        </Panel>

        <AccessControl condition={all(not(isAzure), not(isHeroku))}>
          <AccessControl condition={not(isSso)}>
            <TfaManager />
          </AccessControl>

          <Panel sectioned title='Edit Profile'>
            <NameForm onSubmit={this.updateProfile} />
            <button onClick={() => { throw new Error('i am occurred'); }}>Cause Error</button>
          </Panel>

          <AccessControl condition={not(isSso)}>
            <Panel sectioned title='Update Password'>
              <PasswordForm onSubmit={this.updatePassword} />
            </Panel>
          </AccessControl>
        </AccessControl>
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
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
