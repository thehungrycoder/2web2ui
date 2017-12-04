import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { Loading, TableCollection } from 'src/components';
import styles from '../styles.scss';

import { formatSubaccountDisplay } from '../helpers';

const columns = [
  { label: 'Recipient', width: '30%' },
  { label: 'Type', width: '18%' },
  { label: 'Source', width: '20%' },
  { label: 'Subaccount' },
  { label: '', width: '14%' }
];

class Results extends Component {
  renderPlaceholder() {
    return (
        <div>
            <h3>Query results will be displayed here</h3>
            <p>Choose some options and search to see your suppressions.</p>
        </div>
    );
  }

  renderEmpty() {
    return (
        <div>
            <h3>There are no results for your current query</h3>
        </div>
    );
  }

  getRowData = (row) => {
    const { recipient, type, source, subaccount_id: subaccountId } = row;
    const { subaccounts: allSubaccounts } = this.props;
    return [recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source,
      formatSubaccountDisplay(parseInt(subaccountId, 10), allSubaccounts),
      <div style={{ textAlign: 'right' }}>
        <Button size='small'>...</Button>
        <Button destructive size='small'>Delete</Button>
      </div>
    ];
  };


  renderResults() {
    const { results } = this.props;
    return (
      <TableCollection
        columns={columns}
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
