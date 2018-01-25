import React, { Fragment } from 'react';

import { Panel } from '@sparkpost/matchbox';

import { DomainStatusTag, SubaccountTag } from 'src/components/tags';
import { LabelledValue } from 'src/components';

import ReadyFor from './ReadyFor';

const StatusDescription = ({ status, readyFor, subaccount, shared, bounceDefault }) => <Fragment>
  <Panel.Section>
    <LabelledValue label='Status'>
      { status !== 'verified' && <DomainStatusTag status={status} /> }
      <ReadyFor {...readyFor} bounceDefault={bounceDefault} />
    </LabelledValue>
  </Panel.Section>
  {
    (subaccount || shared) &&
      <Panel.Section>
        <LabelledValue label='Subaccount'>
          <SubaccountTag id={subaccount} all={shared} />
        </LabelledValue>
      </Panel.Section>
  }
</Fragment>;

export default StatusDescription;
