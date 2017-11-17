import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { getMessageHistory, getDocumentation } from 'src/actions/messageEvents';
import { selectMessageHistory, selectInitialEventId } from 'src/selectors/messageEvents';

import { Page, Grid } from '@sparkpost/matchbox';
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
    selectedEventId: null
  }

  componentDidMount() {
    this.handleRefresh();
    this.props.getDocumentation();
  }

  handleRefresh = () => {
    const { messageId, getMessageHistory } = this.props;
    getMessageHistory({ messageId });
  }

  componentWillReceiveProps({ selectedEventId }) {
    if (!this.state.selectedEventId && selectedEventId) {
      // Saves selected event from location state, defaults to first event in message history
      this.setState({ selectedEventId });

      // Resets location state
      this.props.history.replace({ ...this.props.location, state: {}});
    }
  }

  handleEventClick = (selectedEventId) => {
    this.setState({ selectedEventId });
  }

  render() {
    const { loading, messageId, messageHistory, documentation } = this.props;
    const { selectedEventId } = this.state;
    const selectedEvent = _.find(messageHistory, (event) => event.event_id === selectedEventId);

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={12} md={6}>
            <MessageDetails details={selectedEvent} documentation={documentation}/>
          </Grid.Column>
          <Grid.Column xs={12} md={6}>
            <HistoryTable
              messageHistory={messageHistory}
              selectedId={selectedEventId}
              handleEventClick={this.handleEventClick}
              handleRefresh={this.handleRefresh}/>
          </Grid.Column>
        </Grid>
      );

    return <Page title={`Message: ${messageId}`} breadcrumbAction={breadcrumbAction}>{pageContent}</Page>;
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.messageEvents.pending || state.messageEvents.documentationPending,
  messageHistory: selectMessageHistory(state, props),
  messageId: props.match.params.messageId,
  documentation: state.messageEvents.documentation,
  selectedEventId: selectInitialEventId(state, props)
});

export default withRouter(connect(mapStateToProps, { getMessageHistory, getDocumentation })(EventPage));
