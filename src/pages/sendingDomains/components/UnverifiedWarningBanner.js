import React from 'react';
import { Banner } from '@sparkpost/matchbox';

const UnverifiedWarningBanner = () => {
  const action = {
    content: 'Learn more about review requirements',
    to: 'https://www.sparkpost.com/docs/getting-started/requirements-for-sending-domains/',
    external: true
  };

  return (
    <Banner
      status='warning'
      title='Unverified sending domains will be removed two weeks after creation.'
      action={action} >
      <p>All domains will also need a clear web presence to pass verification review.</p>
    </Banner>
  );
};

export default UnverifiedWarningBanner;
