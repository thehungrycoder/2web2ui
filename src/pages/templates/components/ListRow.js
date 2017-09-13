import React from 'react';
import { Table } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';

export default function({ published, id, name, last_update_time }) {
  const status = published ? 'published' : 'draft';
  const nameLink = <Link to={`/templates/edit/${id}`}>{name}</Link>;
  return (
    <Table.Row key={id} rowData={[nameLink, id, status, Date(last_update_time)]} />
  );
}
