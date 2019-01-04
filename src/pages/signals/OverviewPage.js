import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SpamTrapOverview from './containers/SpamTrapOverview.container';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';

export class OverviewPage extends Component {
  render() {
    return (
      <Page primaryArea={
        <Fragment>
          <SubaccountFilter />
          <DateFilter />
          <FacetFilter />
        </Fragment>
      }>
        <SpamTrapOverview />
      </Page>
    );
  }
}

export default OverviewPage;
