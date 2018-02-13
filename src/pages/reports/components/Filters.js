import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { addFilters, removeFilter, refreshReportRange, initTypeaheadCache } from 'src/actions/reportFilters';
import ShareModal from './ShareModal';
import { parseSearch, getFilterSearchOptions } from 'src/helpers/reports';
import { Grid, Button, Panel, Tag } from '@sparkpost/matchbox';
import Typeahead from './Typeahead';
import DateFilter from './DateFilter';
import typeaheadCacheSelector from 'src/selectors/reportFilterTypeaheadCache';
import { showAlert } from 'src/actions/globalAlert';
import styles from './Filters.module.scss';

export class Filters extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    this._mounted = true;

    // initial report load
    const { options, filters = []} = parseSearch(this.props.location.search);
    this.props.addFilters(filters);
    this.refreshReport(options);

    this.props.refreshReportRange(options);

    // initial typeahead cache load
    this.props.initTypeaheadCache();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(oldProps) {
    let shouldRefresh = false;
    let refreshOptions = {};

    if (oldProps.filters.activeList !== this.props.filters.activeList) {
      shouldRefresh = true;
    }

    // TODO: figure out how to better handle summary custom refresh logic
    if (oldProps.dynamicMetrics.join('') !== this.props.dynamicMetrics.join('')) {
      shouldRefresh = true;
      refreshOptions = { metrics: this.props.dynamicMetrics };
    }

    shouldRefresh && this.refreshReport(refreshOptions);
  }

  // TODO: stop refreshing reports here, instead refresh report range and
  // let reports listen for range/filter changes and refresh themselves
  refreshReport = (options) => {
    this.props.refresh(options)
      .then(
        this.updateLink,
        (err) => this._mounted && this.props.showAlert({
          type: 'error',
          message: 'Unable to refresh report',
          details: err.message
        })
      );
  }

  updateLink = () => {
    if (!this._mounted) {
      return;
    }
    const { filters, dynamicMetrics, history, location } = this.props;
    const query = getFilterSearchOptions(filters);

    // TODO: figure out how to better handle summary custom refresh logic
    if (Array.isArray(dynamicMetrics) && dynamicMetrics.length > 0) {
      query.metrics = dynamicMetrics;
    }

    const search = qs.stringify(query, { encode: false });
    this.setState({ query });
    history.replace({ pathname: location.pathname, search });
  }

  renderActiveFilters = () => {
    const { filters } = this.props;
    return filters.activeList.length
      ? <Panel.Section>
        <small>Filters:</small>
        { filters.activeList.map((item, index) => <Tag key={index} onRemove={() => this.handleFilterRemove(index)} className={styles.TagWrapper}>{ item.type }: { item.value }</Tag>)}
      </Panel.Section>
      : null;
  }

  handleFilterRemove = (index) => {
    this.props.removeFilter(index);
  }

  handleTypeaheadSelect = (item) => {
    this.props.addFilters([item]);
  }

  toggleShareModal = () => {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    const { typeaheadCache, filters, reportLoading } = this.props;
    const { query, modal } = this.state;

    return (
      <Panel>
        <Panel.Section >
          <Grid>
            <Grid.Column xs={12} md={6}>
              <div className={styles.FieldWrapper}>
                <DateFilter refresh={this.refreshReport} />
              </div>
            </Grid.Column>
            <Grid.Column xs={8} md={4} xl={5}>
              <Typeahead
                placeholder='Filter by domain, campaign, etc'
                onSelect={this.handleTypeaheadSelect}
                items={typeaheadCache}
                selected={filters.activeList}
              />
            </Grid.Column>
            <Grid.Column xs={4} md={2} xl={1}>
              <Button disabled={reportLoading} fullWidth onClick={this.toggleShareModal}>Share</Button>
            </Grid.Column>
          </Grid>
        </Panel.Section>
        {this.renderActiveFilters()}
        <ShareModal
          open={modal}
          handleToggle={this.toggleShareModal}
          query={query} />
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  filters: state.reportFilters,
  typeaheadCache: typeaheadCacheSelector(state)
});
const mapDispatchToProps = {
  addFilters,
  removeFilter,
  refreshReportRange,
  showAlert,
  initTypeaheadCache
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filters));
