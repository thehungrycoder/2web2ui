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
    this.handleRefresh();
  }

  handleRefresh = () => {
    const { messageId, getMessageHistory } = this.props;
    getMessageHistory({ messageId })
  }

  componentWillReceiveProps(nextProps) {
    const { location, history, messageHistory } = this.props;
    if (nextProps.messageHistory !== this.props.messageHistory) {

      // Saves selected event from location state and resets because location state for some reason persists bt refreshes
      // Defaults to first event in message history
      const selectedId = _.get(location, 'state.selectedId') || nextProps.messageHistory[0].event_id;
      this.setState({ selectedId });
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

    if (loading) {
      return <Loading />
    }

    return (
      <Page title={`Message: ${messageId}`} breadcrumbAction={breadcrumbAction}>
        <Grid>
          <Grid.Column xs={6}>
            <MessageDetails details={selectedEvent}/>
          </Grid.Column>
          <Grid.Column xs={6}>
            <HistoryTable
              messageHistory={messageHistory}
              selectedId={selectedId}
              handleEventClick={this.handleEventClick}
              handleRefresh={this.handleRefresh}/>
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.messageEvents.pending,
  messageHistory: state.messageEvents.history[props.match.params.messageId],
  messageId: props.match.params.messageId,
  eventId: props.match.params.eventId,
});

export default withRouter(connect(mapStateToProps, { getMessageHistory })(EventPage));
