import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { refreshAcceptedMetrics } from 'src/actions/acceptedReport';
import { addFilters, initTypeaheadCache } from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Empty, PanelLoading } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import { Filters, ShareModal } from '../components/';
import ChartGroup from './components/ChartGroup';
import TopLevelMetrics from './components/TopLevelMetrics';
import _ from 'lodash';

export class AcceptedPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.initTypeaheadCache();
  }

  parseSearch() {
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      this.props.addFilters(filters);
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
    const { chartLoading, aggregates, filters, metrics } = this.props;

    if (chartLoading) {
      return <PanelLoading minHeight='120px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return <TopLevelMetrics aggregates={aggregates} filters={filters} metrics={metrics}/>;
  }

  renderChart() {
    const { chartLoading, aggregates } = this.props;

    if (!chartLoading && _.isEmpty(aggregates)) {
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
  metrics: acceptedReport.metrics,
  chartLoading: acceptedReport.aggregatesLoading || acceptedReport.attemptsLoading
});

const mapDispatchToProps = {
  refreshAcceptedMetrics,
  initTypeaheadCache,
  addFilters,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AcceptedPage));
