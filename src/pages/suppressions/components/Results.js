import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { PanelLoading, TableCollection, Empty } from 'src/components';

import { formatSubaccountDisplay } from '../helpers';

export class Results extends Component {
  renderPlaceholder() {
    return (
      <Empty message='Choose some options to see your suppressions' />
    );
  }

  renderEmpty() {
    return (
      <Empty message='There are no results for your current query' />
    );
  }

  getRowData = (row) => {
    const { recipient, type, source, subaccount_id: subaccountId } = row;
    const { subaccounts: allSubaccounts, hasSubaccounts } = this.props;
    const rowData = [recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source
    ];

    if (hasSubaccounts) {
      rowData.push(formatSubaccountDisplay(parseInt(subaccountId, 10), allSubaccounts));
    }

    rowData.push(
      <div style={{ textAlign: 'right' }}>
        <Button size='small'>...</Button> &nbsp;
        <Button destructive size='small'>Delete</Button>
      </div>
    );

    return rowData;
  };

  getColumns() {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Recipient' },
      { label: 'Type', width: '18%' },
      { label: 'Source', width: '20%' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '18%' });
    }

    columns.push({ label: '', width: '15%' });

    return columns;
  }


  renderResults() {
    const { results } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={results}
        getRowData={this.getRowData}
        pagination
      />
    );
  }

  render() {
    const { results = [], loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (results === null) {
      return this.renderPlaceholder();
    }

    return results.length ? this.renderResults() : this.renderEmpty();
  }
}

export default connect(null)(Results);
