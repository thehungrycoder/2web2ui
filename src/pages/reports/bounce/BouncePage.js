/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { refresh } from 'src/actions/bounceReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import { showAlert } from 'src/actions/globalAlert';

import { Page } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';
import Empty from './components/Empty';

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
    this.props.refresh(options)
      .then(() => this.updateLink())
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

  render() {
    const { loading, aggregates } = this.props;
    const { modal, link } = this.state;

    const pageContent = !loading && !aggregates
      ? <Empty/>
      : <ChartGroup />;

    return (
      <Page title='Bounce Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle} />
        { pageContent }
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          link={link} />
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  filters: state.reportFilters,
  loading: state.bounceReport.aggregatesLoading || state.bounceReport.categoriesLoading,
  aggregates: state.bounceReport.aggregates
});

const mapDispatchToProps = {
  addFilter,
  refresh,
  refreshTypeaheadCache,
  showAlert
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BouncePage));
