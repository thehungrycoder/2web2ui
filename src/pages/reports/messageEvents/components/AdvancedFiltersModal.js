import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateMessageEventsSearchOptions, getDocumentation } from 'src/actions/events';
import { WindowEvent, Modal, Button } from '@sparkpost/matchbox';
import { onEscape } from 'src/helpers/keyEvents';
import { getFiltersFromSearchQueries } from 'src/helpers/events';
import _ from 'lodash';
import SearchForm from './SearchForm';

export class AdvancedFiltersModal extends Component {
  state = {
    modalOpen: false
  };

  componentDidMount() {
    this.props.getDocumentation();
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  handleApply = (values) => {
    const { searchQuery, ...events } = values;
    const filters = getFiltersFromSearchQueries(searchQuery);
    this.props.updateMessageEventsSearchOptions({ events: _.keys(_.pickBy(events)), ...filters });
    this.toggleModal();
  };

  handleKeyDown = (e) => {
    const { modalOpen } = this.state;
    if (!modalOpen) {
      return;
    }
    onEscape(this.toggleModal)(e);
  };


  render() {
    return (
      <Fragment>
        <Button onClick={this.toggleModal}>More Filters</Button>
        <Modal open={this.state.modalOpen} onClose={this.toggleModal}>
          <WindowEvent event='keydown' handler={this.handleKeyDown} />
          <SearchForm handleApply = {this.handleApply} handleCancel = {this.toggleModal} />
        </Modal>
      </Fragment>
    );
  }
}


export default connect(null, { updateMessageEventsSearchOptions, getDocumentation })(AdvancedFiltersModal);
