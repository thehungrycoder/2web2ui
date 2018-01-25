import React from 'react';

import { Grid, Panel } from '@sparkpost/matchbox';

import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

import StatusDescription from './StatusDescription';
import ShareWithSubaccounts from './ShareWithSubaccounts';

const VerificationHelp = ({ status }) => {
  if (status === 'verified') {
    return null;
  }

  return <p>
    Need help verifying your domain?
    <a href="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#step-2-verifying-domain-ownership" rel="noopener noreferrer" target="_blank"> Follow this guide.</a>
  </p>;
};

export const DomainStatus = ({ domain, onShareDomainChange }) => {
  const status = resolveStatus(domain.status);
  const readyFor = resolveReadyFor(domain.status);

  return <Grid>
    <Grid.Column xs={12} md={4}>
      <h1>Status</h1>
      <VerificationHelp status={status} />
    </Grid.Column>
    <Grid.Column xs={12} md={8}>
      <Panel accent>
        <StatusDescription
          name={domain.id}
          readyFor={readyFor}
          subaccount={domain.subaccount_id}
          shared={domain.shared_with_subaccounts}
          bounceDefault={domain.is_default_bounce_domain}
          status={status} />
        <ShareWithSubaccounts
          domain={domain}
          onChange={onShareDomainChange} />
      </Panel>
    </Grid.Column>
  </Grid>;
};
