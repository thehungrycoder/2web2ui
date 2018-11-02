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
  }

  componentDidUpdate({ latestId: prevLatestId }) {
    const { latestId, results, getStatus, startPolling, stopPolling } = this.props;

    // Start polling when a new list ID is recieved, which changes when either:
    // - Upload view first mounts
    // - Form is resubmitted
    if (prevLatestId !== latestId) {
      stopPolling(prevLatestId); // Stop any previous polling instances

      if (!results.complete) {
        getStatus(latestId);
        startPolling({
          key: latestId,
          action: () => getStatus(latestId),
          interval: 2000,
          maxAttempts: 200
        });
      }
    }

    // Stop current polling when complete
    if (results.complete) {
      stopPolling(latestId);
    }
  }

  componentWillUnmount() {
    const { stopPolling, latestId } = this.props;
    stopPolling(latestId);
  }

  render() {
    const { results } = this.props;

    if (_.isEmpty(results)) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={6} lg={4}>
          <ListResultsCard {...results} />
        </Grid.Column>
      </Grid>
    );
  }
}


const mapStateToProps = ({ recipientVerificationLists }) => {
  const latestId = recipientVerificationLists.latest;

  return {
    latestId,
    results: recipientVerificationLists.listResults[latestId] || {},
    loading: recipientVerificationLists.listResultsLoading
  };
};

export default connect(mapStateToProps, { getLatest, getStatus })(withContext(PollContext, ListResults));
