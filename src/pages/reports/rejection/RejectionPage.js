import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addFilters } from 'src/actions/reportOptions';
import { refreshRejectionReport } from 'src/actions/rejectionReport';
import { selectReportSearchOptions } from 'src/selectors/reportSearchOptions';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel } from '@sparkpost/matchbox';
import ReportOptions from '../components/ReportOptions';
import MetricsSummary from '../components/MetricsSummary';
import DataTable from './components/DataTable';
import { safeRate } from 'src/helpers/math';

export class RejectionPage extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshRejectionReport(this.props.reportOptions);
    }
  }

  renderCollection() {
    const { loading, list } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    return <DataTable list={list} addFilters={this.props.addFilters} />;
  }

  renderTopLevelMetrics() {
    const { aggregatesLoading, aggregates } = this.props;
    const { count_rejected, count_targeted } = aggregates;

    if (aggregatesLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={safeRate(count_rejected, count_targeted)}
        rateTitle='Rejected Rate'>
        <strong>{count_rejected.toLocaleString()}</strong> of your messages were rejected of <strong>{count_targeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { loading, searchOptions } = this.props;

    return (
      <Page title='Rejections Report'>
        <ReportOptions reportLoading={loading} searchOptions={searchOptions} />
        {this.renderTopLevelMetrics()}
        <Panel title='Rejection Reasons' className='RejectionTable'>
          {this.renderCollection()}
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.rejectionReport.aggregatesLoading || state.rejectionReport.reasonsLoading,
  aggregatesLoading: state.rejectionReport.aggregatesLoading,
  aggregates: state.rejectionReport.aggregates,
  list: state.rejectionReport.list,
  reportOptions: state.reportOptions,
  searchOptions: selectReportSearchOptions(state)
});

const mapDispatchToProps = {
  addFilters,
  refreshRejectionReport
};
export default connect(mapStateToProps, mapDispatchToProps)(RejectionPage);
