import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { getChartData } from 'src/actions/engagementReport';
import { showAlert } from 'src/actions/globalAlert';
import EngagementChart from './components/EngagementChart';
import EngagementFilters from './components/EngagementFilters';
import EngagementSummary from './components/EngagementSummary';

export class EngagementPage extends Component {
  onLoad = () => {
    this.props.getChartData().catch((error) => {
      this.props.showAlert({
        details: _.get(error, 'response.data.errors[0].message'),
        message: 'Unable to load engagement data.',
        type: 'error'
      });
    });
  }

  render() {
    const { chart } = this.props;

    return (
      <Page title='Engagement Report'>
        <EngagementFilters shareDisabled={chart.loading} onLoad={this.onLoad} />
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
}

const mapStateToProps = (state, props) => ({
  chart: state.engagementReport.chart
});
const mapDispatchToProps = { getChartData, showAlert };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
