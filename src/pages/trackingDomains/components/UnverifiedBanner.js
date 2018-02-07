import React from 'react';
import { Banner, Button } from '@sparkpost/matchbox';
import config from 'src/config';
import { LINKS } from 'src/constants';
const cname = config.trackingDomains.cnameValue;

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
      <p>To verify a tracking domain, edit its DNS settings to <strong>add a CNAME record</strong> with the value of <strong>{cname}</strong>.</p>
      <Button outline external to={LINKS.DOMAIN_VERIFICATION}>Learn more</Button>
    </Banner>
  );
};

export default UnverifiedBanner;
