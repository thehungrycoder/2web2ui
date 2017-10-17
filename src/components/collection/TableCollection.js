import React from 'react';
import { Panel, Table } from '@sparkpost/matchbox';
import Collection from './Collection';

const TableWrapper = (props) => <Panel><Table>{props.children}</Table></Panel>;

const TableHeader = ({ columns = []}) => {
  const cells = columns.map((item) => {
    if (typeof item === 'string') {
      return <Table.HeaderCell key={item}>{item}</Table.HeaderCell>;
    }
    const { label, ...rest } = item;
    return <Table.HeaderCell key={label} {...rest}>{label}</Table.HeaderCell>;
  });

  return (
    <thead>
      <Table.Row>{ cells }</Table.Row>
    </thead>
  );
};

const TableBody = (props) => <tbody>{props.children}</tbody>;

const TableCollection = (props) => {
  const { headerComponent, columns, getRowData } = props;
  const HeaderComponent = headerComponent ? headerComponent : () => <TableHeader columns={columns} />;
  const TableRow = (props) => <Table.Row rowData={getRowData(props)} />;

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
