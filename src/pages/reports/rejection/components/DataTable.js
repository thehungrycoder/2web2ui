import React, { Component } from 'react';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { UnstyledLink } from '@sparkpost/matchbox';

const columns = [
  { label: 'Reason', width: '45%', sortKey: 'reason' },
  { label: 'Domain', sortKey: 'domain' },
  { label: 'Category', sortKey: 'rejection_category_name' },
  { label: 'Count', sortKey: 'count_rejected' }
];

export class DataTable extends Component {
  getRowData = (rowData) => {
    const { onDomainClick } = this.props;
    const { reason, domain, rejection_category_name,count_rejected } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => onDomainClick(domain)}>{ domain }</UnstyledLink>,
      rejection_category_name,
      count_rejected
    ];
  };

  render() {
    const { list } = this.props;

    if (!list.length) {
      return <Empty message={'There are no rejection messages for your current query'} />;
    }

    return <TableCollection
      columns={columns}
      rows={list}
      getRowData={this.getRowData}
      pagination={true}
      defaultSortColumn='reason'
      defaultSortDirection='desc'
    />;
  }
}

export default DataTable;
