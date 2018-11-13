import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';
import { Grid } from '@sparkpost/matchbox';
import { PollContext } from 'src/context/Poll';
import withContext from 'src/context/withContext';

import ListResultsCard from './ListResultsCard';
import { getLatestJob, getJobStatus } from 'src/actions/recipientVerificationLists';
import _ from 'lodash';

export class ListResults extends Component {

  componentDidMount() {
    this.props.getLatestJob();
  }

  componentDidUpdate({ latestId: prevLatestId }) {
    const { latestId, results, startPolling, stopPolling } = this.props;

    // Start polling when a new list ID is recieved, which changes when either:
    // - Upload view first mounts
    // - Form is resubmitted
    if (prevLatestId !== latestId) {
      stopPolling(prevLatestId); // Stop any previous polling instances

      if (!results.complete) {
        this.handlePoll(latestId);
        startPolling({
          key: latestId,
          action: () => this.handlePoll(latestId),
          interval: 5000
        });
      }
    }

    // Stop current polling when complete
    if (results.complete) {
      stopPolling(latestId);
    }
  }

  handlePoll = (id) => {
    const { showAlert, getJobStatus } = this.props;
    return getJobStatus(id).then(({ complete }) => {
      if (complete) {
        showAlert({
          type: 'success',
          message: 'Recipient Verification Results Ready',
          dedupeId: id
        });
      }
    });
  }

  render() {
    const { results, loading } = this.props;

    if (!loading && _.isEmpty(results)) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={6} lg={5}>
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
    results: recipientVerificationLists.jobResults[latestId] || {},
    loading: recipientVerificationLists.jobResultsLoading
  };
};

export default connect(mapStateToProps, { getLatestJob, getJobStatus, showAlert })(withContext(PollContext, ListResults));
