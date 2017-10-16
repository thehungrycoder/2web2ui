import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@sparkpost/matchbox';

export const getRowData = (key) => [
  <Link to={`/account/api-keys/details/${key.id}`}>{key.label}</Link>,
  <code>{key.short_key}••••••••</code>,
  key.subaccount_id
];

const columns = [
  { label: 'Name', width: '40%' },
  { label: 'Key', width: '20%' },
  { label: 'Subaccount', width: '20%' }
];

export const TableHeader = () => (
  <thead>
    <Table.Row>
      {columns.map(({ label, ...rest }) => <Table.HeaderCell key={label} {...rest}>{label}</Table.HeaderCell>)}
    </Table.Row>
  </thead>
);
