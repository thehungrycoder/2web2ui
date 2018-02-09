import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as reportFilterActions from 'src/actions/reportFilters';
import { getFilterSearchOptions, parseSearch } from 'src/helpers/reports';
import Filters from '../../components/Filters';
import ShareModal from '../../components/ShareModal';

export class EngagementFilters extends Component {
  static defaultProps = {
    shareDisabled: false
  }

  state = {
    open: false
  }

  componentDidMount() {
    const { filters = [], options: range } = parseSearch(this.props.location.search);

    // hydrate store with filters and range from query string before onLoad
    this.props.addFilters(filters);
    this.props.refreshRelativeRange(range);
    this.props.onLoad();
    this.props.initTypeaheadCache(); // this should wait until after onLoad
  }

  // This event handler is called on every date range and filter change, however only the next
  // date range is provided.  The Filters component handles updating the store with the next
  // filters.  Therefore, this handler only has to update the store with the next date range
  // then call onLoad to update the chart/table data.
  onFilterChange = (nextRange) => {
    this.props.refreshRelativeRange(nextRange);
    this.props.onLoad();
  }

  onToggleShareModal = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const query = getFilterSearchOptions(this.props.filters);

    return (
      <div>
        <Filters
          refresh={this.onFilterChange}
          onShare={this.onToggleShareModal}
          shareDisabled={this.props.shareDisabled}
        />
        <ShareModal
          open={this.state.open}
          handleToggle={this.onToggleShareModal}
          query={query}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.reportFilters
});
const mapDispatchToProps = { ...reportFilterActions };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementFilters));
