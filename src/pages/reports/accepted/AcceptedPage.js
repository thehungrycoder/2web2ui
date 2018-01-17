import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { refreshAcceptedMetrics } from 'src/actions/acceptedReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Empty } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';
import ShareModal from '../components/ShareModal';

export class AcceptedPage extends Component {
  state = {
    modal: false,
    query: {}
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
    const { refreshAcceptedMetrics, showAlert } = this.props;

    return refreshAcceptedMetrics(options)
      .then(() => this.updateLink())
      .catch((err) => {
        showAlert({ type: 'error', message: 'Unable to refresh report.', details: err.message });
      });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const query = getFilterSearchOptions(filters);
    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
    history.replace({ pathname: '/reports/accepted', search });
  }

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  renderChart() {
    const { chartLoading, aggregates } = this.props;

    if (!chartLoading && !aggregates) {
      return <Empty title='Accepted Rates' message='No Accepted Messages To Report' />;
    }

    return <ChartGroup loading={chartLoading} />;
  }

  render() {
    const { modal, query } = this.state;

    return (
      <Page title='Accepted Report'>
        <Filters refresh={this.handleRefresh} onShare={() => this.handleModalToggle('shareModal')} />
        {this.renderChart()}
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          query={query} />
      </Page>
    );
  }
}


const mapStateToProps = ({ reportFilters, acceptedReport }) => ({
  filters: reportFilters,
  attempts: acceptedReport.attempts,
  aggregates: acceptedReport.aggregates,
  chartLoading: acceptedReport.aggregatesLoading || acceptedReport.attemptsLoading
});

const mapDispatchToProps = {
  refreshAcceptedMetrics,
  refreshTypeaheadCache,
  addFilter,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AcceptedPage));
