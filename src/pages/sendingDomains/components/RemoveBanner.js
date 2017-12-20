import React from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '@sparkpost/matchbox';

const RemoveBanner = () => {
  const action = {
    content: 'Learn more about review requirements',
    Component: Link,
    to: 'https://www.sparkpost.com/docs/getting-started/requirements-for-sending-domains/',
    external: true
  };

  return (
    <Banner
      status='info'
      title='Unverified sending domains will be removed two weeks after creation.'
      action={action} >
      <p>All domains will also need a clear web presence to pass verification review.</p>
    </Banner>
  );
};

export default RemoveBanner;
