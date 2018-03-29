import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';

import config from 'src/config';
import { LINKS, SPC_EU_TENANT } from 'src/constants';

export default function JoinLink({ location, tenant = config.tenant }) {
  const brand = tenant === SPC_EU_TENANT
    ? { label: 'US', url: LINKS.SPC_US_URL }
    : { label: 'EU', url: LINKS.SPC_EU_URL };

  return (
    <small>
      <UnstyledLink to={`${brand.url}${location.pathname}${location.search}`}>
        Sign up for SparkPost {brand.label}
      </UnstyledLink>
    </small>
  );
}
