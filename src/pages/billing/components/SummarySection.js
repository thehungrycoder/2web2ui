import React from 'react';
import styles from './SummarySection.module.scss';
import { Icon } from '@sparkpost/matchbox';

const PlanSummary = ({ plan }) => {
  let content = '';
  let monthly = '';

  if (plan) {
    if (plan.monthly !== undefined) {
      monthly = plan.monthly === 0
          ? 'for Free'
          : <span><strong>for ${plan.monthly.toLocaleString()}</strong> per month</span>;
    }

    const overage = plan.overage
      ? <p>${ plan.overage.toFixed(2) }/thousand extra emails</p>
      : null;

    const volume = plan.volume
      ? <span><strong>{ plan.volume.toLocaleString() }</strong> emails</span>
      : null;

    content = (
      <div>
        <h6>{ volume } { monthly }</h6>
        { overage }
      </div>
    );
  }
  return <SummarySection label='Your Plan'>{ content }</SummarySection>;
};

const CardSummary = ({ billing, label }) => (
  <SummarySection label={label}>
    <h6>
      <strong><Icon name='CreditCard' size={16}/> { billing.credit_card.type } ···· { billing.credit_card.number.substr(billing.credit_card.number.length - 4) }</strong>
    </h6>
    <p>Expires { billing.credit_card.expiration_month }/{ billing.credit_card.expiration_year }</p>
  </SummarySection>
);

const SummarySection = ({ label, children }) => (
  <div>
    { label && <small className={styles.Label}>{ label }</small> }
    <div className={styles.Content}>
      { children }
    </div>
  </div>
);

export {
  CardSummary,
  PlanSummary,
  SummarySection
};
