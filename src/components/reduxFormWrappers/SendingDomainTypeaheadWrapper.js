import React from 'react';
import SendingDomainTypeahead from '../subaccountTypeahead/SendingDomainTypeahead';

/**
 * @example
 * // This plugs into a redux-form Field like so:
 * <Field
 *   name="sendingDomain"
 *   component={SendingDomainTypeahead}
 *   results={sendingDomainsFromReduxStore}
 * />
 */
export default function SendingDomainTypeaheadWrapper({ input, meta, ...rest }) {
  const { active, error, touched } = meta;

  return (
    <SendingDomainTypeahead
      name={input.name}
      onChange={input.onChange}
      selectedItem={input.value}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
}
