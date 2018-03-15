import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@sparkpost/matchbox';
import styles from './ViewDetailsButton.module.scss';

export class ViewDetailsButton extends Component {
  render() {
    const { message_id, event_id } = this.props;

    if (!message_id) {
      return null;
    }

    const to = {
      pathname: `/reports/message-events/details/${message_id}`,
      state: { selectedEventId: event_id }
    };

    return (
      <div className={styles.AlignRight}>
        <Button Component={Link} to={to} size='small'>View Details</Button>
      </div>
    );
  }
}

export default ViewDetailsButton;
