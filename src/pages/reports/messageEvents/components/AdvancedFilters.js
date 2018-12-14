import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { formValueSelector, getFormSyncErrors } from 'redux-form';
import { updateMessageEventsSearchOptions, getDocumentation } from 'src/actions/events';
import { selectEventsListing } from 'src/selectors/eventListing';
import { WindowEvent, Panel, Modal, Button } from '@sparkpost/matchbox';
import { onEnter, onEscape } from 'src/helpers/keyEvents';
import { getFiltersFromSearchQueries } from 'src/helpers/events';
import _ from 'lodash';
import EventTypeFilters from './EventTypeFilters';
import QueryFilters from './QueryFilters';
import styles from './AdvancedFilters.module.scss';

export class AdvancedFilters extends Component {
  state = {
    modalOpen: false,
    clickedApply: false,
    search: {
      events: {}
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
    const search = { events };
    this.setState({ search });
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };


  handleApply = () => {
    const { search: { events }, clickedApply } = this.state;
    const { reduxFieldSearchQueries, errors: { searchQuery: searchQueryErrors }} = this.props;
    if (_.some(searchQueryErrors, (error) => !_.isEmpty(error))) {
      this.setState({ clickedApply: !clickedApply }); //The QueryFilters listens on changes to clickedApply
      return;
    }
    const filters = getFiltersFromSearchQueries(reduxFieldSearchQueries);
    this.props.updateMessageEventsSearchOptions({ events: _.keys(_.pickBy(events)), ...filters });
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
              <QueryFilters clickedApply = {this.state.clickedApply}/>
            </Panel.Section>
            <Panel.Section>
              <Button primary onClick={this.handleApply} >Apply Filters</Button>
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
  eventListing: selectEventsListing(state),
  reduxFieldSearchQueries: formValueSelector('SearchQueryForm')(state, 'searchQuery'),
  errors: getFormSyncErrors('SearchQueryForm')(state)
});
export default connect(mapStateToProps, { updateMessageEventsSearchOptions, getDocumentation })(AdvancedFilters);
