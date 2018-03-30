import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';

import config from 'src/config';
import { LINKS, SPC_TENANT, SPC_EU_TENANT } from 'src/constants';

export default function JoinLink({ location, tenant = config.tenant }) {
  const brandMap = {
    [SPC_EU_TENANT]: { label: '', url: LINKS.SPC_US_URL },
    [SPC_TENANT]: { label: 'EU', url: LINKS.SPC_EU_URL }
  };

  if (!(tenant in brandMap)) {
    return null;
  }

  const brand = brandMap[tenant];

  return (
    <small>
      <UnstyledLink to={`${brand.url}${location.pathname}${location.search}`}>
        Sign up for SparkPost {brand.label}
      </UnstyledLink>
    </small>
  );
}
