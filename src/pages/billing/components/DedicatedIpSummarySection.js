import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';

import config from 'src/config';
import { LabelledValue } from 'src/components';
import DedicatedIpCost from './DedicatedIpCost';

function noop() {}

export default function DedicatedIpSummarySection({ count = 0, plan = {}, onClick = noop, isAWSAccount }) {
  const hasReachedMax = count >= config.sendingIps.maxPerAccount;
  const disabledPurchaseIP = hasReachedMax || plan.isFree;

  // There are some paid accounts that do not allow dedicated IPs
  const addOrUpgradeAction = plan.canPurchaseIps
    ? {
      content: 'Add Dedicated IPs',
      disabled: disabledPurchaseIP ,
      onClick,
      color: 'orange'
    }
    : {
      content: 'Upgrade Now',
      to: '/account/billing/plan',
      Component: Link,
      color: 'orange'
    };

  const manageIpAction = {
    content: 'Manage Your IPs',
    to: '/account/ip-pools',
    disabled: count <= 0,
    Component: Link,
    color: 'orange'
  };

  // Decrement count if plan includes one free IP
  const billableCount = count > 0 && plan.includesIp ? count - 1 : count;

  const summary = count === 0
    ? <h6>0</h6>
    : <h6>{count} for <DedicatedIpCost quantity={billableCount} isAWSAccount={isAWSAccount}/></h6>;

  return (
    <Panel.Section actions={[manageIpAction, addOrUpgradeAction]}>
      <LabelledValue label='Dedicated IPs'>
        {summary}
        {hasReachedMax && <p>You have reached the maximum allowed.</p>}
      </LabelledValue>
    </Panel.Section>
  );
}
