import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';
import { getChartData } from 'src/actions/engagementReport';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import EngagementChart from './components/EngagementChart';
import EngagementFilters from './components/EngagementFilters';

export function EngagementPage({ chart, getChartData }) {
  return (
    <Page title='Engagement Report'>
      <EngagementFilters shareDisabled={chart.loading} onLoad={getChartData} />
      {chart.loading && <PanelLoading />}
      {!chart.loading && (
        <Panel sectioned>
          <EngagementChart
            accepted={chart.data.count_accepted}
            clicks={chart.data.count_unique_clicked_approx}
            opens={chart.data.count_unique_confirmed_opened_approx}
            targeted={chart.data.count_targeted}
          />
        </Panel>
      )}
    </Page>
  );
}

const mapStateToProps = (state, props) => ({
  chart: state.engagementReport.chart
});
const mapDispatchToProps = { getChartData };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
