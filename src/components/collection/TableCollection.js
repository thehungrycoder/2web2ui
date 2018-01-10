import React, { Component } from 'react';
import { Panel, Table, UnstyledLink, Icon } from '@sparkpost/matchbox';
import Collection from './Collection';

const TableWrapper = (props) => <Panel><Table>{props.children}</Table></Panel>;

class TableHeader extends Component {
  handleSorting = (column) => {
    const { sortColumn, sortDirection } = this.props;
    let direction;

    if (column === sortColumn) { // change direction as same column is clicked again
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'asc';
    }

    this.props.onSort(column, direction);
  }

  renderSortCell = (item) => {
    const { label, sortKey } = item;
    const { sortColumn, sortDirection = 'asc' } = this.props;

    const icon = sortDirection === 'asc' ? <Icon name='CaretUp'/> : <Icon name='CaretDown'/>;
    const formattedLabel = sortKey === sortColumn ? <span> { label }{ icon } </span> : label;

    if (sortKey) {
      return <UnstyledLink onClick={() => this.handleSorting(sortKey)}>{ formattedLabel }</UnstyledLink>;
    } else {
      return label;
    }
  }

  render() {
    const { columns } = this.props;

    const cells = columns.map((item, i) => {
      if (typeof item === 'string' || item === null) {
        return <Table.HeaderCell key={`column ${i}: ${item}`}>{item}</Table.HeaderCell>;
      }
      const { label, sortKey, ...rest } = item;

      return (<Table.HeaderCell key={label} {...rest}>{ this.renderSortCell(item) }</Table.HeaderCell>);
    });

    return (
      <thead>
        <Table.Row>{ cells }</Table.Row>
      </thead>
    );
  }
}

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
