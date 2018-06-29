import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getMessageHistory, getDocumentation } from 'src/actions/messageEvents';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';
import { getEventIdParam, selectCurrentEvent } from 'src/selectors/messageEvents';

import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import EventDetails from './components/EventDetails';

const breadcrumbAction = {
  content: 'All Message Events',
  Component: Link,
  to: '/reports/message-events'
};

export class EventPage extends Component {
  componentDidMount() {
    this.props.getDocumentation();
  }

  render() {
    const { loading, selectedEventId, selectedEvent, documentation } = this.props;

    if (!loading && !selectedEvent) {
      return (
        <RedirectAndAlert
          to="/reports/message-events"
          alert={{ type: 'warning', message: `Unable to find message events for event#${selectedEventId}` }}
        />
      );
    }

    const pageContent = loading
      ? <Loading />
      : (
        <Grid>
          <Grid.Column xs={12} md={12}>
            <EventDetails details={selectedEvent} documentation={documentation}/>
          </Grid.Column>
        </Grid>
      );

    return <Page title={`Event: ${selectedEvent.event_id}`} breadcrumbAction={breadcrumbAction}>{pageContent}</Page>;
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.messageEvents.historyLoading || state.messageEvents.documentationLoading,
  documentation: state.messageEvents.documentation,
  selectedEvent: selectCurrentEvent(state, props),
  selectedEventId: getEventIdParam(state, props)
});

export default connect(mapStateToProps, { getMessageHistory, getDocumentation })(EventPage);
