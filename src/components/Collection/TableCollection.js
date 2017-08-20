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
  const { header, columns, getRowData } = props;
  const Header = header ? header : () => <TableHeader columns={columns} />;
  const TableRow = (props) => <Table.Row rowData={getRowData(props)} />;

  return (
    <Collection
      outerWrapper={TableWrapper}
      header={Header}
      bodyWrapper={TableBody}
      rowComponent={TableRow}
      {...props}
    />
  );
};

export default TableCollection;
