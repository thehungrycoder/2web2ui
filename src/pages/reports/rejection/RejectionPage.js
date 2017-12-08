import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadRejectionByDomainReports } from 'src/actions/rejectionReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';

import { TableCollection } from 'src/components';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import Empty from '../components/Empty';

import './RejectionPage.scss';

const columns = [{ label: 'Reason' }, { label: 'Domain', width: '20%' }, { label: 'Category', width: '20%' }, { label: 'Count', width: '10%' }];

export class RejectionPage extends Component {
  state = {
    modal: false,
    link: ''
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
    this.props.loadRejectionByDomainReports(options)
      .then(() => this.updateLink())
      .catch((err) => {
        this.props.showAlert({ type: 'error', message: 'Unable to refresh rejection reports.', details: err.message });
      });

  }

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const options = getFilterSearchOptions(filters);
    const { link, search } = getShareLink(options);

    this.setState({ link });
    history.replace({ pathname: '/reports/rejections', search });
  }

  getRowData = (rowData) => {
    const { reason, domain, rejection_category_name,count_rejected } = rowData;
    return [
      <div className='ReasonCell'>{reason}</div>,
      domain,
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
    const { modal, link } = this.state;

    return (
      <Page title='Rejections Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle} />
        <Panel title='Rejection Reasons' className='RejectionTable'>
          { this.renderCollection() }
        </Panel>
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          link={link} />
      </Page>
    );
  }
}

const mapStateToProps = ({ reportFilters, rejectionReasons }) => ({
  filters: reportFilters,
  loading: rejectionReasons.reasonsLoading,
  list: rejectionReasons.list
});

const mapDispatchToProps = {
  addFilter,
  loadRejectionByDomainReports,
  refreshTypeaheadCache,
  showAlert
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RejectionPage));
