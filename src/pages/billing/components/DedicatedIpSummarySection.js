import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import { LabelledValue } from 'src/components';
import DedicatedIpCost from './DedicatedIpCost';

export default function DedicatedIpSummarySection({ count = 0, plan = {}, onClick = _.noop }) {
  const hasReachedMax = count >= config.sendingIps.maxPerAccount;

  // There are some paid accounts that do not allow dedicated IPs
  const action = plan.canPurchaseIps
    ? { content: 'Add Dedicated IPs', disabled: hasReachedMax, onClick }
    : { content: 'Upgrade Now', to: '/account/billing/plan', Component: Link };

  // Decrement count if plan includes one free IP
  const billableCount = count > 0 && plan.includesIp ? count - 1 : count;

  const summary = count === 0
    ? <h6>0</h6>
    : <h6>{count} for <DedicatedIpCost plan={plan} quantity={billableCount} /></h6>;

  return (
    <Panel.Section actions={[action]}>
      <LabelledValue label='Dedicated IPs'>
        {summary}
        {count === 0 && plan.includesIp && <p>First is free!</p>}
        {hasReachedMax && <p>You have reached the maximum allowed.</p>}
      </LabelledValue>
    </Panel.Section>
  );
}
