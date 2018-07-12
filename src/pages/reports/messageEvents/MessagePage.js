import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getMessageHistory, getDocumentation } from 'src/actions/messageEvents';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { isMessageHistoryEmpty, selectMessageHistory, selectInitialEventId } from 'src/selectors/messageEvents';

import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import HistoryTable from './components/HistoryTable';
import EventDetails from './components/EventDetails';

import _ from 'lodash';

const breadcrumbAction = {
  content: 'All Message Events',
  Component: Link,
  to: '/reports/message-events'
};

export class MessagePage extends Component {
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
    const { messageId, match } = this.props;
    if (selectedEventId && messageId && !match.params.eventId) {
      this.props.history.push(`/reports/message-events/details/${messageId}/${selectedEventId}`); //TODO abstract path creation
    }
  }

  handleEventClick = (selectedEventId) => {
    const { history, messageId } = this.props;
    const path = `/reports/message-events/details/${messageId ? `${messageId}/${selectedEventId}` : `<unknown>/${selectedEventId}`}`; //TODO abstract this path generation here and in ViewDetailsButton component
    history.push(path); //TODO decide whether it should replace instead of push!
  }

  render() {
    const { isMessageHistoryEmpty, loading, messageId, messageHistory, documentation, selectedEventId } = this.props;
    const selectedEvent = _.find(messageHistory, (event) => event.event_id === selectedEventId);

    if (isMessageHistoryEmpty) {
      return (
        <RedirectAndAlert
          to="/reports/message-events"
          alert={{ type: 'warning', message: `Unable to find message events for ${messageId}` }}
        />
      );
    }

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={12} md={6}>
            <EventDetails details={selectedEvent} documentation={documentation}/>
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
  isMessageHistoryEmpty: isMessageHistoryEmpty(state, props),
  loading: state.messageEvents.historyLoading || state.messageEvents.documentationLoading,
  messageHistory: selectMessageHistory(state, props),
  messageId: props.match.params.messageId,
  documentation: state.messageEvents.documentation,
  selectedEventId: selectInitialEventId(state, props)
});

export default connect(mapStateToProps, { getMessageHistory, getDocumentation })(MessagePage);
