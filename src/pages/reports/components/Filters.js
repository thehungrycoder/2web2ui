import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { addFilters, removeFilter, refreshReportOptions, initTypeaheadCache } from 'src/actions/reportFilters';
import ShareModal from './ShareModal';
import { parseSearch, getReportSearchOptions } from 'src/helpers/reports';
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
    // initial report load
    const { options, filters = []} = parseSearch(this.props.location.search);
    this.props.addFilters(filters);
    this.props.refreshReportOptions(options);

    // initial typeahead cache load
    this.props.initTypeaheadCache();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.filters !== this.props.filters) {
      this.updateLink();
    }
  }

  updateLink = () => {
    const { filters, history, location, extraLinkParams = []} = this.props;
    const query = getReportSearchOptions(filters, extraLinkParams);
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
                <DateFilter reportLoading={reportLoading} />
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
  refreshReportOptions,
  showAlert,
  initTypeaheadCache
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filters));
