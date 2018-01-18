import React, { Component } from 'react';
import { Panel, Table } from '@sparkpost/matchbox';
import Collection from './Collection';
import TableHeader from './TableHeader';
import { getSortedCollection } from 'src/helpers/sort';

const TableWrapper = (props) => <Panel><Table>{props.children}</Table></Panel>;

const TableBody = (props) => <tbody>{props.children}</tbody>;

class TableCollection extends Component {
  state = {
    sortColumn: null,
    sortDirection: null
  }

  static defaultProps = {
    defaultSortColumn: null,
    defaultSortDirection: 'asc'
  }

  componentDidMount() {
    const { defaultSortColumn, defaultSortDirection } = this.props;
    this.setState({ sortColumn: defaultSortColumn , sortDirection: defaultSortDirection });
  }

  handleSortChange = (column, direction) => {
    this.setState({ sortColumn: column, sortDirection: direction });
  }

  render() {
    const { rowComponent, headerComponent, columns, getRowData, rows } = this.props;
    const { sortColumn, sortDirection } = this.state;

    const HeaderComponent = headerComponent ? headerComponent : () => <TableHeader columns={columns} onSort={this.handleSortChange} sortColumn={sortColumn} sortDirection={sortDirection}/>;
    const TableRow = rowComponent
      ? rowComponent
      : (props) => <Table.Row rowData={getRowData(props)} />;

    return (
      <Collection
        outerWrapper={TableWrapper}
        headerComponent={HeaderComponent}
        bodyWrapper={TableBody}
        rowComponent={TableRow}
        { ...this.props}
        rows={getSortedCollection(rows, sortColumn, sortDirection)}
      />
    );
  }
}

export default TableCollection;
