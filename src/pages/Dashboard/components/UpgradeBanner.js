import React from 'react';
import { Link } from 'react-router-dom';

import { Banner } from '@sparkpost/matchbox';

const UpgradeBanner = ({ hasCC }) => {
  if (hasCC) {
    return (
      <Banner
        title='Send more mail'
        status='info'
        action={{
          content: 'Upgrade Now',
          Component: Link,
          to: '/settings/profile'
        }}>
        <p>Upgrade now to increase daily limits and start sending more mail.</p>
      </Banner>
    );
  }

  return (
    <Banner
      title='Increase your daily sending limits'
      status='info'
      action={{
        content: 'Add Payment Information',
        Component: Link,
        to: '/settings/profile'
      }}>
      <p>Add a credit card to your account to unlock higher sending limits.</p>
    </Banner>
  );
};

export default UpgradeBanner;
