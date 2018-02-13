import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { refreshSummaryReport } from 'src/actions/summaryChart';
import { addFilters, refreshReportOptions } from 'src/actions/reportFilters';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import Filters from '../components/Filters';
import { Table, MetricsModal, ChartGroup, ChartHeader } from './components';
import { selectSummaryReportState, selectSelectedMetrics } from 'src/selectors/summaryReport';

import styles from './SummaryPage.module.scss';

export class SummaryReportPage extends Component {
  state = {
    metricsModal: false,
    eventTime: 'real',
    scale: 'linear'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportFilters !== this.props.reportFilters) {
      this.props.refreshSummaryReport(nextProps.reportFilters);
    }
  }

  renderLoading() {
    const { chart } = this.props;
    if (chart.chartLoading) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  handleMetricsApply = (selectedMetrics) => {
    this.setState({ metricsModal: false });
    this.props.refreshReportOptions({ metrics: selectedMetrics });
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
    const { chart } = this.props;
    const { scale, eventTime, metricsModal } = this.state;

    return (
      <Page title='Summary Report'>
        <Filters
          reportLoading={chart.chartLoading}
          extraLinkParams={['metrics']}
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
  chart: selectSummaryReportState(state),
  selectedMetrics: selectSelectedMetrics(state),
  reportFilters: state.reportFilters
});

const mapDispatchToProps = {
  addFilters,
  refreshReportOptions,
  refreshSummaryReport
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryReportPage);
