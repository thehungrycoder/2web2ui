import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { refreshSummaryReport } from 'src/actions/summaryChart';
import { addFilters } from 'src/actions/reportFilters';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import Filters from '../components/Filters';
import { Table, MetricsModal, ChartGroup, ChartHeader } from './components';

import styles from './SummaryPage.module.scss';

export class SummaryReportPage extends Component {
  state = {
    metricsModal: false,
    eventTime: 'real',
    scale: 'linear'
  }

  renderLoading() {
    const { chart } = this.props;
    if (chart.chartLoading) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  handleMetricsApply = (selectedMetrics) => {
    this.setState({ metricsModal: false });
    this.props.refreshSummaryReport({ metrics: selectedMetrics });
  }

  handleModalToggle = (modal) => {
    this.setState({ [modal]: !this.state[modal] });
  }

  handleTimeClick = (time) => {
    this.setState({ eventTime: time });
  }

  handleScaleClick = (scale) => {
    this.setState({ scale });
  }

  render() {
    const { chart, refreshSummaryReport } = this.props;
    const { scale, eventTime, metricsModal } = this.state;

    const selectedMetrics = chart.metrics.map((metric) => metric.key);

    return (
      <Page title='Summary Report'>
        <Filters
          refresh={refreshSummaryReport}
          reportLoading={chart.chartLoading}
          dynamicMetrics={selectedMetrics}
        />

        <Panel>
          <Panel.Section className={classnames(styles.ChartSection, chart.chartLoading && styles.pending)}>
            <ChartHeader
              selectedMetrics={chart.metrics}
              selectedTime={eventTime}
              selectedScale={scale}
              onScaleClick={this.handleScaleClick}
              onTimeClick={this.handleTimeClick}
              onMetricsToggle={() => this.handleModalToggle('metricsModal')}
            />
            <ChartGroup {...chart} yScale={scale} />
          </Panel.Section>

          {this.renderLoading()}
        </Panel>

        <Table />

        <MetricsModal
          selectedMetrics={chart.metrics}
          open={metricsModal}
          onCancel={() => this.handleModalToggle('metricsModal')}
          onSubmit={this.handleMetricsApply} />
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  chart: state.summaryChart
});

const mapDispatchToProps = {
  addFilters,
  refreshSummaryReport
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryReportPage);
