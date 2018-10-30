import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@sparkpost/matchbox';
import ListResultsCard from './ListResultsCard';
import { getLatest, getJob } from 'src/actions/recipientVerificationLists';
import _ from 'lodash';

export class ListResults extends Component {
  componentDidMount() {
    this.props.getLatest();
  }

  componentDidUpdate({ results: prevResults }) {
    const { results, getJob } = this.props;

    // console.log({ prevLatest, latest, job })
    // if latest is pending

    if (!prevResults && !_.isEmpty(results) && !results.complete) {
      // start poll
      // console.log(results);
      getJob(results.list_id);
    }

    // if (latest.complete && polling)
    // stop poll
  }

  render() {
    const { results } = this.props;

    if (!results) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={6} lg={4}>
          <ListResultsCard {...{ ...results, complete: true }} />
        </Grid.Column>
        <Grid.Column xs={12} md={6} lg={4}>
          <ListResultsCard {...results} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ recipientVerificationLists }) => ({
  results: recipientVerificationLists.listResults,
  loading: recipientVerificationLists.listResultsLoading
});

export default connect(mapStateToProps, { getLatest, getJob })(ListResults);
