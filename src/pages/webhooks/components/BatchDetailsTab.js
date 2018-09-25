import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getBatches } from 'src/actions/webhooks';
import { selectWebhookBatches } from 'src/selectors/webhooks';
import { Panel, Tag, Tooltip, Table } from '@sparkpost/matchbox';
import { ArrowBack, InfoOutline } from '@sparkpost/matchbox-icons';
import { LabelledValue, PageLink } from 'src/components';
import _ from 'lodash';
import styles from './BatchDetailsTab.module.scss';

class BatchDetailsTab extends Component {
  componentDidMount() {
    this.getAttempts();
  }

  getAttempts = () => {
    const { webhook, getBatches, match } = this.props;
    const { id, subaccount } = webhook;
    return getBatches({ id, subaccount, params: { batch_ids: match.params.batchId }});
  }

  render() {
    const { batches, firstBatch = {}, webhook, loading } = this.props;
    const refreshAction = {
      content: loading ? 'Loading...' : 'Refresh Batches',
      color: 'orange',
      onClick: this.getAttempts,
      disabled: !!loading
    };

    return (
      <div>
        <Panel>
          <Panel.Section>
            <div className={styles.BackLink}><small><PageLink to={`/webhooks/details/${webhook.id}/batches`}><ArrowBack/> Return to All Batches</PageLink></small></div>
            <LabelledValue label='Batch ID'><h6>{firstBatch.batch_id}</h6></LabelledValue>
            <LabelledValue label='Attempts'><h6>{firstBatch.attempts}</h6></LabelledValue>
            <LabelledValue label='Batch Size'>
              <h6><Tooltip dark content='Number of events in this batch'>{firstBatch.batch_size} <InfoOutline className={styles.TooltipTrigger}/></Tooltip></h6>
            </LabelledValue>
          </Panel.Section>
        </Panel>
        <Panel title='Batch Attempt History' actions={[refreshAction]}>
          <Table>
            <thead>
              <Table.Row>
                <Table.HeaderCell width='200px'>Status</Table.HeaderCell>
                <Table.HeaderCell width='250px'>Timestamp</Table.HeaderCell>
                <Table.HeaderCell width='200px'>Latency</Table.HeaderCell>
                <Table.HeaderCell>Attempt</Table.HeaderCell>
              </Table.Row>
            </thead>
            <tbody>
              {batches.map((batch, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Tag color={batch.status === 'Success' ? 'blue' : 'yellow'}>{batch.response_code}</Tag>
                  </Table.Cell>
                  <Table.Cell>{batch.formatted_time}</Table.Cell>
                  <Table.Cell>{batch.latency && `${batch.latency} ms`}</Table.Cell>
                  <Table.Cell>{batch.attempts}</Table.Cell>
                </Table.Row>
              ))}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const batches = selectWebhookBatches(state);
  return {
    batches,
    firstBatch: _.first(batches),
    loading: state.webhooks.batchesLoading
  };
};

export default withRouter(connect(mapStateToProps, { getBatches })(BatchDetailsTab));
