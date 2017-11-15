import React from 'react';
import { Banner, Button } from '@sparkpost/matchbox';

const UnverifiedBanner = ({ unverifiedDomains }) => {
  const count = unverifiedDomains.length;

  if (!count) {
    return null;
  }

  const title = count > 1 ? `You have ${count} unverified tracking domains` : 'You have an unverified tracking domain';

  return (
    <Banner
      status='warning'
      title={title}>
      <p>To verify a tracking domain, edit its DNS settings to <strong>add a CNAME record</strong> with the value of <strong>spgo.io</strong>.</p>
      <Button outline external to="https://www.sparkpost.com/docs/tech-resources/enabling-multiple-custom-tracking-domains/">Learn more</Button>
    </Banner>
  );
};

export default UnverifiedBanner;
