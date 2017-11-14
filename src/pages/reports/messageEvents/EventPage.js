/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { getMessageHistory } from 'src/actions/messageEvents';

import { Page, Banner, Grid, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import HistoryTable from './components/HistoryTable';
import MessageDetails from './components/MessageDetails';

import _ from 'lodash';

const breadcrumbAction = {
  content: 'All Message Events',
  Component: Link,
  to: '/reports/message-events'
};

export class EventPage extends Component {
  static defaultProps = {
    messageHistory: []
  }

  state = {
    selectedId: null
  }

  componentDidMount() {
    const { messageId, getMessageHistory } = this.props;
    getMessageHistory({ messageId })
  }

  componentWillReceiveProps(nextProps) {
    const { location, history, messageHistory } = this.props;
    if (nextProps.messageHistory !== this.props.messageHistory) {

      // Saves selected event from location state and resets because location state for some reason persists bt refreshes
      // Defaults to first event in message history
      this.setState({ selectedId: location.state.selectedId || nextProps.messageHistory[0].event_id });
      history.replace({ ...location, state: {} });
    }
  }

  handleEventClick = (eventId) => {
    this.setState({ selectedId: eventId })
  }

  render() {
    const { loading, messageId, messageHistory } = this.props;
    const { selectedId } = this.state;
    const selectedEvent = _.find(messageHistory, (event) => event.event_id === selectedId)

    // TODO localize loading into these panels
    return (
      <Page title={`Message: ${messageId}`} breadcrumbAction={breadcrumbAction}>
        <Grid>
          <Grid.Column xs={6}>
            { !loading && <MessageDetails details={selectedEvent}/> }
          </Grid.Column>
          <Grid.Column xs={6}>
            { !loading && <HistoryTable messageHistory={messageHistory} selectedId={selectedId} handleEventClick={this.handleEventClick}/> }
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  // const events = selectMessageEvents(state);
  //
  return {
    loading: state.messageEvents.pending,
    messageHistory: state.messageEvents.history[props.match.params.messageId],
    messageId: props.match.params.messageId,
    eventId: props.match.params.eventId,
  };
};

export default withRouter(connect(mapStateToProps, { getMessageHistory })(EventPage));
