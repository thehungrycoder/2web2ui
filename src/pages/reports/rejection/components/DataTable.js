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
    const { addFilters } = this.props;
    const { reason, domain, rejection_category_name, count_rejected } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => addFilters([{ type: 'Recipient Domain', value: domain }])}>{ domain }</UnstyledLink>,
      rejection_category_name,
      count_rejected
    ];
  };

  render() {
    const { list } = this.props;

    if (!list.length) {
      return <Empty message={'No rejection reasons to report'} />;
    }

    return <TableCollection
      columns={columns}
      rows={list}
      getRowData={this.getRowData}
      pagination
      defaultSortColumn='reason'
      defaultSortDirection='desc'
      saveCsv
    />;
  }
}

export default DataTable;
