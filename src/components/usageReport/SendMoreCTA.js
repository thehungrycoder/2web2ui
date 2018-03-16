import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { emailRequest } from 'src/actions/account';
import { verifyEmail } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { currentPlanSelector } from 'src/selectors/accountBillingInfo';
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

  renderSupportTicketCTA() {
    const { showSupportForm } = this.state;

    return (<span>
      <UnstyledLink Component={Link} onClick={() => this.setState({ showSupportForm: !showSupportForm })}>
        Submit a request.
      </UnstyledLink>
    </span>);
  }

  handleFormSubmission = (values) => {
    const { emailRequest, account, showAlert } = this.props;

    const limitRequest = {
      limit: values.daily_limit,
      previousLimit: _.get(account, 'usage.day.limit', '').toString(),
      template_id: DAILY_LIMIT_REQUEST_TEMPLATE,
      campaign_id: `support-${DAILY_LIMIT_REQUEST_TEMPLATE}`,
      reason: values.reason
    };

    return emailRequest(limitRequest)
      .then(() => {
        this.setState({ showSupportForm: false });
        return showAlert({
          type: 'success',
          message: 'We got your request and you should hear from us soon.'
        });
      });
  }

  render() {
    const { currentUser: { email_verified: emailVerified }, currentPlan } = this.props;
    const allowSendingLimitRequest = currentPlan.status !== 'deprecated' && !/free/.test(currentPlan.code);
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
        {showSupportForm && <RequestForm onSubmit={this.handleFormSubmission}/> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentUser } = state;
  return {
    currentUser,
    account: state.account,
    verifyingEmail: currentUser.verifyingEmail,
    currentPlan: currentPlanSelector(state)
  };
};

export default connect(mapStateToProps, { verifyEmail, showAlert, emailRequest })(SendMoreCTA);

