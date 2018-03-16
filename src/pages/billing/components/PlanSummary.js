import React from 'react';
import { LabelledValue } from 'src/components';

const PlanSummary = ({ plan }) => {
  let monthly = '';

  if (!plan) {
    return <LabelledValue label='Your Plan' />;
  }

  if (plan.monthly !== undefined) {
    monthly = plan.monthly === 0
      ? 'for Free'
      : <span><strong>for ${plan.monthly.toLocaleString()}</strong> per month</span>;
  }

  const overage = plan.overage
    ? <p>${plan.overage.toFixed(2)}/thousand extra emails</p>
    : null;

  const volume = plan.volume
    ? <span><strong>{plan.volume.toLocaleString()}</strong> emails</span>
    : null;

  return (
    <LabelledValue label='Your Plan'>
      <h6>{ volume } { monthly }</h6>
      { overage }
    </LabelledValue>
  );
};

export default PlanSummary;
