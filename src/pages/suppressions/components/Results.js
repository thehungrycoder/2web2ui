import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { Loading, TableCollection } from 'src/components';
import styles from '../Suppressions.module.scss';

import { formatSubaccountDisplay } from '../helpers';



class Results extends Component {
  renderPlaceholder() {
    return (
      <div>
        <h6 className={styles.Center}>Choose some options to see your suppressions</h6>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div>
            <h6 className={styles.Center}>There are no results for your current query</h6>
        </div>
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
        <Button size='small'>...</Button>
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

    columns.push({ label: '', width: '14%' });

    return columns;
  }


  renderResults() {
    const { results } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={results}
        getRowData={this.getRowData.bind(this)}
        pagination
      />
    );
  }

  render() {
    const { results = [], loading } = this.props;

    if (loading) {
      return <div className={styles.Loading}><Loading /></div>;
    }

    if (results === null) {
      return this.renderPlaceholder();
    }

    return results.length ? this.renderResults() : this.renderEmpty();
  }
}

export default connect(null)(Results);
