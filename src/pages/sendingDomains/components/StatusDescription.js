import React, { Fragment } from 'react';

import { Panel } from '@sparkpost/matchbox';

import { DomainStatusTag, SubaccountTag } from 'src/components/tags';
import { LabelledValue, ReadyFor, StatusTooltipHeader } from 'src/components';

import { VerifiedIcon } from './Icons';

const StatusDescription = ({ domain, readyFor, status }) => {
  const {
    subaccount_id,
    is_default_bounce_domain
  } = domain;

  return <Fragment>
    <Panel.Section>
      <LabelledValue label={<StatusTooltipHeader />}>
        { status === 'verified' && <div><VerifiedIcon/> <strong>Verified</strong></div> }
        { status !== 'verified' && <DomainStatusTag status={status} /> }
        <ReadyFor {...readyFor} bounceDefault={is_default_bounce_domain} />
      </LabelledValue>
    </Panel.Section>
    {
      subaccount_id &&
        <Panel.Section>
          <LabelledValue label='Subaccount'>
            <SubaccountTag id={subaccount_id} />
          </LabelledValue>
        </Panel.Section>
    }
  </Fragment>;
};

export default StatusDescription;
