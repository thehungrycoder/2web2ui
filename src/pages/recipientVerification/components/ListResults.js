import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@sparkpost/matchbox';
import { PollContext } from 'src/context/Poll';
import withContext from 'src/context/withContext';

import ListResultsCard from './ListResultsCard';
import { getLatest, getStatus } from 'src/actions/recipientVerificationLists';
import _ from 'lodash';

export class ListResults extends Component {

  componentDidMount() {
    this.props.getLatest();
    // this.props.getStatus('0db99090-de13-11e8-9b7f-312603a5b28c');
  }

  isPolling = (id) => _.get(this.props, `actions[${id}].status`) === 'polling';

  componentDidUpdate({ latest: prevLatest }) {
    const { latest, getStatus, startPolling, stopPolling } = this.props;


    // Start polling when a new list ID is recieved, which changes when either:
    // - Upload view first mounts and latest results are not complete
    // - Form is resubmitted

    if (latest.listId && !latest.complete && prevLatest.listId !== latest.listId) {

      // Stop any previous polling instances
      if (prevLatest.listId && this.isPolling(prevLatest.listId)) {
        stopPolling(prevLatest.listId);
      }

      // Start new poll
      if (!this.isPolling(latest.listId)) {
        startPolling({
          key: latest.listId,
          action: () => getStatus(latest.listId),
          interval: 5000,
          maxAttempts: 200
        });
      }
    }

    // Stop current polling when complete
    if (latest.complete && this.isPolling(latest.listId)) {
      stopPolling(latest.listId);
    }
  }

  componentWillUnmount() {
    const { stopPolling, latest } = this.props;
    if (this.isPolling(latest.listId)) {
      stopPolling(latest.listId);
    }
  }

  render() {
    const { latest } = this.props;

    if (_.isEmpty(latest)) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={6} lg={4}>
          <ListResultsCard {...latest} />
        </Grid.Column>
      </Grid>
    );
  }
}


const mapStateToProps = ({ recipientVerificationLists }) => ({
  latest: recipientVerificationLists.listResults,
  loading: recipientVerificationLists.listResultsLoading
});

export default connect(mapStateToProps, { getLatest, getStatus })(withContext(PollContext, ListResults));
