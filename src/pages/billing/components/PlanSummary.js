import React from 'react';
import styles from './PlanSummary.module.scss';

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
    <React.Fragment>
      <h6 className={styles.Headline}>
        {volume} emails for {cost}
      </h6>
      {overage && <p>${overage.toFixed(2)} per thousand extra emails</p>}
    </React.Fragment>
  );
};

export default PlanSummary;
