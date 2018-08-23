import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import { ArrowForward } from '@sparkpost/matchbox-icons';

import { updateUser } from 'src/actions/users';
import { get as getCurrentUser } from 'src/actions/currentUser';
import { confirmPassword } from 'src/actions/auth';
import { openSupportTicketForm } from 'src/actions/support';

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
  requestCancellation = () => {
    this.props.openSupportTicketForm({ issueId: 'account_cancellation' });
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

  render() {
    const { customer, email, email_verified, username, verifyingEmail } = this.props.currentUser;

    return (
      <Page title='User Profile'>

        {email_verified === false && (
          <VerifyEmailBanner verifying={verifyingEmail} />
        )}

        <Panel sectioned>
          <LabelledValue label='Account ID' value={customer}/>
          <LabelledValue label='Username' value={username}/>
          <LabelledValue label='Email Address' value={email}/>
        </Panel>

        <Panel title='Single Sign-On' actions={[{ content: 'Learn More', color: 'orange' }]}>
          <Panel.Section actions={[ { content: 'Provision SAML', color: 'orange' } ]}>
            <LabelledValue label='SAML'>
              <h6>Not Provisioned</h6>
              <p>Provision your SAML identity providor to turn on SSO.</p>
            </LabelledValue>
          </Panel.Section>
        </Panel>

        <Panel title='Single Sign-On' actions={[{ content: 'Learn More', color: 'orange' }]}>
          <Panel.Section actions={[ { content: 'Reprovision SAML', color: 'orange' }]}>
            <LabelledValue label='SAML'>
              <h6>Provisioned to your-saml-provider.example.com</h6>
            </LabelledValue>
          </Panel.Section>
          <Panel.Section actions={[ { content: 'Enable SSO', color: 'orange' } ]}>
            <LabelledValue label='Single Sign-On' value='Disabled'/>
          </Panel.Section>
        </Panel>

        <Panel title='Single Sign-On' actions={[{ content: 'Learn More', color: 'orange' }]}>
          <Panel.Section actions={[ { content: 'Reprovision SAML', color: 'orange' }]}>
            <LabelledValue label='SAML'>
              <h6>Provisioned to your-saml-provider.example.com</h6>
            </LabelledValue>
          </Panel.Section>
          <Panel.Section actions={[ { content: 'Disable SSO', color: 'orange' } ]}>
            <LabelledValue label='Single Sign-On'>
              <h6>Enabled</h6>
              <h6><UnstyledLink>Manage single sign-on users <ArrowForward/></UnstyledLink></h6>
            </LabelledValue>
          </Panel.Section>
        </Panel>

        <AccessControl condition={all(not(isAzure), not(isHeroku))}>
          <AccessControl condition={not(isSso)}>
            <TfaManager />
          </AccessControl>

          <Panel sectioned title='Edit Profile'>
            <NameForm onSubmit={this.updateProfile} />
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
  openSupportTicketForm,
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
