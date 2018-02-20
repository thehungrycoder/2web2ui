import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { refreshEngagementReport } from 'src/actions/engagementReport';
import ReportOptions from 'src/pages/reports/components/ReportOptions';
import EngagementChart from './components/EngagementChart';
import EngagementSummary from './components/EngagementSummary';
import EngagementTable from './components/EngagementTable';

export class EngagementPage extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshEngagementReport(nextProps.reportOptions);
    }
  }

  render() {
    const { loading, aggregateMetrics, linkMetrics } = this.props;

    return (
      <Page title='Engagement Report'>
        <ReportOptions reportLoading={loading} />
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
  reportOptions: state.reportOptions
});
const mapDispatchToProps = { refreshEngagementReport };

export default connect(mapStateToProps, mapDispatchToProps)(EngagementPage);
