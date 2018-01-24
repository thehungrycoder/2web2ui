import React from 'react';
import { Link } from 'react-router-dom';

export const getRowData = (key) => [
  <Link to={`/account/api-keys/details/${key.id}`}>{key.label}</Link>,
  <code>{key.short_key}••••••••</code>,
  key.subaccount_id
];

export const columns = [
  { label: 'Name', width: '40%', sortKey: 'label' },
  { label: 'Key', width: '20%', sortKey: 'short_key' },
  { label: 'Subaccount', width: '20%', sortKey: 'subaccount_id' }
];

export const filterBoxConfig = {
  show: true,
  keyMap: { name: 'label', key: 'short_key' },
  itemToStringKeys: ['label', 'short_key', 'id'],
  exampleModifiers: ['key', 'name', 'id']
};
