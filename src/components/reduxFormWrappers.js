import React from 'react';
import { TextField, Select, Radio } from '@sparkpost/matchbox';

import SubaccountTypeahead from './subaccountTypeahead/SubaccountTypeahead';

/*
 Wrapped matchbox components for use with react-redux Field components
*/

export const TextFieldWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <TextField
      id={input.name}
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
};

export const SelectWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <Select
      id={input.name}
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
};

export const RadioGroup = ({ input, options, title }) => (
  <Radio.Group>
    {title}
    {options.map((o) => (
      <Radio
        key={o.label}
        {...input}
        id={o.label}
        label={o.label}
        value={o.value}
        checked={o.value === input.value}
      />
    ))}
  </Radio.Group>
);

/**
 * @example
 * // This plugs into a redux-form Field like so:
 * <Field
 *   name="subaccount"
 *   component={SubaccountTypeaheadWrapper}
 *   subaccounts={subaccountsFromReduxStore}
 * />
 */
export const SubaccountTypeaheadWrapper = ({ input, subaccounts }) => (
  <SubaccountTypeahead
    name={input.name}
    onChange={input.onChange}
    selectedItem={input.value}
    subaccounts={subaccounts}
  />
);
