import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';
import { getChartData } from 'src/actions/engagementReport';
import EngagementChart from './components/EngagementChart';

export class EngagementPage extends Component {
  componentDidMount() {
    this.props.getChartData();
  }

  render() {
    const { data } = this.props.chart;

    return (
      <Page title='Engagement Report'>
        <Panel sectioned>
          <EngagementChart
            accepted={data.count_accepted}
            clicks={data.count_unique_clicked_approx}
            opens={data.count_unique_confirmed_opened_approx}
            targeted={data.count_targeted}
          />
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  chart: state.engagementReport.chart
});
const mapDispatchToProps = { getChartData };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
