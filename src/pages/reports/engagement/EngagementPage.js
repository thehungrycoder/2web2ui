import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { refreshEngagementReport } from 'src/actions/engagementReport';
import Filters from 'src/pages/reports/components/Filters';
import EngagementChart from './components/EngagementChart';
import EngagementSummary from './components/EngagementSummary';
import EngagementTable from './components/EngagementTable';

export class EngagementPage extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportFilters !== this.props.reportFilters) {
      this.props.refreshEngagementReport(nextProps.reportFilters);
    }
  }

  render() {
    const { loading, aggregateMetrics, linkMetrics } = this.props;

    return (
      <Page title='Engagement Report'>
        <Filters reportLoading={loading} />
        <EngagementSummary
          accepted={aggregateMetrics.data.count_accepted}
          clicks={aggregateMetrics.data.count_unique_clicked_approx}
          loading={aggregateMetrics.loading}
          opens={aggregateMetrics.data.count_unique_confirmed_opened_approx}
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

const mapStateToProps = (state) => ({
  loading: state.engagementReport.loading,
  aggregateMetrics: state.engagementReport.aggregateMetrics,
  linkMetrics: state.engagementReport.linkMetrics,
  reportFilters: state.reportFilters
});
const mapDispatchToProps = { refreshEngagementReport };

export default connect(mapStateToProps, mapDispatchToProps)(EngagementPage);
