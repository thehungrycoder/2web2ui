import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import _ from 'lodash';

import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { addFilters, initTypeaheadCache } from 'src/actions/reportFilters';
import { loadRejectionMetrics, refreshRejectionTableMetrics } from 'src/actions/rejectionReport';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import MetricsSummary from '../components/MetricsSummary';
import DataTable from './components/DataTable';

export class RejectionPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.initTypeaheadCache();
  }

  /**
   * takes qp's and dispatches filters being added
   * Note: this has to be done in page because Redux is wired
   * and not in the helper
   */
  parseSearch() {
    const { filters = [], options } = parseSearch(this.props.location.search);
    this.props.addFilters(filters);
    return options;
  }

  handleRefresh = (options) => {
    const { showAlert, refreshRejectionTableMetrics, loadRejectionMetrics } = this.props;
    return Promise.all([
      loadRejectionMetrics(options),
      refreshRejectionTableMetrics(options)
    ])
      .then(() => this.updateLink())
      .catch((err) => showAlert({ type: 'error', message: 'Unable to refresh rejection reports.', details: err.message }));
  }

  handleModalToggle = () => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const query = getFilterSearchOptions(filters);
    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
    history.replace({ pathname: '/reports/rejections', search });
  }

  handleDomainClick = (domain) => {
    this.props.addFilters([{ type: 'Recipient Domain', value: domain }]);
    this.handleRefresh();
  }

  renderCollection() {
    const { loading, list } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    return <DataTable list={list} onDomainClick={this.handleDomainClick} />;
  }

  renderTopLevelMetrics() {
    const { aggregatesLoading, aggregates, filters } = this.props;
    const { count_rejected, count_targeted } = aggregates;

    if (aggregatesLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={(count_rejected / count_targeted) * 100}
        rateTitle='Rejected Rate'
        {...filters} >
        <strong>{count_rejected.toLocaleString()}</strong> of your messages were rejected of <strong>{count_targeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { modal, query } = this.state;
    const { loading } = this.props;

    return (
      <Page title='Rejections Report'>
        <Filters
          refresh={this.handleRefresh}
          onShare={this.handleModalToggle}
          shareDisabled={loading}
        />
        { this.renderTopLevelMetrics() }
        <Panel title='Rejection Reasons' className='RejectionTable'>
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

const mapStateToProps = ({ reportFilters, rejectionReport }) => ({
  filters: reportFilters,
  loading: rejectionReport.aggregatesLoading || rejectionReport.reasonsLoading,
  aggregatesLoading: rejectionReport.aggregatesLoading,
  aggregates: rejectionReport.aggregates,
  list: rejectionReport.list
});

const mapDispatchToProps = {
  addFilters,
  loadRejectionMetrics,
  refreshRejectionTableMetrics,
  initTypeaheadCache,
  showAlert
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RejectionPage));
