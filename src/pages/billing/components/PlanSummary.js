import React from 'react';
import { LabelledValue } from 'src/components';

const PlanSummary = ({
  plan: {
    period,
    plan_volume: planVolume,
    plan_volume_per_period: planVolumePerPeriod,
    overage,
    recurring_charge: recurringCharge
  }
}) => {
  const cost = recurringCharge === 0
    ? 'Free'
    : `$${recurringCharge.toLocaleString()} per ${period || 'month'}`;
  const volume = (planVolumePerPeriod || planVolume).toLocaleString();

  return (
    <LabelledValue label="Your Plan">
      <h6>
        {volume} emails for {cost}
      </h6>
      {overage && <p>${overage.toFixed(2)} per thousand extra emails</p>}
    </LabelledValue>
  );
};

export default PlanSummary;
