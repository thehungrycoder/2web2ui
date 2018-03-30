import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';

import config from 'src/config';
import { CROSS_LINK_MAP } from 'src/constants';

export default function JoinLink({ location, crossLinkTenant = config.crossLinkTenant }) {
  const brand = CROSS_LINK_MAP[crossLinkTenant];
  if (!brand) {
    return null;
  }

  return (
    <small>
      <UnstyledLink to={`${brand.url}${location.pathname}${location.search}`}>
        Sign up for SparkPost {brand.label}
      </UnstyledLink>
    </small>
  );
}
