/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Tag } from '@sparkpost/matchbox';
import { getMessageEvents, removeFilter } from 'src/actions/messageEvents';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';

export class ActiveFilters extends Component {
  static defaultProps = {
    search: {}
  };

  renderTags = ({ key, label, itemToString }) => {
    const { search } = this.props;

    if (!search[key]) {
      return null;
    }

    return search[key].map((item) => (
      <Tag onRemove={() => this.handleRemove({ key, item })} key={item}>
        {label}: {itemToString ? itemToString(item) : item}
      </Tag>
    ));
  }

  handleRemove = (filter) => {
    this.props.removeFilter(filter);
  }

  render() {
    const { recipients, events } = this.props.search;

    if (!recipients.length && !events.length) {
      return null;
    }

    return (
      <Panel.Section>
        <small>Filters: </small>
        {this.renderTags({ key: 'recipients', label: 'Recipient' })}
        {this.renderTags({ key: 'events', label: 'Event', itemToString: snakeToFriendly })}
      </Panel.Section>
    );
  }
}

const mapStateToProps = (state, props) => ({
  search: state.messageEvents.search
});

export default connect(mapStateToProps, { removeFilter, getMessageEvents })(ActiveFilters);
