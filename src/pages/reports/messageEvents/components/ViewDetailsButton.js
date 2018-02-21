import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Button } from '@sparkpost/matchbox';
import styles from './ViewDetailsButton.module.scss';

export class ViewDetailsButton extends Component {
  handleDetailClick = () => {
    const { history, message_id, event_id } = this.props;
    history.push({
      pathname: `/reports/message-events/details/${message_id}`,
      state: { selectedEventId: event_id }
    });
  };

  render() {
    const { message_id } = this.props;

    if (!message_id) {
      return null;
    }

    return (<div className={styles.AlignRight}>
      <Button onClick={this.handleDetailClick} size='small'>View Details</Button>
    </div>);
  }
}

export default withRouter(ViewDetailsButton);
