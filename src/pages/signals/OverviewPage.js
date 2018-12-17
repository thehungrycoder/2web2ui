import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryPanel from './components/SummaryPanel';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';
import { PageLink } from 'src/components';

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
        <PageLink to={{
          pathname: '/signals/spam-traps/sending_domain/test2.com',
          state: {
            date: '2018-12-08'
          }
        }}>Test spam trap link with router state</PageLink>
        <SummaryPanel title='Health Score' />
        <SummaryPanel title='Spam Traps' />
        <SummaryPanel title='Engagement Cohort' />
      </Page>
    );
  }
}

export default OverviewPage;
