import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { getAggregateMetrics, getLinkMetrics } from 'src/actions/engagementReport';
import { showAlert } from 'src/actions/globalAlert';
import EngagementChart from './components/EngagementChart';
import EngagementFilters from './components/EngagementFilters';
import EngagementSummary from './components/EngagementSummary';
import EngagementTable from './components/EngagementTable';

export class EngagementPage extends Component {
  onLoad = () => {
    this.props.getAggregateMetrics().catch(this.onLoadFail('Unable to load engagement data.'));
    this.props.getLinkMetrics().catch(this.onLoadFail('Unable to load click data.'));
  }

  onLoadFail = (message) => (error) => {
    const details = _.get(error, 'response.data.errors[0].message');
    this.props.showAlert({ details, message, type: 'error' });
  }

  render() {
    const { aggregateMetrics, linkMetrics } = this.props;

    return (
      <Page title='Engagement Report'>
        <EngagementFilters shareDisabled={aggregateMetrics.loading} onLoad={this.onLoad} />
        <EngagementSummary
          clicks={aggregateMetrics.data.count_unique_clicked_approx}
          loading={aggregateMetrics.loading}
          targeted={aggregateMetrics.data.count_targeted}
        />
        <EngagementChart
          accepted={aggregateMetrics.data.count_accepted}
          clicks={aggregateMetrics.data.count_unique_clicked_approx}
          loading={aggregateMetrics.loading}
          opens={aggregateMetrics.data.count_unique_confirmed_opened_approx}
          targeted={aggregateMetrics.data.count_targeted}
        />
        <EngagementTable data={linkMetrics.data} loading={linkMetrics.loading} />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  aggregateMetrics: state.engagementReport.aggregateMetrics,
  linkMetrics: state.engagementReport.linkMetrics
});
const mapDispatchToProps = { getAggregateMetrics, getLinkMetrics, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
