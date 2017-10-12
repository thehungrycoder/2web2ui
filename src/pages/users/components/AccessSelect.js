import React from 'react';
import { Select } from '@sparkpost/matchbox';
import fp from 'lodash/fp';

const OPTIONS = [
  { label: 'Administrator', value: 'admin' },
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
export default function AccessSelect({
  disabled = false, name = null, onChange = fp.noop, value = null, input = {}
}) {
  // Only return text to match the current style
  // TODO: won't need the span tags with v16
  if (disabled) {
    const label = OPTIONS.find((option) => option.value === value).label;
    return <span>{label}</span>;
  }

  // Merge new access value and return updated user object
  const handleChange = (event) => {
    onChange(fp.pick(['name', 'value'])(event.target));
  };

  return (
    <Select
      name={name}
      onChange={handleChange}
      options={OPTIONS}
      value={value}
      {...input}
    />
  );
}
