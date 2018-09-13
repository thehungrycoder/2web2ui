import React from 'react';
import { RadioGroup } from 'src/components/reduxFormWrappers';

const ROLES = [
  {
    label: <strong>Admin</strong>,
    value: 'admin',
    helpText: 'Has access to all functionality in the UI. Has the ability to add additional administrators and create / invite users with a role of Reporting'
  },
  {
    label: <strong>Reporting</strong>,
    value: 'reporting',
    helpText: 'Has no access to functionality in the UI. Permissions include access to view all reports, and view all templates except being allowed to change them'
  },
  {
    label: <strong>Super User</strong>,
    value: 'superuser'
  }

];

export default function RoleRadioGroup({
  disabled = false,
  allowSuperUser = false,
  ...rest
}) {

  const roles = ROLES.filter((role) => allowSuperUser || role.value !== 'superuser');
  const options = roles.map((role) => ({ ...role, disabled }));

  return (
    <RadioGroup
      title="Role"
      grid={{ xs: 12, sm: 12, md: 6 }}
      options={options}
      {...rest}
    />
  );
}

