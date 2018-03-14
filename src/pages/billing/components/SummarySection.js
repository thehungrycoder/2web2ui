import React from 'react';
import { Icon } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import PlanPrice from 'src/components/billing/PlanPrice';

const PlanSummary = ({ plan }) => {

  if (!plan) {
    return <LabelledValue label='Your Plan' />;
  }

  const overage = plan.overage
    ? <p>${ plan.overage.toFixed(2) }/thousand extra emails</p>
    : null;

  return (
    <LabelledValue label='Your Plan'>
      <h6><PlanPrice plan={plan} /></h6>
      { overage }
    </LabelledValue>
  );
};

const CardSummary = ({ billing, label }) => (
  <LabelledValue label={label}>
    <h6>
      <strong><Icon name='CreditCard' size={16}/> { billing.credit_card.type } ···· { billing.credit_card.number.substr(billing.credit_card.number.length - 4) }</strong>
    </h6>
    <p>Expires { billing.credit_card.expiration_month }/{ billing.credit_card.expiration_year }</p>
  </LabelledValue>
);

export {
  CardSummary,
  PlanSummary
};
