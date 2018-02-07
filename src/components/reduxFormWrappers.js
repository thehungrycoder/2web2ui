import React from 'react';
import { Checkbox, TextField, Select, Radio } from '@sparkpost/matchbox';

import SubaccountTypeahead from './subaccountTypeahead/SubaccountTypeahead';
import PoolTypeahead from './ipPoolTypeahead/PoolTypeahead';

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
        checked={o.value === input.value}
        disabled={!!o.disabled}
        value={o.value}
      />
    ))}
  </Radio.Group>
);

export const CheckboxWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <Checkbox
      id={input.name}
      {...input}
      checked={input.value}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
};

/**
 * @example
 * // This plugs into a redux-form Field like so:
 * <Field
 *   name="subaccount"
 *   component={SubaccountTypeaheadWrapper}
 *   subaccounts={subaccountsFromReduxStore}
 * />
 */
export const SubaccountTypeaheadWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <SubaccountTypeahead
      name={input.name}
      onChange={input.onChange}
      selectedItem={input.value}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
};


export const PoolTypeaheadWrapper = ({ input, pools }) => (
  <PoolTypeahead
    name={input.name}
    onChange={input.onChange}
    selectedItem={input.value}
    pools={pools}
  />
);
