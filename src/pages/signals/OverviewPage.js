import React, { Component, Fragment } from 'react';
import Page from './components/SignalsPage';
import SummaryTable from './components/SummaryTable';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';
import { Panel } from '@sparkpost/matchbox';
import Calculation from './components/viewControls/Calculation';
import ChartType from './components/viewControls/ChartType';
import BarChart from './components/charts/barchart/BarChart';
import moment from 'moment';
import _ from 'lodash';

const randInt = (max) => Math.floor(Math.random() * Math.floor(max));
const data = _.range(90).map((n, i) => ({
  bar: randInt(25),
  foo: randInt(25),
  baz: randInt(25),
  abc: randInt(25),
  date: moment().subtract(90 - i, 'day').toISOString()
}));

export class OverviewPage extends Component {
  state = {
    selected: ''
  }

  handleBarClick = ({ payload }) => {
    // console.log({ payload })
    this.setState({ selected: payload.date });
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
        <Panel>
          <Panel.Section>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Calculation initialSelected='absolute' />
              <ChartType />
            </div>
          </Panel.Section>
        </Panel>

        <Panel sectioned>
          <BarChart timeSeries={data}
            yDomain={[0,100]}
            yKeys={[
              { key: 'bar', fill: '#B157CE' },
              { key: 'foo', fill: '#28C0C4' },
              { key: 'baz', fill: '#FF9502' },
              { key: 'abc', fill: '#50D1F3' }
            ]}
            gap={0.3}
            onClick={this.handleBarClick}
            selected={this.state.selected}
            xAxisProps={{ interval: 88, tickFormatter: (tick) => moment(tick).format('M/D') }}
          />
          <BarChart timeSeries={data}
            yDomain={[0,50]}
            yKey='foo'
            onClick={this.handleBarClick}
            selected={this.state.selected}
            gap={0.3}
            xAxisProps={{ interval: 88, tickFormatter: (tick) => moment(tick).format('M/D') }}
          />
        </Panel>
      </Page>
    );
  }
}

export default OverviewPage;
