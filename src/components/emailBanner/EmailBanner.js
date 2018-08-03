import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Banner } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert'
import { verifyEmail } from 'src/actions/currentUser'

export class EmailBanner extends Component {
  handleClick = () => {
    this.props.verifyEmail().then(() => this.props.showAlert({
      type: 'success',
      message: 'Please click the link in the email we sent you to verify your email.'
    }));
  }

  render() {
    let action = {
      content: 'Resend Email',
      onClick: this.handleClick
    };

    if (this.props.verifying) {
      action = {
        content: 'Sending..',
        disabled: true,
      };
    }

    return (
      <Banner
        action={action}
        status='info'
        title="Verify your email address"
      >
        <p>
          Please click the link in the email we sent you to verify your email
          address and unlock higher daily sending limits.
        </p>
      </Banner>
    );
  }
}

const mapDispatchToProps = {
  verifyEmail,
  showAlert
}

export default connect(undefined, mapDispatchToProps)(EmailBanner);
