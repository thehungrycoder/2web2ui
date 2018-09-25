import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { getBatches } from 'src/actions/webhooks';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

import { Button, Tag } from '@sparkpost/matchbox';
import { TableCollection, Empty } from 'src/components';
import { selectWebhookBatches } from 'src/selectors/webhooks';

const columns = [
  { label: 'Timestamp' },
  { label: 'Batch ID' },
  { label: 'Status' },
  { label: 'Attempts' },
  null
];

export class BatchTab extends Component {
  componentDidMount() {
    this.refreshBatches();
  }

  refreshBatches = () => {
    const { webhook, getBatches } = this.props;
    const { id, subaccount } = webhook;
    return getBatches({ id, subaccount });
  };

  getRowData = (batch) => {
    const { webhook, query } = this.props;

    return [
      batch.formatted_time,
      batch.batch_id,
      <Tag color={batch.status === 'Success' ? 'blue' : 'yellow'}>{batch.response_code}</Tag>,
      batch.attempts,
      <div style={{ textAlign: 'right' }}>
        <Button component={Link} size='small' to={`/webhooks/details/${webhook.id}/batches/${batch.batch_id}${query}`}>View Details</Button>
      </div>
    ];
  };

  render() {
    const { batches, batchesLoading } = this.props;

    if (batchesLoading) {
      return <PanelLoading />;
    }

    if (_.isEmpty(batches)) {
      return <Empty message='There are no batches for your webhook' />;
    }

    return (
      <TableCollection
        columns={columns}
        rows={batches}
        getRowData={this.getRowData}
        pagination={true}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  batches: selectWebhookBatches(state),
  batchesLoading: state.webhooks.batchesLoading
});

export default connect(mapStateToProps, { getBatches })(BatchTab);
