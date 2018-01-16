/* eslint max-lines: ["error", 175] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { loadDelayReasonsByDomain, loadDelayMetrics } from 'src/actions/delayReport';
import { parseSearch, getFilterSearchOptions } from 'src/helpers/reports';
import { Percent } from 'src/components/formatters';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
import _ from 'lodash';

const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Delayed', 'Delayed First Attempt (%)'];

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
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      filters.forEach(this.props.addFilter);
    }

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
    this.props.addFilter({ type: 'Recipient Domain', value: domain });
    this.handleRefresh();
  }

  getRowData = (rowData) => {
    const { totalAccepted } = this.props;
    const { reason, domain, count_delayed, count_delayed_first } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => this.handleDomainClick(domain)}>{domain}</UnstyledLink>,
      count_delayed,
      <span>{count_delayed_first} (<Percent value={(count_delayed_first / totalAccepted) * 100} />)</span>
    ];
  }

  renderCollection() {
    const { loading, reasons } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (!reasons) {
      return <Empty title={'Delayed Messages'} message={'No delay reasons to report'} />;
    }

    return <TableCollection
      columns={columns}
      rows={reasons}
      getRowData={this.getRowData}
      pagination={true}
    />;
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
  refreshTypeaheadCache,
  addFilter,
  loadDelayReasonsByDomain,
  loadDelayMetrics,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DelayPage));
