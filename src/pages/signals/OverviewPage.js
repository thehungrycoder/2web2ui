import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';
import Page from './components/SignalsPage';
import HealthScoreSummary from './components/HealthScoreSummary';
import SpamTrapsSummary from './components/SpamTrapsSummary';
import EngagementSummary from './components/EngagementSummary';

class OverviewPage extends Component {
  render() {
    return (
      <Page>
        <HealthScoreSummary />
        <SpamTrapsSummary />
        <EngagementSummary />
      </Page>
    );
  }
}

export default OverviewPage;
