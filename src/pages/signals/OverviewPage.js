import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryTable from './components/SummaryTable';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';

import { Panel } from '@sparkpost/matchbox';
import DivergingBar from './components/charts/divergingBar/DivergingBar';

export class OverviewPage extends Component {
  state = {
    selected: ''
  }

  handleClick = ({ payload }) => {
    this.setState({ selected: payload.key });
  }

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

        <Panel sectioned>
          <div style={{ width: '350px' }}>
            <DivergingBar data={[
              { key: 'abc', label: 'Label 1', value: 0.8 },
              { key: 'def', label: 'Label 2', value: -0.5 },
              { key: 'xyz', label: 'Label 7', value: -0.22 },
              { key: 'ghi', label: 'Label 3', value: -0.1 },
              { key: 'jkl', label: 'Label 4', value: 0.3 },
              { key: 'mno', label: 'Label 5', value: 0.5 },
              { key: 'pqr', label: 'Label 6', value: -0.15 }
            ]}
            selected={this.state.selected}
            onClick={this.handleClick}
            height={280}
            /></div>
        </Panel>
      </Page>
    );
  }
}

export default OverviewPage;
