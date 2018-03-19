import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import { LabelledValue } from 'src/components';
import DedicatedIpCost from './DedicatedIpCost';

export default function DedicatedIpSummarySection({ count = 0, plan = {}, onClick = _.noop , isAWSAccount }) {
  const hasReachedMax = count >= config.sendingIps.maxPerAccount;
  const ipCtaContent = (count === 0 && plan.includesIp) ? 'Claim Your Free Dedicated IP' : 'Add Dedicated IPs';

  // There are some paid accounts that do not allow dedicated IPs
  const action = plan.canPurchaseIps
    ? { content: ipCtaContent, disabled: hasReachedMax, onClick }
    : { content: 'Upgrade Now', to: '/account/billing/plan', Component: Link };

  // Decrement count if plan includes one free IP
  const billableCount = count > 0 && plan.includesIp ? count - 1 : count;

  const summary = count === 0
    ? <h6>0</h6>
    : <h6>{count} for <DedicatedIpCost quantity={billableCount} isAWSAccount={isAWSAccount}/></h6>;

  return (
    <Panel.Section actions={[action]}>
      <LabelledValue label='Dedicated IPs'>
        {summary}
        {hasReachedMax && <p>You have reached the maximum allowed.</p>}
      </LabelledValue>
    </Panel.Section>
  );
}
