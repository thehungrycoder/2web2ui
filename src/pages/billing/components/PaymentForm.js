import React from 'react';
import { Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'components';
import { required } from 'helpers/validation';

import styles from './Forms.module.scss';
/**
 * This component will register the following redux-form fields
 * card.number
 * card.type (hidden)
 * card.name
 * card.expMonth (hidden)
 * card.expYear (hidden)
 * card.expCombined
 * card.securityCode
 */
const PaymentForm = () => (
  <div>
    <p><small>Credit Card</small></p>
    <Field
      label='Credit Card Number'
      name='card.number'
      component={TextFieldWrapper}
      validate={required}
    />
    <Field
      label='Cardholder Name'
      name='card.name'
      component={TextFieldWrapper}
      validate={required}
    />
    <Grid>
      <Grid.Column xs={6}>
        <Field
          label='Expiration Date'
          name='card.expCombined'
          placeholder='MM/YYYY'
          component={TextFieldWrapper}
          validate={required}
          // onChange={} maybe use redux-form's `change` to change the hidden exp fields
        />
      </Grid.Column>
      <Grid.Column xs={6}>
        <Field
          label='Security Code'
          name='card.securityCode'
          placeholder='CVV/CVC'
          component={TextFieldWrapper}
          validate={required}
        />
      </Grid.Column>
    </Grid>

    {/* Hidden redux-form connected fields */}
    <div className={styles.hidden}>
      <Field name='card.type' component='input' />
      <Field name='card.expMonth' component='input' />
      <Field name='card.expYear' component='input' />
    </div>
  </div>
);

export default PaymentForm;
