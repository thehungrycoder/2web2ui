import React from 'react';
import { Banner } from '@sparkpost/matchbox';

const EmailBanner = ({ verifying, handleResend }) => {
  let action = {
    content: 'Resend Email',
    onClick: handleResend
  };

  if (verifying) {
    action = {
      content: 'Sending..',
      disabled: true
    };
  }

  return (
    <Banner
      status='info'
      title="Verify your email address"
      action={action}>
      <p>Please click the link in the email we sent you to verify your email address and unlock higher daily sending limits.</p>
    </Banner>
  );
};

export default EmailBanner;
