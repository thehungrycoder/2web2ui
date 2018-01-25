import React from 'react';
import { Table } from '@sparkpost/matchbox';

const HeaderCell = (label) => (<Table.HeaderCell>
  {label}
</Table.HeaderCell>);

const DataCell = (data) => (
  <Table.Cell>
    {data}
  </Table.Cell>
);

const Row = (row) => (<Table.Row>
  {row.map(DataCell)}
</Table.Row>);

export default ({ header = [], rows = []}) => (
  <Table>
    <tbody>
      <Table.Row>
        {header.map(HeaderCell)}
      </Table.Row>
      {rows.map(Row)}
    </tbody>
  </Table>
);
