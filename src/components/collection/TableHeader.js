import React, { Component } from 'react';
import { Table } from '@sparkpost/matchbox';
import SortLabel from './SortLabel';

export default class TableHeader extends Component {
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
    const { sortColumn, sortDirection } = this.props;

    if (sortKey) {
      return (
        <SortLabel
          onClick={() => this.handleSorting(sortKey)}
          direction={sortKey === sortColumn && sortDirection}
          label={label} />
      );
    }

    return label;
  }

  render() {
    const { columns } = this.props;

    const cells = columns.map((item, i) => {
      if (typeof item === 'string' || item === null) {
        return <Table.HeaderCell key={`column ${i}: ${item}`}>{item}</Table.HeaderCell>;
      }
      const { label, sortKey, ...rest } = item;

      return <Table.HeaderCell key={label} {...rest}>{ this.renderSortCell(item) }</Table.HeaderCell>;
    });

    return (
      <thead>
        <Table.Row>{ cells }</Table.Row>
      </thead>
    );
  }
}
