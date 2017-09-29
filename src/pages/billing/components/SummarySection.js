import React from 'react';
import styles from './SummarySection.module.scss';
import { Icon } from '@sparkpost/matchbox';

const PlanSummary = ({ plan }) => {
  let content = '';

  if (plan) {
    const monthly = plan.monthly
      ? <span>for <strong>${ plan.monthly.toLocaleString() }</strong>/mo</span>
      : null;

    const overage = plan.overage
      ? <p><small>${ plan.overage.toFixed(2) }/thousand extra emails</small></p>
      : null;

    const volume = plan.volume
      ? <span><strong>{ plan.volume.toLocaleString() }</strong> emails per month</span>
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

const CardSummary = ({ billing }) => (
  <SummarySection>
    <h6>
      <strong><Icon name='CreditCard' size={16}/> { billing.credit_card.type } ···· { billing.credit_card.number.substr(billing.credit_card.number.length - 4) }</strong>
    </h6>
    <h6><strong>{ billing.first_name } { billing.last_name }</strong></h6>
    <p><small>Expires { billing.credit_card.expiration_month }/{ billing.credit_card.expiration_year }</small></p>
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
