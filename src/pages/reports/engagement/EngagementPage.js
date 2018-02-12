import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { refreshEngagementReport } from 'src/actions/engagementReport';
import Filters from 'src/pages/reports/components/Filters';
import EngagementChart from './components/EngagementChart';
import EngagementSummary from './components/EngagementSummary';
import EngagementTable from './components/EngagementTable';

export class EngagementPage extends Component {

  render() {
    const { aggregateMetrics, linkMetrics, refreshEngagementReport } = this.props;

    return (
      <Page title='Engagement Report'>
        <Filters refresh={refreshEngagementReport} />
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

const mapStateToProps = (state, props) => ({
  aggregateMetrics: state.engagementReport.aggregateMetrics,
  linkMetrics: state.engagementReport.linkMetrics
});
const mapDispatchToProps = { refreshEngagementReport };

export default connect(mapStateToProps, mapDispatchToProps)(EngagementPage);
