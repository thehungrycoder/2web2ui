import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

import { TextFieldWrapper, RadioGroup, SelectWrapper } from 'src/components';
import { required, minNumber, maxNumber } from 'src/helpers/validation';

const MAX_IPS = 4;
const radioOptions = [
  { label: 'Assign to a new IP Pool', value: 'new' },
  { label: 'Assign to an existing IP Pool', value: 'existing' }
];

/**
 * This component will register the following redux-form fields
 * dedicatedIps.quantity
 * dedicatedIps.whichPool
 * dedicatedIps.poolName
 */
const PaymentForm = ({ whichPool, ipPools, ips }) => {
  const max = MAX_IPS; // TODO calculate max
  let poolMarkup = null;

  // Render radio only when account has IP Pools
  const radioMarkup = ipPools.length
    ? <Field
        label='Assign to a new IP Pool'
        name='dedicatedIps.whichPool'
        component={RadioGroup}
        options={radioOptions}
      />
    : null;

  // Render ip pool select
  if (ipPools.length && whichPool === 'existing') {
    poolMarkup = (
      <Field
          label='Choose an IP Pool'
          name='dedicatedIps.poolName'
          component={SelectWrapper}
          validate={required}
          options={ipPools}
        />
    );
  }

  // Render ip pool create
  if (ipPools.length && whichPool === 'new') {
    poolMarkup = (
      <Field
        label='Name your new IP Pool to assign this IP to'
        name='dedicatedIps.poolName'
        component={TextFieldWrapper}
        validate={required}
      />
    );
  }

  return (
    <div>
      <Field
        label='Quantity'
        name='dedicatedIps.quantity'
        type='number'
        component={TextFieldWrapper}
        min='1' max={max}
        validate={[required, minNumber(1), maxNumber(max)]}
      />
      { radioMarkup }
      { poolMarkup }
    </div>
  );
};

PaymentForm.propTypes = {
  formName: PropTypes.string.isRequired
};

// Get whichPool value from state
const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  return {
    whichPool: selector(state, 'dedicatedIps.whichPool')
  };
};
export default connect(mapStateToProps, null)(PaymentForm);
