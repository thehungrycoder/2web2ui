import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addFilters } from 'src/actions/reportOptions';
import { refreshRejectionReport } from 'src/actions/rejectionReport';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel } from '@sparkpost/matchbox';
import ReportOptions from '../components/ReportOptions';
import MetricsSummary from '../components/MetricsSummary';
import DataTable from './components/DataTable';
import { getRate } from 'src/helpers/metrics';

export class RejectionPage extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshRejectionReport(nextProps.reportOptions);
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
        rateValue={getRate(count_rejected, count_targeted)}
        rateTitle='Rejected Rate'>
        <strong>{count_rejected.toLocaleString()}</strong> of your messages were rejected of <strong>{count_targeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <Page title='Rejections Report'>
        <ReportOptions reportLoading={loading} />
        {this.renderTopLevelMetrics()}
        <Panel title='Rejection Reasons' className='RejectionTable'>
          {this.renderCollection()}
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ reportOptions, rejectionReport }) => ({
  loading: rejectionReport.aggregatesLoading || rejectionReport.reasonsLoading,
  aggregatesLoading: rejectionReport.aggregatesLoading,
  aggregates: rejectionReport.aggregates,
  list: rejectionReport.list,
  reportOptions
});

const mapDispatchToProps = {
  addFilters,
  refreshRejectionReport
};
export default connect(mapStateToProps, mapDispatchToProps)(RejectionPage);
