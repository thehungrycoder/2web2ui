import React from 'react';

const VerificationHelp = ({ status }) => {
  if (status === 'verified') {
    return null;
  }

  return <p>
    Need help verifying your domain? <a href="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#step-2-verifying-domain-ownership" rel="noopener noreferrer" target="_blank">Follow this guide.</a>
  </p>;
};

export default VerificationHelp;
