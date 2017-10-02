import React from 'react';
import { Select } from '@sparkpost/matchbox';

const OPTIONS = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Reporting', value: 'reporting' }
];

export default function AccessSelect({ disabled = false, user, ...props }) {
  // Only return text to match the current style
  // TODO: won't need the span tags with v16
  if (disabled) {
    const label = OPTIONS.find(({ value }) => value === user.access).label;
    return <span>{label}</span>;
  }

  // Merge new access value and return updated user object
  const onChange = (event) => {
    props.onChange(user.username, { access_level: event.target.value });
  };

  return (
    <Select
      defaultValue={user.access}
      onChange={onChange}
      options={OPTIONS}
    />
  );
}
