import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@sparkpost/matchbox';
import styles from './ViewDetailsButton.module.scss';

export class ViewDetailsButton extends Component {
  render() {
    const { message_id, event_id } = this.props;


    const to = {
      pathname: `/reports/message-events/${message_id ? `details/${message_id}` : `event/${event_id}`}`,
      state: { selectedEventId: event_id }
    };

    return (
      <div className={styles.AlignRight}>
        <Button Component={Link} to={to} size='small' color={message_id ? 'blue' : 'orange'}>View Details</Button>
      </div>
    );
  }
}

export default ViewDetailsButton;
