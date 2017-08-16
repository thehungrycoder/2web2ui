import React from 'react';
import { Table } from '@sparkpost/matchbox';

const List = () => (
  <Table>
    <tbody>
      <Table.Row rowData={[1, 2, 3]}/>
    </tbody>
  </Table>
);

export default List;
