import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { loadDelayReasonsByDomain, loadDelayMetrics } from 'src/actions/delayReport';
import { parseSearch, getFilterSearchOptions, humanizeTimeRange } from 'src/helpers/reports';
import { Percent } from 'src/components/formatters';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Delayed', 'Delayed First Attempt (%)'];

export class DelayPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(parseSearch(this.props.location.search));
    this.props.refreshTypeaheadCache();
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

    if (aggregatesLoading) {
      return <PanelLoading />;
    }

    return <MetricsSummary
      rateValue={(aggregates.count_delayed_first / aggregates.count_accepted) * 100}
      rateTitle={'Delayed Rate'}>
      { aggregates.count_delayed && <span><strong>{aggregates.count_delayed.toLocaleString()}</strong> of your messages were delayed of <strong>{aggregates.count_accepted.toLocaleString()}</strong> messages accepted in the <strong>last {humanizeTimeRange(filters.from, filters.to)}</strong>.</span> }
      { aggregates.count_delayed_first && <small>{aggregates.count_delayed_first.toLocaleString()} were delayed on first attempt.</small> }
    </MetricsSummary>;
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
