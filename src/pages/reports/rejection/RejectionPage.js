import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import qs from 'query-string';
import { refreshRejectionTableMetrics } from 'src/actions/rejectionReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Category', 'Count'];

export class RejectionPage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch() {
    const { addFilter } = this.props;
    const { options, filters } = parseSearch(this.props.location.search);

    if (!_.isEmpty(filters)) {
      filters.forEach(addFilter);
    }

    return options;
  }

  handleRefresh = (options) => {
    const { showAlert, refreshRejectionTableMetrics } = this.props;
    return refreshRejectionTableMetrics(options)
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
    this.props.addFilter({ type: 'Recipient Domain', value: domain });
    this.handleRefresh();
  }

  getRowData = (rowData) => {
    const { reason, domain, rejection_category_name,count_rejected } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => this.handleDomainClick(domain)}>{ domain }</UnstyledLink>,
      rejection_category_name,
      count_rejected
    ];
  };

  renderCollection() {

    const { loading, list } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (!list.length) {
      return <Empty message={'There are no rejection messages for your current query'} />;
    }

    return <TableCollection
      columns={columns}
      rows={list}
      getRowData={this.getRowData}
      pagination={true}
    />;
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
  loading: rejectionReport.reasonsLoading,
  list: rejectionReport.list
});

const mapDispatchToProps = {
  addFilter,
  refreshRejectionTableMetrics,
  refreshTypeaheadCache,
  showAlert
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RejectionPage));
