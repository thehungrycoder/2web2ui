import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { verifyEmail } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { currentPlanSelector } from 'src/selectors/accountBillingInfo';

import { LINKS } from 'src/constants';

export class UpgradeCTA extends Component {
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
    return (<span>
      <UnstyledLink Component={Link} to='/account/billing'>
        Submit a request.
      </UnstyledLink>
      {' '}
      Please note this process may take up to 2 business days.
    </span>);
  }

  render() {
    const { currentUser: { email_verified: emailVerified }, currentPlan } = this.props;
    const allowSendingLimitRequest = currentPlan.status !== 'deprecated' && !/free/.test(currentPlan.code);

    return (
      <span>
        <span>Need to send more? </span>
        { !emailVerified && this.renderVerifyEmailCTA() }
        { emailVerified && !allowSendingLimitRequest && this.renderUpgradeCTA() }
        { emailVerified && allowSendingLimitRequest && this.renderSupportTicketCTA() }
        {' '}
        <UnstyledLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC} external>
           Learn more about these limits.
        </UnstyledLink>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentUser } = state;
  return {
    currentUser,
    verifyingEmail: currentUser.verifyingEmail,
    currentPlan: currentPlanSelector(state)
  };
};

export default connect(mapStateToProps, { verifyEmail, showAlert })(UpgradeCTA);

