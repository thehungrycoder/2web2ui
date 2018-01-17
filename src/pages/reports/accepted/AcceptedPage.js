import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { refreshAcceptedMetrics } from 'src/actions/acceptedReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Size, Duration, Empty, PanelLoading } from 'src/components';
import { Page, Grid } from '@sparkpost/matchbox';
import { Filters, ShareModal, MetricCard, MetricsSummary } from '../components/';
import ChartGroup from './components/ChartGroup';
import _ from 'lodash';

export class AcceptedPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch() {
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      filters.forEach(this.props.addFilter);
    }

    return options;
  }

  handleRefresh = (options) => {
    const { refreshAcceptedMetrics, showAlert } = this.props;

    return refreshAcceptedMetrics(options)
      .then(() => this.updateLink())
      .catch((err) => {
        showAlert({ type: 'error', message: 'Unable to refresh report.', details: err.message });
      });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const query = getFilterSearchOptions(filters);
    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
    history.replace({ pathname: '/reports/accepted', search });
  }

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  renderTopLevelMetrics() {
    const { chartLoading, aggregates, filters } = this.props;
    const {
      count_targeted,
      count_accepted,
      count_sent,
      avg_delivery_time_first,
      avg_delivery_time_subsequent,
      avg_msg_size
    } = aggregates;

    if (chartLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <div>
        <MetricsSummary
          rateValue={(count_accepted / count_targeted) * 100}
          rateTitle='Accepted Rate'
          secondaryMessage={`${count_sent.toLocaleString()} messages were sent.`}
          {...filters} >
          <strong>{count_accepted.toLocaleString()}</strong> of <strong>{count_targeted.toLocaleString()}</strong>  targeted messages were accepted
        </MetricsSummary>
        <Grid>
          <Grid.Column xs={12} md={4}>
            <MetricCard value={<Duration value={avg_delivery_time_first}/>} label='Avg Latency (First)' />
          </Grid.Column>
          <Grid.Column xs={12} md={4}>
            <MetricCard value={<Duration value={avg_delivery_time_subsequent}/>} label='Avg Latency (Subsequent)' />
          </Grid.Column>
          <Grid.Column xs={12} md={4}>
            <MetricCard value={<Size value={avg_msg_size}/>} label='Avg Message Size' />
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  renderChart() {
    const { chartLoading, aggregates } = this.props;

    if (!chartLoading && !aggregates) {
      return <Empty title='Accepted Rates' message='No Accepted Messages To Report' />;
    }

    return <ChartGroup loading={chartLoading} />;
  }

  render() {
    const { modal, query } = this.state;

    return (
      <Page title='Accepted Report'>
        <Filters refresh={this.handleRefresh} onShare={() => this.handleModalToggle('shareModal')} />
        {this.renderTopLevelMetrics()}
        {this.renderChart()}
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          query={query} />
      </Page>
    );
  }
}


const mapStateToProps = ({ reportFilters, acceptedReport }) => ({
  filters: reportFilters,
  attempts: acceptedReport.attempts,
  aggregates: acceptedReport.aggregates,
  chartLoading: acceptedReport.aggregatesLoading || acceptedReport.attemptsLoading
});

const mapDispatchToProps = {
  refreshAcceptedMetrics,
  refreshTypeaheadCache,
  addFilter,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AcceptedPage));
