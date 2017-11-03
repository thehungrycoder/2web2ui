import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

import { refresh } from 'src/actions/bounceReport';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { getShareLink, getFilterSearchOptions, getSearch } from 'src/helpers/reports';

import { Page, Panel } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';

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
    const { location, addFilter } = this.props;
    let options = {};

    if (location.search) {
      const { from, to, filters = []} = qs.parse(location.search);

      const filtersList = typeof filters === 'string' ? [filters] : filters;

      filtersList.forEach((filter) => {
        const parts = filter.split(':');
        const type = parts.shift();
        const value = parts.join(':');
        addFilter({ value, type });
      });

      options = {
        from: new Date(from),
        to: new Date(to)
      };
    }

    return options;
  }

  handleRefresh = (options) => {
    this.props.refresh(options).then(() => this.updateLink());
  }

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;

    const options = getFilterSearchOptions(filters);
    const link = getShareLink(options);
    const search = getSearch(options);

    this.setState({ link });
    history.replace({ pathname: '/reports/bounce', search });
  }

  render() {
    const { loading, aggregates } = this.props;
    const { modal, link } = this.state;

    const pageContent = !loading && aggregates && aggregates.countBounce === 0
      ? <Panel sectioned><h6>No bounces to report.</h6></Panel> // TODO
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
  refresh,
  refreshTypeaheadCache,
  addFilter
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BouncePage));
