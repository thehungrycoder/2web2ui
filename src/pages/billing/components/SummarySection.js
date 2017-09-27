import React from 'react';
import styles from './SummarySection.module.scss';

const PlanSummary = ({ plan }) => {
  let content = '';

  if (plan) {
    const monthly = plan.monthly
      ? <span>for <strong>${ plan.monthly.toLocaleString() }</strong>/mo</span>
      : null;

    const overage = plan.overage
      ? <div><small>${ plan.overage.toFixed(2) }/thousand extra emails</small></div>
      : null;

    const volume = plan.volume
      ? <span><strong>{ plan.volume.toLocaleString() }</strong> emails per month</span>
      : null;

    content = (
      <div>
        <div>{ volume } { monthly }</div>
        { overage }
      </div>
    );
  }
  return <SummarySection label='Your Plan'>{ content }</SummarySection>;
};

const SummarySection = ({ label, children }) => (
  <div>
    { label && <small className={styles.Label}>{ label }</small> }
    <div className={styles.Content}>
      { children }
    </div>
  </div>
);

export {
  SummarySection,
  PlanSummary
};
