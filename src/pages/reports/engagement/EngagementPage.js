import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { getChartData } from 'src/actions/engagementReport';
import EngagementChart from './components/EngagementChart';
import EngagementFilters from './components/EngagementFilters';
import EngagementSummary from './components/EngagementSummary';

export function EngagementPage({ chart, getChartData }) {
  return (
    <Page title='Engagement Report'>
      <EngagementFilters shareDisabled={chart.loading} onLoad={getChartData} />
      <EngagementSummary
        clicks={chart.data.count_unique_clicked_approx}
        loading={chart.loading}
        targeted={chart.data.count_targeted}
      />
      <EngagementChart
        accepted={chart.data.count_accepted}
        clicks={chart.data.count_unique_clicked_approx}
        loading={chart.loading}
        opens={chart.data.count_unique_confirmed_opened_approx}
        targeted={chart.data.count_targeted}
      />
    </Page>
  );
}

const mapStateToProps = (state, props) => ({
  chart: state.engagementReport.chart
});
const mapDispatchToProps = { getChartData };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
