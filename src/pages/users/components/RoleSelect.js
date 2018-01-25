import React from 'react';
import { Select } from '@sparkpost/matchbox';
import _ from 'lodash';

const DEFAULT_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Reporting', value: 'reporting' }
];

/**
 * Dropdown to select a users access/role
 *
 * @param {boolean} disabled
 * @param {string} name
 * @param {Function} onChange - event handler passes new
 * @param {null, string} value
 * @param {Object} input - redux-form <Field /> props
 */
export default function RoleSelect({
  disabled = false,
  name = null,
  onChange = _.noop,
  value = null,
  input = {},
  allowSuperUser = false,
  selectOptions = [ ...DEFAULT_OPTIONS ],
  ...rest
}) {

  if (allowSuperUser) {
    selectOptions.push({ label: 'Super User', value: 'superuser' });
  }

  // Only return text instead of select box
  // TODO: won't need the span tags with v16
  if (disabled) {
    const label = selectOptions.find((option) => option.value === value).label;
    return <span>{label}</span>;
  }

  const handleChange = ({ target }) => onChange(target);

  return (
    <Select
      name={name}
      onChange={handleChange}
      options={selectOptions}
      value={value}
      {...input}
      {...rest}
    />
  );
}
