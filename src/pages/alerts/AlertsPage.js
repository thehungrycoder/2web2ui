import { Component } from 'react';
import { EmptyState } from '@sparkpost/matchbox';
import { Templates } from '../../components/images';
import React from 'react';

export class AlertsPage extends Component {
  render() {
    return (
      <EmptyState
        title="Alerts"
        image={Templates}
      >
        <p>Are you looking for notifications when you get close to your monthly plan volume so that you can avoid overages?  Set up a monthly sending limit alert by following the instructions located <a href="https://developers.sparkpost.com/api/alerts/#alerts">here</a>.</p>
        <p>Looking for notifications on other metrics? Please take a minute to tell us how we can help you by filling out this short <a href="https://goo.gl/forms/rnIuTvdVF2xhpKCy2">form </a>.</p>
      </EmptyState>
    );
  }
}

export default AlertsPage;
