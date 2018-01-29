import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import _ from 'lodash';

import { addFilters, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { loadDelayReasonsByDomain, loadDelayMetrics } from 'src/actions/delayReport';
import { parseSearch, getFilterSearchOptions } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
import DelaysDataTable from './components/DelaysDataTable';

export class DelayPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch() {
    const { filters = [], options } = parseSearch(this.props.location.search);
    this.props.addFilters(filters);
    return options;
  }

  handleRefresh = (options) => Promise.all([
    this.props.loadDelayMetrics(options),
    this.props.loadDelayReasonsByDomain(options)
  ])
    .then(() => this.updateLink())
    .catch((err) => {
      this.props.showAlert({ type: 'error', message: 'Unable to refresh delay report.', details: err.message });
    });

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const query = getFilterSearchOptions(filters);
    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
    history.replace({ pathname: '/reports/delayed', search });
  }

  handleDomainClick = (domain) => {
    this.props.addFilters([{ type: 'Recipient Domain', value: domain }]);
    this.handleRefresh();
  }

  renderCollection() {
    const { loading, reasons, totalAccepted } = this.props;

    if (loading) {
      return <PanelLoading />;
    }
    return <DelaysDataTable totalAccepted={totalAccepted} rows={reasons} onDomainClick={this.handleDomainClick} />;
  }

  renderTopLevelMetrics() {
    const { aggregatesLoading, aggregates, filters } = this.props;
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
        {...filters} >
        <strong>{count_delayed_first.toLocaleString()}</strong> of your messages were delayed of <strong>{count_accepted.toLocaleString()}</strong> messages accepted
      </MetricsSummary>
    );
  }

  render() {
    const { modal, query } = this.state;
    const { loading } = this.props;

    return (
      <Page title='Delay Report'>
        <Filters
          refresh={this.handleRefresh}
          onShare={this.handleModalToggle}
          shareDisabled={loading}
        />
        { this.renderTopLevelMetrics() }
        <Panel title='Delayed Messages' className='ReasonsTable'>
          { this.renderCollection() }
        </Panel>
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          query={query} />
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const loading = state.delayReport.aggregatesLoading || state.delayReport.reasonsLoading;
  const aggregates = state.delayReport.aggregates;
  return {
    filters: state.reportFilters,
    loading,
    reasons: state.delayReport.reasons,
    totalAccepted: aggregates ? aggregates.count_accepted : 1,
    aggregates,
    aggregatesLoading: state.delayReport.aggregatesLoading
  };
};

const mapDispatchToProps = {
  addFilters,
  refreshTypeaheadCache,
  loadDelayReasonsByDomain,
  loadDelayMetrics,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DelayPage));
