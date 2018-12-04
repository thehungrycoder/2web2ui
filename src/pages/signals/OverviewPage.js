import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryTable from './components/SummaryTable';
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
        <SummaryTable title='Health Score' />
        <SummaryTable title='Spam Traps' />
        <SummaryTable title='Engagement Cohort' />
      </Page>
    );
  }
}

export default OverviewPage;
