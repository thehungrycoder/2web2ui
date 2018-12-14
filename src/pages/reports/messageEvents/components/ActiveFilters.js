import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Tag } from '@sparkpost/matchbox';
import { getMessageEvents, removeFilter, updateMessageEventsSearchOptions } from 'src/actions/events';
import { removeEmptyFilters } from 'src/helpers/events';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import styles from './ActiveFilters.module.scss';

export class ActiveFilters extends Component {
  static defaultProps = {
    search: {}
  };


  renderTags = () => {
    const { search } = this.props;
    const filterTypes = [
      { value: 'events', label: 'Event', itemToString: snakeToFriendly },
      { value: 'recipients', label: 'Recipient' },
      ...EVENTS_SEARCH_FILTERS
    ];
    const nonEmptyFilters = removeEmptyFilters(search);
    const nonEmptyFilterTypes = filterTypes.filter((filterType) => nonEmptyFilters[filterType.value]);
    let keyCounter = 0;
    const activeFilters = _.flatMap(nonEmptyFilterTypes,({ value, label, itemToString }) =>
      nonEmptyFilters[value].map((item) => (
        <Tag onRemove={() => this.handleRemove({ key: value, item })} key={keyCounter++} className={styles.TagWrapper}>
          {label}: {itemToString ? itemToString(item) : item}
        </Tag>
      ))
    );
    //console.log('filters', activeFilters);
    return activeFilters;
  };

  handleRemove = (filter) => {
    this.props.removeFilter(filter);
  };


  handleRemoveAll = () => {
    const { dateOptions, ...filters } = this.props.search;
    const clearedFilters = _.mapValues(filters, () => []);
    this.props.updateMessageEventsSearchOptions({ dateOptions, ...clearedFilters });
  }

  isEmpty() {
    const { dateOptions, ...rest } = this.props.search;
    return _.every(rest, (arr) => arr.length === 0);
  }

  render() {
    if (this.isEmpty()) {
      return null;
    }

    return (
      <Panel.Section actions={[{ content: 'Clear All Filters', onClick: this.handleRemoveAll, color: 'blue' }]}>
        <small>Filters: </small>
        {this.renderTags()}
      </Panel.Section>
    );
  }
}


const mapStateToProps = (state, props) => ({
  search: state.events.search
});

export default connect(mapStateToProps, { removeFilter, getMessageEvents, updateMessageEventsSearchOptions })(ActiveFilters);
