import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BaseModal } from 'src/components';
import { UnstyledLink, Panel } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { emailRequest } from 'src/actions/account';
import { verifyEmail } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { allowSendingLimitRequestSelector, currentLimitSelector } from 'src/selectors/support';
import RequestForm from './RequestForm';
import { LINKS, DAILY_LIMIT_REQUEST_TEMPLATE } from 'src/constants';

export class SendMoreCTA extends Component {
  state = {
    showSupportForm: false
  }

  resendVerification = () => {
    const { verifyEmail, showAlert } = this.props;
    return verifyEmail()
      .then(() => showAlert({
        type: 'success',
        message: 'Please click the link in the email we sent you to verify your email.'
      }));
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
    return (<UnstyledLink Component={Link} to='/account/billing'>
      Upgrade your account.
    </UnstyledLink>);
  }

  toggleSupportForm = () => {
    const { showSupportForm } = this.state;
    this.setState({ showSupportForm: !showSupportForm });
  }


  renderSupportTicketCTA() {

    return (<span>
      <UnstyledLink Component={Link} onClick={this.toggleSupportForm}>
        Submit a request.
      </UnstyledLink>
    </span>);
  }

  handleFormSubmission = (values) => {
    const { emailRequest, showAlert, currentLimit } = this.props;

    const limitRequest = {
      limit: values.dailyLimit,
      previousLimit: currentLimit,
      template_id: DAILY_LIMIT_REQUEST_TEMPLATE,
      campaign_id: `support-${DAILY_LIMIT_REQUEST_TEMPLATE}`,
      reason: values.reason
    };

    return emailRequest(limitRequest)
      .then(() => {
        this.toggleSupportForm();
        return showAlert({
          type: 'success',
          message: 'We got your request and you should hear from us soon.'
        });
      });
  }

  renderSupportTicketModal() {
    const { currentLimit } = this.props;

    return (<BaseModal open={this.state.showSupportForm}>
      <Panel title='Request Daily Limit Increase'>
        <RequestForm onSubmit={this.handleFormSubmission}
          currentLimit={currentLimit} onCancel={this.toggleSupportForm}
        />
      </Panel>
    </BaseModal>);
  }

  render() {
    const { currentUser: { email_verified: emailVerified }, allowSendingLimitRequest } = this.props;
    const { showSupportForm } = this.state;

    return (
      <div>
        <p>
          <span>Need to send more? </span>
          { !emailVerified && this.renderVerifyEmailCTA() }
          { emailVerified && !allowSendingLimitRequest && this.renderUpgradeCTA() }
          { emailVerified && allowSendingLimitRequest && this.renderSupportTicketCTA() }
          {' '}
          <UnstyledLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC} external>
            Learn more about these limits.
          </UnstyledLink>
        </p>
        {showSupportForm && this.renderSupportTicketModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentUser } = state;
  return {
    currentUser,
    verifyingEmail: currentUser.verifyingEmail,
    allowSendingLimitRequest: allowSendingLimitRequestSelector(state),
    currentLimit: currentLimitSelector(state)
  };
};

export default connect(mapStateToProps, { verifyEmail, showAlert, emailRequest })(SendMoreCTA);

