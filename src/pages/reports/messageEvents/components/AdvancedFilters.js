import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { WindowEvent, Panel, Modal, Button, Checkbox, TextField } from '@sparkpost/matchbox';
import { snakeToFriendly, stringToArray } from 'src/helpers/string';
import { onEnter, onEscape } from 'src/helpers/keyEvents';
import _ from 'lodash';

import { EVENT_FILTERS, TEXT_FILTERS } from './searchConfig';
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

  renderEvent = (event) => (
    <div className={styles.CheckWrapper} key={event}>
      <Checkbox
        id={event}
        onChange={() => this.handleCheckbox(event)}
        label={snakeToFriendly(event)}
        checked={this.state.search.events[event] || false} />
    </div>
  );

  renderFilter = ({ key, ...rest }) => (
    <div className={styles.FieldWrapper} key={key}>
      <TextField
        id={key}
        value={this.state.search[key]}
        onChange={(e) => this.handleTextField(e, key)}
        {...rest} />
    </div>
  );

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen} onClose={this.toggleModal}>
          <WindowEvent event='keydown' handler={this.handleKeyDown} />
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <Checkbox.Group label='Event Type'>{EVENT_FILTERS.map(this.renderEvent)}</Checkbox.Group>
            </Panel.Section>
            <Panel.Section>
              <p><small>Each of these filters accept comma-separated values.</small></p>
              {TEXT_FILTERS.map(this.renderFilter)}
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

const mapStateToProps = (state, props) => ({ search: state.messageEvents.search });
export default connect(mapStateToProps, { updateMessageEventsSearchOptions })(AdvancedFilters);
