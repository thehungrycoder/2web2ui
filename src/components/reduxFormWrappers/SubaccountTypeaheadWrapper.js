import React from 'react';
import SubaccountTypeahead from '../typeahead/SubaccountTypeahead';

/**
 * @example
 * // This plugs into a redux-form Field like so:
 * <Field
 *   name="subaccount"
 *   component={SubaccountTypeaheadWrapper}
 *   subaccounts={subaccountsFromReduxStore}
 * />
 */
export default function SubaccountTypeaheadWrapper({ input, meta, ...rest }) {
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
}
