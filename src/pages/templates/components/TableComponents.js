import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Table } from '@sparkpost/matchbox';

export const getRowData = ({ published, id, name, last_update_time, subaccount_id, shared_with_subaccounts }) => [
  <Link to={`/templates/edit/${id}`}>{name}</Link>,
  id,
  published ? 'Published' : 'Draft',
  format(last_update_time, 'MMM D, YYYY [at] h:mma'),
  shared_with_subaccounts ? 'All' : subaccount_id
];

const columns = [
  { label: 'Name', width: '25%' },
  { label: 'ID', width: '20%' },
  { label: 'Published', width: '15%' },
  { label: 'Updated', width: '' },
  { label: 'Subaccount', width: '15%' }
];

export const TableHeader = () => (
  <thead>
    <Table.Row>
      {columns.map(({ label, ...rest }) => <Table.HeaderCell key={label} {...rest}>{label}</Table.HeaderCell>)}
    </Table.Row>
  </thead>
);
