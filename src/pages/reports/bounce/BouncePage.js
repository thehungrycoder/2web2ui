import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { refreshBounceChartMetrics, refreshBounceTableMetrics } from 'src/actions/bounceReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';

import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { Percent } from 'src/components/formatters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';

const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Category', 'Classification', 'Count (%)'];

export class BouncePage extends Component {
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
    this.props.refreshBounceChartMetrics(options)
      .then(() => this.updateLink())
      .then(() => this.props.refreshBounceTableMetrics(options))
      .catch((err) => {
        this.props.showAlert({ type: 'error', message: 'Unable to refresh bounce report.', details: err.message });
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
    history.replace({ pathname: '/reports/bounce', search });
  }

  handleDomainClick = (domain) => {
    this.props.addFilter({ type: 'Recipient Domain', value: domain });
    this.handleRefresh();
  }

  getRowData = (rowData) => {
    const { totalBounces } = this.props;
    const { reason, domain, bounce_category_name, bounce_class_name, count_bounce } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => this.handleDomainClick(domain)}>{ domain }</UnstyledLink>,
      bounce_category_name,
      bounce_class_name,
      <span>{count_bounce}(<Percent value={(count_bounce / totalBounces) * 100} />)</span>
    ];
  };

  renderChart() {
    const { chartLoading, aggregates } = this.props;

    if (!chartLoading && !aggregates) {
      return <Empty title='Bounce Rates' message='No bounces to report' />;
    }
    return <ChartGroup />;
  }

  renderCollection() {
    const { tableLoading, reasons } = this.props;

    if (tableLoading) {
      return <PanelLoading />;
    }

    if (!reasons) {
      return <Empty title={'Bounced Messages'} message={'No bounce reasons to report'} />;
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
      <Page title='Bounce Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle} />
        { this.renderChart() }
        <Panel title='Bounced Messages' className='ReasonsTable'>
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

const mapStateToProps = (state) => {
  const chartLoading = state.bounceReport.aggregatesLoading || state.bounceReport.categoriesLoading;
  const tableLoading = chartLoading || state.bounceReport.reasonsLoading;
  const aggregates = state.bounceReport.aggregates;
  return {
    filters: state.reportFilters,
    chartLoading,
    aggregates,
    totalBounces: aggregates ? aggregates.countBounce : 1,
    tableLoading,
    reasons: state.bounceReport.reasons
  };
};

const mapDispatchToProps = {
  addFilter,
  refreshBounceChartMetrics,
  refreshBounceTableMetrics,
  refreshTypeaheadCache,
  showAlert
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BouncePage));
