import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TableCollection } from 'src/components';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { loadDelayReasonsByDomain } from 'src/actions/delayReport';
import { parseSearch, getFilterSearchOptions, getShareLink } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import Empty from '../components/Empty';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import '../ReasonsTable.scss';


const columns = ['Reason', { label: 'Domain', width: '20%' }, 'Delayed', 'Delayed First Attempt', 'Test'];

export class DelayPage extends Component {
  state = {
    modal: false,
    link: ''
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch = () => {
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      filters.forEach(this.props.addFilter);
    }

    return options;
  }

  handleRefresh = (options) => {
    this.props.loadDelayReasonsByDomain(options)
      .then(() => this.updateLink())
      .catch((err) => {
        this.props.showAlert({ type: 'error', message: 'Unable to refresh delay report.', details: err.message });
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
    history.replace({ pathname: '/reports/delayed', search });
  }

  handleDomainClick = (domain) => {
    this.props.addFilter({ type: 'Recipient Domain', value: domain });
    this.handleRefresh();
  }

  getRowData = (rowData) => {
    const { reason, domain, count_delayed, count_delayed_first } = rowData;
    return [
      <div className='ReasonCell'>{reason}</div>,
      <UnstyledLink onClick={() => this.handleDomainClick(domain)}>{domain}</UnstyledLink>,
      count_delayed,
      count_delayed_first
    ];
  }

  renderCollection() {
    const { tableLoading, reasons } = this.props;

    if (tableLoading) {
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

  render() {
    const { modal, link } = this.state;

    return (
      <Page title='Delay Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle} />
        <Panel title='Delayed Messages' className='ReasonsTable'>
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

// TODO: get aggregate counts
const mapStateToProps = (state) => {
  const tableLoading = state.delayReport.reasonsLoading;
  return {
    filters: state.reportFilters,
    tableLoading,
    reasons: state.delayReport.reasons
  };
};

const mapDispatchToProps = {
  refreshTypeaheadCache,
  addFilter,
  loadDelayReasonsByDomain,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DelayPage));
