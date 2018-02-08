import React from 'react';

import { Panel } from '@sparkpost/matchbox';

import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

import VerificationHelp from './VerificationHelp';
import StatusDescription from './StatusDescription';
import ShareWithSubaccounts from './ShareWithSubaccounts';
import { SendingDomainSection } from './SendingDomainSection';

export const DomainStatus = ({ domain, onShareDomainChange }) => {
  const status = resolveStatus(domain.status);
  const readyFor = resolveReadyFor(domain.status);

  return (
    <SendingDomainSection title='Status'>
      <SendingDomainSection.Left>
        <VerificationHelp status={status} />
      </SendingDomainSection.Left>
      <SendingDomainSection.Right>
        <Panel>
          <StatusDescription
            domain={domain}
            readyFor={readyFor}
            status={status} />
          <ShareWithSubaccounts
            domain={domain}
            onChange={onShareDomainChange} />
        </Panel>
      </SendingDomainSection.Right>
    </SendingDomainSection>
  );
};
