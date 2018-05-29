import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { verifyEmail } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { openSupportTicketForm } from 'src/actions/support';
import { PageLink } from 'src/components';
import ConditionSwitch, { Case } from 'src/components/auth/ConditionSwitch';
import { AccessControl } from 'src/components/auth';
import { isAdmin, isVerified } from 'src/helpers/conditions/user';
import { hasOnlineSupport, hasStatus } from 'src/helpers/conditions/account';
import { not } from 'src/helpers/conditions';
import { LINKS } from 'src/constants';

export class SendMoreCTA extends Component {

  resendVerification = () => {
    const { verifyEmail, showAlert } = this.props;
    return verifyEmail()
      .then(() => showAlert({
        type: 'success',
        message: 'Please click the link in the email we sent you to verify your email.'
      }));
  }

  toggleSupportForm = () => {
    this.props.openSupportTicketForm({ issueId: 'daily_limits' });
  }

  renderVerifyEmailCTA() {
    const { verifyingEmail } = this.props;

    const resendVerificationLink = <UnstyledLink
      onClick={this.resendVerification}>
      Verify your email.
    </UnstyledLink>;

    return verifyingEmail ? <span>Resending a verification email... </span> : resendVerificationLink;
  }

  renderUpgradeCTA() {
    return <PageLink to="/account/billing">Upgrade your account.</PageLink>;
  }

  renderSupportTicketCTA() {
    return (
      <Fragment>
        <UnstyledLink onClick={this.toggleSupportForm}>Submit a request</UnstyledLink> to increase your daily sending limit.
      </Fragment>
    );
  }

  render() {
    return (
      <AccessControl condition={isAdmin}>
        <p>
          Need to send more?
          {' '}
          <ConditionSwitch>
            <Case condition={not(isVerified)} children={this.renderVerifyEmailCTA()}/>
            <Case condition={not(hasOnlineSupport)} children={this.renderUpgradeCTA()}/>
            <Case condition={hasStatus('active')} children={this.renderSupportTicketCTA()}/>
          </ConditionSwitch>
          {' '}
          <UnstyledLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC} external>Learn more about these limits.</UnstyledLink>
        </p>
      </AccessControl>
    );
  }
}

const mapStateToProps = (state) => ({
  verifyingEmail: state.currentUser.verifyingEmail
});
const mapDispatchToProps = {
  verifyEmail, showAlert, openSupportTicketForm
};
export default connect(mapStateToProps, mapDispatchToProps)(SendMoreCTA);
