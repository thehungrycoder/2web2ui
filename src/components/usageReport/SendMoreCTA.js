import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { verifyEmail } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { openSupportPanel, hydrateTicketForm } from 'src/actions/support';
import { PageLink } from 'src/components';
import { allowSendingLimitRequestSelector } from 'src/selectors/support';
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

  renderVerifyEmailCTA () {
    const { verifyingEmail } = this.props;

    const resendVerificationLink = <UnstyledLink
      onClick={this.resendVerification}>
      Verify your email.
    </UnstyledLink>;

    return verifyingEmail ? <span>Resending a verification email... </span> : resendVerificationLink;
  }

  renderUpgradeCTA () {
    return <PageLink to="/account/billing">Upgrade your account.</PageLink>;
  }

  toggleSupportForm = () => {
    const { openSupportPanel, hydrateTicketForm } = this.props;
    openSupportPanel({ view: 'ticket' });
    hydrateTicketForm({ issueId: 'daily_limits' });
  }


  renderSupportTicketCTA () {
    return (
      <Fragment>
        <UnstyledLink onClick={this.toggleSupportForm}>Submit a request</UnstyledLink> to increase your daily sending limit.
      </Fragment>
    );
  }

  render () {
    const { currentUser: { email_verified: emailVerified }, allowSendingLimitRequest } = this.props;

    return (
      <p>
        Need to send more?
        {' '}
        {!emailVerified && this.renderVerifyEmailCTA()}
        {emailVerified && !allowSendingLimitRequest && this.renderUpgradeCTA()}
        {emailVerified && allowSendingLimitRequest && this.renderSupportTicketCTA()}
        {' '}
        <UnstyledLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC} external>Learn more about these limits.</UnstyledLink>
      </p>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  verifyingEmail: state.currentUser.verifyingEmail,
  allowSendingLimitRequest: allowSendingLimitRequestSelector(state)
});
const mapDispatchToProps = {
  verifyEmail, showAlert, openSupportPanel, hydrateTicketForm
};
export default connect(mapStateToProps, mapDispatchToProps)(SendMoreCTA);
