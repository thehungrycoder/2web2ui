import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { addFilters } from 'src/actions/reportFilters';
import { refreshDelayReport } from 'src/actions/delayReport';
import { Page, Panel } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
import DelaysDataTable from './components/DelaysDataTable';

export class DelayPage extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportFilters !== this.props.reportFilters) {
      this.props.refreshDelayReport(nextProps.reportFilters);
    }
  }

  renderDataTable() {
    const { loading, reasons, totalAccepted } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    return <DelaysDataTable totalAccepted={totalAccepted} rows={reasons} addFilters={this.props.addFilters} />;
  }

  renderTopLevelMetrics() {
    const { aggregatesLoading, aggregates } = this.props;
    const { count_delayed_first, count_accepted } = aggregates;

    if (aggregatesLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={(count_delayed_first / count_accepted) * 100}
        rateTitle='Delayed Rate'
        secondaryMessage={`${count_delayed_first.toLocaleString()} were delayed on first attempt.`}
      >
        <strong>{count_delayed_first.toLocaleString()}</strong> of your messages were delayed of <strong>{count_accepted.toLocaleString()}</strong> messages accepted
      </MetricsSummary>
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <Page title='Delay Report'>
        <Filters reportLoading={loading} />
        { this.renderTopLevelMetrics() }
        <Panel title='Delayed Messages' className='ReasonsTable'>
          { this.renderDataTable() }
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { aggregates } = state.delayReport;
  return {
    loading: state.delayReport.aggregatesLoading || state.delayReport.reasonsLoading,
    reasons: state.delayReport.reasons,
    totalAccepted: aggregates ? aggregates.count_accepted : 1,
    aggregates,
    aggregatesLoading: state.delayReport.aggregatesLoading,
    reportFilters: state.reportFilters
  };
};

const mapDispatchToProps = {
  addFilters,
  refreshDelayReport
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DelayPage));
