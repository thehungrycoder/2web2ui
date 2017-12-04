import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { Loading, TableCollection } from 'src/components';

import { formatSubaccountDisplay } from '../helpers';

const columns = [
  { label: 'Recipient', width: '30%' },
  { label: 'Type', width: '18%' },
  { label: 'Source', width: '20%' },
  { label: 'Subaccount' },
  { label: '', width: '10%' }
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

  getRowData = (row) => {
    const { recipient, type, source, subaccount_id: subaccountId } = row;
    const { allSubaccounts = []} = this.props;
    return [recipient,
      type === 'transactional' ? 'Transactional' : 'Non-transactional',
      source,
      formatSubaccountDisplay(subaccountId, allSubaccounts),
      <div style={{ textAlign: 'right' }}>
        <Button to={`/lists/suppressions/details/${recipient}`} size='small'>View Details</Button>
      </div>
    ];
  };


  renderResults() {
    const { results } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={results}
        getRowData={this.getRowData}
        pagination
      />
    );
  }

  render() {
    const { results = [], loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return results.length ? this.renderResults() : this.renderPlaceholder();
  }
}

export default connect(null, {})(Results);
