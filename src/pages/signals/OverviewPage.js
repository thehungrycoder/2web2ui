import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import EngagementRecencyOverview from './containers/EngagementRecencyOverviewContainer';
import HealthScoreOverview from './containers/HealthScoreOverviewContainer';
import SpamTrapOverview from './containers/SpamTrapOverviewContainer';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';

export class OverviewPage extends Component {
  render() {
    return (
      <Page
        title='Signals Overview'
        primaryArea={
          <Fragment>
            <SubaccountFilter />
            <DateFilter />
            <FacetFilter />
          </Fragment>
        }
      >
        <HealthScoreOverview />
        <SpamTrapOverview />
        <EngagementRecencyOverview />
      </Page>
    );
  }
}

export default OverviewPage;
