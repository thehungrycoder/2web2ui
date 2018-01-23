import React, { Component } from 'react';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Percent } from 'src/components/formatters';

const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Delayed', 'Delayed First Attempt (%)'];

export class DelaysDataTable extends Component {
  getRowData = (rowData) => {
    const { totalAccepted, onDomainClick } = this.props;
    const { reason, domain, count_delayed, count_delayed_first } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => onDomainClick(domain)}>{domain}</UnstyledLink>,
      count_delayed,
      <span>{count_delayed_first} (<Percent value={(count_delayed_first / totalAccepted) * 100} />)</span>
    ];
  }

  render() {
    const { rows } = this.props;

    if (!rows) {
      return <Empty title={'Delayed Messages'} message={'No delay reasons to report'} />;
    }

    return <TableCollection
      columns={columns}
      rows={rows}
      getRowData={this.getRowData}
      pagination={true}
    />;
  }
}

export default DelaysDataTable;
