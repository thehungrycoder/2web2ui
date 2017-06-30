import React from 'react';
import { Banner } from '@sparkpost/matchbox';

const EmailBanner = ({ sendingStatus, handleResend }) => {
  let action = {
    content: 'Resend Email',
    onClick: handleResend
  };
  let sentMarkup = null;

  if (sendingStatus === 'sending') {
    action = {
      content: 'Sending..',
      disabled: true
    };
  }

  if (sendingStatus === 'sent') {
    action = null;
    sentMarkup = <p><strong>Email sent!</strong></p>;
  }

  return (
    <Banner
      status='info'
      title="Verify your email address"
      action={action}>
      <p>Please click the link in the email we sent you to verify your email address and unlock higher daily sending limits.</p>
      { sentMarkup }
    </Banner>
  );
};

export default EmailBanner;
