import React from 'react';
import { Panel, Table } from '@sparkpost/matchbox';
import Collection from './Collection';
import TableHeader from './TableHeader';

const TableWrapper = (props) => <Panel><Table>{props.children}</Table></Panel>;


const TableBody = (props) => <tbody>{props.children}</tbody>;

const TableCollection = (props) => {
  const { rowComponent, headerComponent, columns, getRowData, onSort, sortColumn, sortDirection } = props;
  const HeaderComponent = headerComponent ? headerComponent : () => <TableHeader columns={columns} onSort={onSort} sortColumn={sortColumn} sortDirection={sortDirection}/>;
  const TableRow = rowComponent
    ? rowComponent
    : (props) => <Table.Row rowData={getRowData(props)} />;

  return (
    <Collection
      outerWrapper={TableWrapper}
      headerComponent={HeaderComponent}
      bodyWrapper={TableBody}
      rowComponent={TableRow}
      {...props}
    />
  );
};

export default TableCollection;
