/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFilters, updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { WindowEvent, Grid, Panel, Modal, Button, Tag, Checkbox, Tooltip, TextField } from '@sparkpost/matchbox';
import { CheckboxWrapper } from 'src/components';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';

import styles from './AdvancedFilters.module.scss';

const events = [
  { name: 'delivery', tooltip: null },
  { name: 'injection', tooltip: null },
  { name: 'bounce', tooltip: null },
  { name: 'delay', tooltip: null },
  { name: 'policy_rejection', tooltip: null },
  { name: 'out_of_band', tooltip: null },
  { name: 'open', tooltip: null },
  { name: 'initial_open', tooltip: null },
  { name: 'click', tooltip: null },
  { name: 'generation_failure', tooltip: null },
  { name: 'generation_rejection', tooltip: null },
  { name: 'spam_complaint', tooltip: null },
  { name: 'list_unsubscribe', tooltip: null },
  { name: 'link_unsubscribe', tooltip: null }
];

class AdvancedFilters extends Component {
  state = {
    modalOpen: false,
    search: {
      events: {},
      friendly_froms: '',
      subaccounts: '',
      message_ids: '',
      template_ids: '',
      campaign_ids: ''
    }
  }

  componentDidMount() {
    this.syncSearchToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search !== this.state.search) {
      this.syncSearchToState(nextProps);
    }
  }

  syncSearchToState(props) {
    const events = {};

    // Converts array of events to an object
    _.forEach(props.search.events, (event) => {
      events[event] = true;
    });

    this.setState({ search: { ...props.search, events }});
  }

  parseLists = (value) => {
    value = _.trim(value, ' ,'); // strip whitespace and commas
    if (!value) {
      return [];
    }

    return value.split(',').map((item) => _.trim(item));
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  handleApply = () => {
    const { search } = this.state;
    const { dateOptions, events, ...rest } = search;
    const options = {};

    _.forEach(rest, (value, key) => options[key] = this.parseLists(value));

    this.props.updateMessageEventsSearchOptions({
      events: _.keys(_.pickBy(search.events)),
      ...options
    });
    this.toggleModal();
  }

  handleKeyDown = (e) => {
    const { modalOpen } = this.state;

    if (!modalOpen) {
      return;
    }

    if (e.key === 'Enter') {
      this.handleApply();
    }

    if (e.key === 'Escape') {
      this.toggleModal();
    }
  }

  handleCheckbox = (name) => {
    const { search } = this.state;
    this.setState({ search: { ...search, events: { ...search.events, [name]: !search.events[name] }}});
  }

  handleTextField = (e, key) => {
    const updatedSearch = {}
    updatedSearch[key] = e.target.value;
    this.setState({ search: { ...this.state.search, ...updatedSearch }});
  }

  renderEvent = ({ name, tooltip }) => {
    const checkbox = (
      <Checkbox
        id={name}
        onChange={() => this.handleCheckbox(name)}
        label={snakeToFriendly(name)}
        checked={this.state.search.events[name] || false}/>
    );

    return (
      <div className={styles.CheckWrapper} key={name}>
        {tooltip ? <Tooltip content={tooltip} dark>{checkbox}</Tooltip> : checkbox}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Button fullWidth onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen}>
          <WindowEvent event='keydown' handler={this.handleKeyDown} />
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <Checkbox.Group label='Event Type'>{events.map(this.renderEvent)}</Checkbox.Group>
            </Panel.Section>
            <Panel.Section>
              <p><small>Each of these filters accept comma-separated values.</small></p>
              <Grid>
                <Grid.Column xs={6}>
                  <TextField
                    id='friendly_froms'
                    label='From Addresses'
                    value={this.state.search.friendly_froms}
                    onChange={(e) => this.handleTextField(e, 'friendly_froms')}
                  />
                  <TextField
                    id='subaccounts'
                    label='Subaccount IDs'
                    value={this.state.search.subaccounts}
                    onChange={(e) => this.handleTextField(e, 'subaccounts')}
                  />
                  <TextField
                    id='message_ids'
                    label='Message IDs'
                    value={this.state.search.message_ids}
                    onChange={(e) => this.handleTextField(e, 'message_ids')}
                  />
                </Grid.Column>
                <Grid.Column xs={6}>
                  <TextField
                    id='template_ids'
                    label='Template IDs'
                    value={this.state.search.template_ids}
                    onChange={(e) => this.handleTextField(e, 'template_ids')}
                  />
                  <TextField
                    id='campaign_ids'
                    label='Campaign IDs'
                    value={this.state.search.campaign_ids}
                    onChange={(e) => this.handleTextField(e, 'campaign_ids')}
                  />
                </Grid.Column>
              </Grid>
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={this.handleApply}>Apply</Button>
              <Button className={styles.Cancel} onClick={this.toggleModal}>Cancel</Button>
            </Panel.Section>
          </Panel>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
    search: state.messageEvents.search
  });
export default connect(mapStateToProps, { addFilters, updateMessageEventsSearchOptions })(AdvancedFilters);
