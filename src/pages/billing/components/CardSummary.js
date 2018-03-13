import React from 'react';
import { Icon } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';

const CardSummary = ({ billing, label }) => (
  <LabelledValue label={label}>
    <h6>
      <strong><Icon name='CreditCard' size={16}/> { billing.credit_card.type } ···· { billing.credit_card.number.substr(billing.credit_card.number.length - 4) }</strong>
    </h6>
    <p>Expires { billing.credit_card.expiration_month }/{ billing.credit_card.expiration_year }</p>
  </LabelledValue>
);

export default CardSummary;
