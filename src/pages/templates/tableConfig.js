import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const getRowData = ({ published, id, name, last_update_time, subaccount_id, shared_with_subaccounts }) => [
  <Link to={`/templates/edit/${id}`}>{name}</Link>,
  id,
  published ? 'Published' : 'Draft',
  format(last_update_time, 'MMM D, YYYY [at] h:mma'),
  shared_with_subaccounts ? 'All' : subaccount_id
];

export const columns = [
  { label: 'Name', width: '25%' },
  { label: 'ID', width: '25%' },
  { label: 'Status', width: '15%' },
  { label: 'Updated' },
  { label: 'Subaccount', width: '15%' }
];

export const filterBoxConfig = {
  show: true,
  exampleModifiers: ['id', 'name'],
  compareKeys: ['name', 'id', 'subaccount_id']
};
