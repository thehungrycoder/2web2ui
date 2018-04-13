import React from 'react';
import { DomainStatusTag } from 'src/components';
import ReadyFor from './ReadyFor';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

const DomainStatusCell = ({ domain }) => {
  const { status, is_default_bounce_domain, subaccount_id } = domain;
  const domainStatus = resolveStatus(status);

  if (domainStatus !== 'verified') {
    return <DomainStatusTag status={domainStatus} />;
  }

  return <ReadyFor {...resolveReadyFor(status)} bounceDefault={is_default_bounce_domain} subaccount={subaccount_id} />;

};

export default DomainStatusCell;
