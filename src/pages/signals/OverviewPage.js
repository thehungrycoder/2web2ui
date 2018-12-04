import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryTable from './components/SummaryTable';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';
import { Panel } from '@sparkpost/matchbox';
import Calculation from './components/viewControls/Calculation';
import ChartType from './components/viewControls/ChartType';

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

        <Panel>
          <Panel.Section>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Calculation
                initialSelected='absolute'
                // onChange={(n) => console.log(n)}
              />
              <ChartType
                // onChange={(n) => console.log(n)}
              />
            </div>
          </Panel.Section>
        </Panel>
      </Page>
    );
  }
}

export default OverviewPage;
