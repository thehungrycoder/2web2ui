import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getMessageHistory, getDocumentation } from 'src/actions/messageEvents';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { eventPageMSTP } from 'src/selectors/messageEvents';
import { getDetailsPath } from 'src/helpers/messageEvents';
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import HistoryTable from './components/HistoryTable';
import EventDetails from './components/EventDetails';

const breadcrumbAction = {
  content: 'All Events',
  Component: Link,
  to: '/reports/message-events'
};

export class EventPage extends Component {
  static defaultProps = {
    messageHistory: []
  }

  state = {
    shouldRedirect: false
  }

  componentDidMount() {
    this.handleRefresh();
    this.props.getDocumentation();
  }

  handleRefresh = () => {
    const { messageId, getMessageHistory, isOrphanEvent } = this.props;
    if (!isOrphanEvent) {
      getMessageHistory({ messageId });
    }
  }

  componentDidUpdate(prevProps) {
    const { messageId, match, loading, isMessageHistoryEmpty, isOrphanEvent, selectedEvent, selectedEventId } = this.props;

    if (selectedEventId && messageId && !match.params.eventId) {
      this.props.history.replace(getDetailsPath(messageId, selectedEventId));
    }

    if (prevProps.loading && !loading) { //wait until finished loading
      if ((!isOrphanEvent && isMessageHistoryEmpty) || (isOrphanEvent && !selectedEvent)) {
        this.setState({ shouldRedirect: true });
      }
    }
  }

  handleEventClick = (selectedEventId) => {
    const { history, messageId } = this.props;
    history.push(getDetailsPath(messageId, selectedEventId));
  }

  render() {
    const { isOrphanEvent, loading, messageId, messageHistory, documentation, selectedEventId, selectedEvent } = this.props;

    if (this.state.shouldRedirect) {
      const errorMessageInfo = isOrphanEvent ? `event_id # ${selectedEventId}` : `message_id # ${messageId}`;
      return (
        <RedirectAndAlert
          to="/reports/message-events"
          alert={{ type: 'warning', message: `Unable to find event(s) data with ${errorMessageInfo}` }}
        />
      );
    }

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={12} md={isOrphanEvent ? 12 : 6}>
            <EventDetails details={selectedEvent} documentation={documentation}/>
          </Grid.Column>
          {!isOrphanEvent &&
            <Grid.Column xs={12} md={6}>
              <HistoryTable
                messageHistory={messageHistory}
                selectedId={selectedEventId}
                handleEventClick={this.handleEventClick}
                handleRefresh={this.handleRefresh}/>
            </Grid.Column>
          }
        </Grid>
      );


    const title = isOrphanEvent ? `Event: ${selectedEventId}` : `Message: ${messageId}`;

    return <Page title={title} breadcrumbAction={breadcrumbAction}>{pageContent}</Page>;
  }
}

export default connect(eventPageMSTP, { getMessageHistory, getDocumentation })(EventPage);
