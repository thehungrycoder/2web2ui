import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { addFilters } from 'src/actions/reportFilters';
import { refreshRejectionReport } from 'src/actions/rejectionReport';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, Panel } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import MetricsSummary from '../components/MetricsSummary';
import DataTable from './components/DataTable';

export class RejectionPage extends Component {
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
        rateValue={(count_rejected / count_targeted) * 100}
        rateTitle='Rejected Rate'>
        <strong>{count_rejected.toLocaleString()}</strong> of your messages were rejected of <strong>{count_targeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { loading, refreshRejectionReport } = this.props;

    return (
      <Page title='Rejections Report'>
        <Filters
          refresh={refreshRejectionReport}
          shareDisabled={loading}
        />
        { this.renderTopLevelMetrics() }
        <Panel title='Rejection Reasons' className='RejectionTable'>
          { this.renderCollection() }
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ reportFilters, rejectionReport }) => ({
  loading: rejectionReport.aggregatesLoading || rejectionReport.reasonsLoading,
  aggregatesLoading: rejectionReport.aggregatesLoading,
  aggregates: rejectionReport.aggregates,
  list: rejectionReport.list
});

const mapDispatchToProps = {
  addFilters,
  refreshRejectionReport
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RejectionPage));
