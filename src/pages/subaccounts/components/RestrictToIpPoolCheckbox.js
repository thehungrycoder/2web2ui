import React from 'react';
import { Field } from 'redux-form';
import CheckboxWrapper from 'src/components/reduxFormWrappers/CheckboxWrapper';

export default function RestrictToIpPoolCheckbox({ disabled }) {
  return (
    <Field
      name="restrictedToIpPool"
      component={CheckboxWrapper}
      type="checkbox"
      disabled={disabled}
      label="Restrict this subaccount's mail deliveries to a single IP pool"
      helpText="If left unchecked, this subaccount may send using any IP pool."
    />
  );
}
