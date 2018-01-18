/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import _ from 'lodash';

import { refreshBounceChartMetrics, refreshBounceTableMetrics } from 'src/actions/bounceReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { Percent } from 'src/components/formatters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';
import MetricsSummary from '../components/MetricsSummary';

const columns = [
  { label: 'Reason', width: '45%', sortKey: 'reason' },
  { label: 'Domain', sortKey: 'domain' },
  { label: 'Category', sortKey: 'bounce_category_name' },
  { label: 'Classification', sortKey: 'classification_id' },
  { label: 'Count (%)', sortKey: 'count_bounce' }
];

export class BouncePage extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  /**
   * takes qp's and dispatches filters being added
   * Note: this has to be done in page because Redux is wired
   * and not in the helper
   */
  parseSearch() {
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      filters.forEach(this.props.addFilter);
    }

    return options;
  }

  handleRefresh = (options) => Promise.all([
    this.props.refreshBounceChartMetrics(options),
    this.props.refreshBounceTableMetrics(options)
  ])
    .then(() => this.updateLink())
    .catch((err) => {
      this.props.showAlert({ type: 'error', message: 'Unable to refresh bounce report.', details: err.message });
    })

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const query = getFilterSearchOptions(filters);
    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
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
    if (!chartLoading && _.isEmpty(aggregates)) {
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
      sortColumn='count_bounce'
      sortDirection='desc'
      pagination={true}
    />;
  }

  renderTopLevelMetrics() {
    const { chartLoading, aggregates, filters } = this.props;
    const { countBounce, countTargeted } = aggregates;

    // Aggregates aren't ready until chart refreshes
    if (chartLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={(countBounce / countTargeted) * 100}
        rateTitle='Bounce Rate'
        {...filters} >
        <strong>{countBounce.toLocaleString()}</strong> of your messages were bounced of <strong>{countTargeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { modal, query } = this.state;
    const { chartLoading } = this.props;

    return (
      <Page title='Bounce Report'>
        <Filters
          refresh={this.handleRefresh}
          onShare={this.handleModalToggle}
          shareDisabled={chartLoading}
        />
        { this.renderTopLevelMetrics() }
        { this.renderChart() }
        <Panel title='Bounced Messages' className='ReasonsTable'>
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
