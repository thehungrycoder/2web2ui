import React from 'react';
import { Panel, Table } from '@sparkpost/matchbox';
import Collection from './Collection';

const TableWrapper = (props) => <Panel><Table>{props.children}</Table></Panel>;

const TableHeader = ({ columns = []}) => (
  <thead>
    <Table.Row>
      {columns.map((title) => <Table.HeaderCell key={title}>{title}</Table.HeaderCell>)}
    </Table.Row>
  </thead>
);

const TableBody = (props) => <tbody>{props.children}</tbody>;

const TableCollection = (props) => {
  const { headerComponent, columns, getRowData } = props;
  const TableRow = (props) => <Table.Row rowData={getRowData(props)} />;

  return (
    <Collection
      outerWrapper={TableWrapper}
      headerComponent={headerComponent || <TableHeader columns={columns} />}
      bodyWrapper={TableBody}
      rowComponent={TableRow}
      {...props}
    />
  );
};

export default TableCollection;
