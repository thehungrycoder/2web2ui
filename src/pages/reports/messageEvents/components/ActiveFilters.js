import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Tag } from '@sparkpost/matchbox';
import { getMessageEvents, removeFilter, updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { removeEmptyFilters, getFiltersAsArray } from 'src/helpers/messageEvents';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';
import styles from './ActiveFilters.module.scss';

const filterTypes = [
  { value: 'events', label: 'Event', itemToString: snakeToFriendly },
  { value: 'recipients', label: 'Recipient' },
  ...getFiltersAsArray()
];

export class ActiveFilters extends Component {

  renderTags = () => {
    const { search } = this.props;
    const nonEmptyFilters = removeEmptyFilters(search);
    const nonEmptyFilterTypes = filterTypes.filter((filterType) => nonEmptyFilters[filterType.value]);
    const activeFilters = _.flatMap(nonEmptyFilterTypes,({ value, label, itemToString }, typeIndex) =>
      nonEmptyFilters[value].map((item, valueIndex) => (
        <Tag onRemove={() => this.handleRemove({ key: value, item })} key={`${typeIndex}-${valueIndex}`} className={styles.TagWrapper}>
          {label}: {itemToString ? itemToString(item) : item}
        </Tag>
      ))
    );
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


const mapStateToProps = (state) => ({
  search: state.messageEvents.search
});

export default connect(mapStateToProps, { removeFilter, getMessageEvents, updateMessageEventsSearchOptions })(ActiveFilters);
