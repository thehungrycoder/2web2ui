import React from 'react';

import { Grid, Panel } from '@sparkpost/matchbox';

import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

import VerificationHelp from './VerificationHelp';
import StatusDescription from './StatusDescription';
import ShareWithSubaccounts from './ShareWithSubaccounts';

export const DomainStatus = ({ domain, onShareDomainChange }) => {
  const status = resolveStatus(domain.status);
  const readyFor = resolveReadyFor(domain.status);

  return <Grid>
    <Grid.Column xs={12} md={4}>
      <h3>Status</h3>
      <VerificationHelp status={status} />
    </Grid.Column>
    <Grid.Column xs={12} md={8}>
      <Panel>
        <StatusDescription
          domain={domain}
          readyFor={readyFor}
          status={status} />
        <ShareWithSubaccounts
          domain={domain}
          onChange={onShareDomainChange} />
      </Panel>
    </Grid.Column>
  </Grid>;
};
