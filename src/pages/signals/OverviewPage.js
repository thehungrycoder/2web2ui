import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryPanel from './components/SummaryPanel';
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
        <SummaryPanel title='Health Score' />
        <SummaryPanel title='Spam Traps' />
        <SummaryPanel title='Engagement Cohort' />
      </Page>
    );
  }
}

export default OverviewPage;
