import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateMessageEventsSearchOptions, getDocumentation } from 'src/actions/events';
import { selectEventsListing } from 'src/selectors/eventListing';
import { WindowEvent, Panel, Modal, Button } from '@sparkpost/matchbox';
import { onEnter, onEscape } from 'src/helpers/keyEvents';
import _ from 'lodash';
import EventTypeFilters from './EventTypeFilters';
import TextFilters from './TextFilters';

import styles from './AdvancedFilters.module.scss';
import { AddCircleOutline } from '@sparkpost/matchbox-icons';

export class AdvancedFilters extends Component {
  state = {
    modalOpen: false,
    search: {
      events: {},
      searchQueries: []
    }
  };

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
    const search = { events, searchQueries: props.search.searchQueries };
    this.setState({ search });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  checkErrors = () =>
    //implement later
    false
  ;

  handleApply = () => {
    const { search } = this.state;
    const { events, searchQueries } = search;
    if (this.checkErrors()) {
      return;
    }
    this.props.updateMessageEventsSearchOptions({ events: _.keys(_.pickBy(events)), searchQueries });
    this.toggleModal();
  };

  handleKeyDown = (e) => {
    const { modalOpen } = this.state;

    if (!modalOpen) {
      return;
    }

    onEnter(this.handleApply)(e);
    onEscape(this.toggleModal)(e);
  };

  handleCheckbox = (event) => {
    const { search } = this.state;
    this.setState({ search: { ...search, events: { ...search.events, [event]: !search.events[event] }}});
  };

  handleTextField = (e, index) => {
    const searchQueries = _.cloneDeep(this.state.search.searchQueries);
    searchQueries[index].value = e.target.value;
    this.setState({ search: { ...this.state.search, searchQueries }});
  };

  handleSelector = (e, index) => {
    const searchQueries = _.cloneDeep(this.state.search.searchQueries);
    searchQueries[index].key = e.target.value;
    this.setState({ search: { ...this.state.search, searchQueries }});
  };

  handleAdd = () => {
    const { searchQueries } = this.state.search;
    const addedQuery = ({ key: 'recipient_domains', value: '', error: null });
    this.setState({ search: { ...this.state.search, searchQueries: [...searchQueries, addedQuery]}});
  };

  handleDelete = (e, index) => {
    const { searchQueries: tempFilters } = this.state.search;
    tempFilters.splice(index,1);
    this.setState({ search: { ...this.state.search, searchQueries: tempFilters }});
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen} onClose={this.toggleModal}>
          <WindowEvent event='keydown' handler={this.handleKeyDown} />
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <EventTypeFilters
                eventTypeDocs={this.props.eventListing}
                checkedTypes={this.state.search.events}
                onChange={this.handleCheckbox}
              />
            </Panel.Section>
            <Panel.Section>
              <p>
                <Button color="blue" flat onClick={this.handleAdd}> Add Filter <AddCircleOutline/></Button>
              </p>
              <TextFilters filterValues={this.state.search} onSelect={this.handleSelector} onChange={this.handleTextField} onDelete={this.handleDelete} />
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
  search: state.events.search,
  eventListing: selectEventsListing(state)
});
export default connect(mapStateToProps, { updateMessageEventsSearchOptions, getDocumentation })(AdvancedFilters);
