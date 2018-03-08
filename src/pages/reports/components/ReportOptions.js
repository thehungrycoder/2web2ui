import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { addFilters, removeFilter, refreshReportOptions, refreshTypeaheadCache, initTypeaheadCache } from 'src/actions/reportOptions';
import ShareModal from './ShareModal';
import { parseSearch, getReportSearchOptions } from 'src/helpers/reports';
import { Grid, Button, Panel, Tag } from '@sparkpost/matchbox';
import Typeahead from './Typeahead';
import DatePicker from 'src/components/datePicker/DatePicker';
import typeaheadCacheSelector from 'src/selectors/reportFilterTypeaheadCache';
import { showAlert } from 'src/actions/globalAlert';
import { isSameDate } from 'src/helpers/date';
import styles from './ReportOptions.module.scss';

const RELATIVE_DATE_OPTIONS = [
  'hour',
  'day',
  '7days',
  '30days',
  '90days',
  'custom'
];

// TODO: separate the share modal / link update logic out of this component
export class ReportOptions extends Component {
  state = {
    modal: false,
    query: {}
  }

  componentDidMount() {
    const { options, filters = []} = parseSearch(this.props.location.search);
    this.props.addFilters(filters);
    this.props.refreshReportOptions(options);

    // initial typeahead cache load
    this.props.initTypeaheadCache();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportOptions !== this.props.reportOptions) {
      this.updateLink();
      this.maybeRefreshFilterTypeaheadCache(prevProps.reportOptions);
    }
  }

  maybeRefreshFilterTypeaheadCache(prev) {
    const current = this.props.reportOptions;
    const datesAreDifferent = !isSameDate(prev.from, current.from) || !isSameDate(prev.to, current.to);
    const rangesAreDifferent = prev.relativeRange !== current.relativeRange;

    if (rangesAreDifferent || (current.relativeRange === 'custom' && datesAreDifferent)) {
      this.props.refreshTypeaheadCache(current);
    }
  }

  // TODO move this and the share modal to their own component
  updateLink = () => {
    const { reportOptions, history, location, extraLinkParams = []} = this.props;
    const query = getReportSearchOptions(reportOptions, extraLinkParams);
    const search = qs.stringify(query, { encode: false });

    this.setState({ query });
    history.replace({ pathname: location.pathname, search });
  }

  renderActiveFilters = () => {
    const { reportOptions } = this.props;
    return reportOptions.filters.length
      ? <Panel.Section>
        <small>Filters:</small>
        { reportOptions.filters.map((item, index) => <Tag key={index} onRemove={() => this.handleFilterRemove(index)} className={styles.TagWrapper}>{ item.type }: { item.value }</Tag>)}
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
    const { typeaheadCache, reportOptions, reportLoading, refreshReportOptions } = this.props;
    const { query, modal } = this.state;

    return (
      <Panel>
        <Panel.Section >
          <Grid>
            <Grid.Column xs={12} md={6}>
              <div className={styles.FieldWrapper}>
                <DatePicker
                  {...reportOptions}
                  relativeDateOptions={RELATIVE_DATE_OPTIONS}
                  disabled={reportLoading}
                  onChange={refreshReportOptions}
                />
              </div>
            </Grid.Column>
            <Grid.Column xs={8} md={4} xl={5}>
              <Typeahead
                placeholder='Filter by domain, campaign, etc'
                onSelect={this.handleTypeaheadSelect}
                items={typeaheadCache}
                selected={reportOptions.filters}
              />
            </Grid.Column>
            <Grid.Column xs={4} md={2} xl={1}>
              <Button id='shareModalButton' disabled={reportLoading} fullWidth onClick={this.toggleShareModal}>Share</Button>
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
  reportOptions: state.reportOptions,
  typeaheadCache: typeaheadCacheSelector(state)
});
const mapDispatchToProps = {
  addFilters,
  removeFilter,
  refreshReportOptions,
  showAlert,
  initTypeaheadCache,
  refreshTypeaheadCache
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportOptions));
