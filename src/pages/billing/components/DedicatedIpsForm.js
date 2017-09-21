import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

import { TextFieldWrapper, RadioGroup, SelectWrapper } from 'components';
import { required, minNumber, maxNumber } from 'helpers/validation';

/**
 * This component will register the following redux-form fields
 * dedicatedIps.quantity
 * dedicatedIps.whichPool
 * dedicatedIps.poolName
 */

// TODO pass through IP Pools list as a prop, add to select options
const radioOptions = [
  { label: 'Assign to a new IP Pool', value: 'new' },
  { label: 'Assign to an existing IP Pool', value: 'existing' }
];

const PaymentForm = ({ whichPool }) => (
  <div>
    <Field
      label='Quantity'
      name='dedicatedIps.quantity'
      type='number'
      component={TextFieldWrapper}
      min='1' max='4' // TODO set max
      validate={[required, minNumber(1), maxNumber(4)]}
    />

    <Field
      label='Assign to a new IP Pool'
      name='dedicatedIps.whichPool'
      component={RadioGroup}
      options={radioOptions}
    />

    { whichPool === 'new' &&
      <Field
        label='Name your new IP Pool'
        name='dedicatedIps.poolName'
        component={TextFieldWrapper}
        validate={required}
      />
    }

    { whichPool === 'existing' &&
      <Field
        label='Choose an IP Pool'
        name='dedicatedIps.poolName'
        component={SelectWrapper}
        validate={required}
        options={[ { label: 'test', value: 'test' }]} // TODO
      />
    }
  </div>
);

PaymentForm.propTypes = {
  // TODO IP Pool List array/shape
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
