import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button } from '@sparkpost/matchbox';


export class ViewDetailsButton extends Component {
  handleDetailClick = ({ message_id, event_id }) => {
    const { history } = this.props;
    history.push({
      pathname: `/reports/message-events/details/${message_id}`,
      state: { selectedEventId: event_id }
    });
  };

  render() {
    const { message_id, event_id } = this.props;

    if (!message_id) {
      return null;
    }

    return (<div style={{ textAlign: 'right' }}>
      <Button onClick={() => this.handleDetailClick({ message_id, event_id })} size='small'>View Details</Button>
    </div>);
  }
}

export default withRouter(connect()(ViewDetailsButton));
