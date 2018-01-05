import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { refreshAcceptedMetrics } from 'src/actions/acceptedChart';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { parseSearch } from 'src/helpers/reports';
import { Page } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
// import ShareModal from '../components/ShareModal';

export class AcceptedPage extends Component {
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
    this.props.refreshAcceptedMetrics(options);
    // .then(() => this.updateLink());
  }

  render() {
    return (
      <Page title='Accepted Report'>
        <Filters refresh={this.handleRefresh} onShare={() => this.handleModalToggle('shareModal')} />
      </Page>
    );
  }
}


const mapStateToProps = ({ reportFilters, acceptedReport }) => ({
  filters: reportFilters,
  accepted: acceptedReport
});

const mapDispatchToProps = {
  refreshAcceptedMetrics,
  refreshTypeaheadCache,
  addFilter
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AcceptedPage));
