import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateMessageEventsSearchOptions, getDocumentation } from 'src/actions/messageEvents';
import { selectMessageEventListing } from 'src/selectors/eventListing';
import { WindowEvent, Panel, Modal, Button } from '@sparkpost/matchbox';
import { stringToArray } from 'src/helpers/string';
import { onEnter, onEscape } from 'src/helpers/keyEvents';
import _ from 'lodash';

import EventTypeFilters from './EventTypeFilters';
import TextFilters from './TextFilters';

import styles from './AdvancedFilters.module.scss';

export class AdvancedFilters extends Component {
  state = {
    modalOpen: false,
    search: {
      events: {},
      friendly_froms: '',
      message_ids: '',
      subaccounts: '',
      template_ids: '',
      campaign_ids: '',
      bounce_classes: ''
    }
  }

  componentDidMount() {
    this.props.getDocumentation();
    this.syncSearchToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.props.search) {
      this.syncSearchToState(nextProps); // Updates form values if a filter is removed from ActiveFilters
    }
  }

  syncSearchToState(props) {
    const events = {};

    // Converts event array into booleans for checkboxes
    _.forEach(props.search.events, (event) => {
      events[event] = true;
    });

    this.setState({ search: { ...props.search, events }});
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  handleApply = () => {
    const { search } = this.state;
    const { dateOptions, events, ...rest } = search;
    const options = {};

    _.forEach(rest, (value, key) => options[key] = stringToArray(value));

    this.props.updateMessageEventsSearchOptions({ events: _.keys(_.pickBy(search.events)), ...options });
    this.toggleModal();
  }

  handleKeyDown = (e) => {
    const { modalOpen } = this.state;

    if (!modalOpen) {
      return;
    }

    onEnter(this.handleApply)(e);
    onEscape(this.toggleModal)(e);
  }

  handleCheckbox = (event) => {
    const { search } = this.state;
    this.setState({ search: { ...search, events: { ...search.events, [event]: !search.events[event] }}});
  }

  handleTextField = (e, key) => {
    const updatedSearch = {};
    updatedSearch[key] = e.target.value;
    this.setState({ search: { ...this.state.search, ...updatedSearch }});
  }

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen} onClose={this.toggleModal}>
          <WindowEvent event='keydown' handler={this.handleKeyDown} />
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <EventTypeFilters
                eventTypes={this.props.eventListing}
                checkedTypes={this.state.search.events}
                onChange={this.handleCheckbox}
              />
            </Panel.Section>
            <Panel.Section>
              <TextFilters filterValues={this.state.search} onChange={this.handleTextField} />
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={this.handleApply}>Apply Filters</Button>
              <Button className={styles.Cancel} onClick={this.toggleModal}>Cancel</Button>
            </Panel.Section>
          </Panel>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  search: state.messageEvents.search,
  eventListing: selectMessageEventListing(state)
});
export default connect(mapStateToProps, { updateMessageEventsSearchOptions, getDocumentation })(AdvancedFilters);
