import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getBatches } from '../../../actions/webhooks';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

import { Button, Panel } from '@sparkpost/matchbox';
import { TableCollection, Empty } from 'src/components';
import { selectWebhookBatches } from 'src/selectors/webhooks';

const columns = [
  { label: 'Delivery Time', sortKey: 'formatted_time' },
  { label: 'Batch ID', sortKey: 'batch_id' },
  { label: 'Status', sortKey: 'status' },
  { label: 'Attempt #', sortKey: 'attempts' },
  { label: 'Response', sortKey: 'response_code' }
];

const getRowData = (batch) => [batch.formatted_time, batch.batch_id, batch.status, batch.attempts, batch.response_code];

class BatchTab extends Component {
  state = {
    refreshing: false
  };

  componentDidMount() {
    this.props.getBatches(this.props.id);
  }

  refreshBatches = () => {
    const { id } = this.props;

    this.props.getBatches(id);
    this.setState({ refreshing: true });
  };

  renderBatches() {
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
        getRowData={getRowData}
        pagination={true}
        defaultSortColumn='formatted_time'
        defaultSortDirection='desc'
      />
    );
  }

  render() {
    const { batchesLoading } = this.props;
    const { refreshing } = this.state;

    const buttonText = (refreshing && batchesLoading) ? 'Refreshing...' : 'Refresh Batches';

    return (
      <Panel sectioned>
        <Panel.Section>
          <div>
            <Button primary disabled={batchesLoading} onClick={this.refreshBatches}>
              {buttonText}
            </Button>
            <br/>
            <br/>
          </div>
          { this.renderBatches() }
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  batches: selectWebhookBatches(state),
  batchesLoading: state.webhooks.batchesLoading
});

export default connect(mapStateToProps, { getBatches })(BatchTab);
