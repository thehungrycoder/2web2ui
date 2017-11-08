import React from 'react';
import { Banner } from '@sparkpost/matchbox';

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
      <p>Unverified domains can't be used or set as default.</p>
      <p>To verify a tracking domain, edit its DNS settings to <strong>add a CNAME record</strong> with the value of <strong>spgo.io</strong>. <a href="http://google.com" target="_blank" rel="noopener noreferrer">Learn more about editing your DNS settings.</a></p>
      <p><small>Note: DNS settings sometimes need up to 24 hours to take effect. If your domain doesn't verify immediately, you may need to check back later.</small></p>
    </Banner>
  );
};

export default UnverifiedBanner;
