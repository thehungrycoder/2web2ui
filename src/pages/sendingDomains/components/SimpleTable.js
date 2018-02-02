import React from 'react';
import { Table } from '@sparkpost/matchbox';

const HeaderCell = (label, idx) => (<Table.HeaderCell key={idx}>
  {label}
</Table.HeaderCell>);

const DataCell = (data, idx) => (
  <Table.Cell key={idx}>
    {data}
  </Table.Cell>
);

const Row = (row, idx) => (<Table.Row style={{ verticalAlign: 'top' }} key={idx}>
  {row.map(DataCell)}
</Table.Row>);

export default ({ header, rows }) => (
  <Table>
    <tbody>
      <Table.Row key='header'>
        {header.map(HeaderCell)}
      </Table.Row>
      {rows.map(Row)}
    </tbody>
  </Table>
);
