import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { refreshAcceptedMetrics } from 'src/actions/acceptedChart';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';

import { Empty } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';
import ShareModal from '../components/ShareModal';

export class AcceptedPage extends Component {
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
    const { refreshAcceptedMetrics, showAlert } = this.props;

    return refreshAcceptedMetrics(options)
      .then(() => this.updateLink())
      .catch((err) => {
        showAlert({ type: 'error', message: 'Unable to refresh report.', details: err.message });
      });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const options = getFilterSearchOptions(filters);
    const { link, search } = getShareLink(options);

    this.setState({ link });
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
    const { modal, link } = this.state;

    return (
      <Page title='Accepted Report'>
        <Filters refresh={this.handleRefresh} onShare={() => this.handleModalToggle('shareModal')} />
        {this.renderChart()}
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          link={link} />
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
