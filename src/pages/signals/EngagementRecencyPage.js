import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Grid } from '@sparkpost/matchbox';
import Page from './components/SignalsPage';
import BarChart from './components/charts/barchart/BarChart';
import Actions from './components/Actions';
import TooltipMetric from './components/charts/tooltip/TooltipMetric';
import DateFilter from './components/filters/DateFilter';
import withEngagementRecencyDetails from './containers/EngagementRecencyDetailsContainer';
import { Loading } from 'src/components';
import Callout from 'src/components/callout';
import OtherChartsHeader from './components/OtherChartsHeader';
import Calculation from './components/viewControls/Calculation';
import ChartHeader from './components/ChartHeader';
import { formatFullNumber, roundToPlaces } from 'src/helpers/units';
import moment from 'moment';
import _ from 'lodash';

// TODO replace with health score and engagement preview
// import SpamTrapsPreview from './components/previews/SpamTrapsPreview';

// Reverse Order
const COHORTS = {
  c_uneng: { fill: 'transparent', label: 'Never Engaged' },
  c_365d: { fill: '#50D1F3', label: 'Not Recently Engaged' },
  c_90d: { fill: '#FF9503', label: 'Semi Recently Engaged' },
  c_14d: { fill: '#54D9BD', label: 'Recently Engaged' },
  c_new: { fill: '#D46CC2', label: 'New' }
};

export class EngagementRecencyPage extends Component {

  getYAxisProps = () => ({
    tickFormatter: (tick) => {
      console.log(tick);
      return `${roundToPlaces(tick * 100, 0)}%`;
    }
  })

  getXAxisProps = () => {
    const { data } = this.props;
    return {
      interval: data.length - 2, // Show only first and last tick marks
      tickFormatter: (tick) => moment(tick).format('M/D')
    };
  }

  getTooltipContent = ({ payload = {}}) => (
    <Fragment>
      {_.keys(COHORTS).map((key) => <TooltipMetric key={key} label={COHORTS[key].label} value={`${roundToPlaces(payload[key] * 100, 0)}%`} />)}
    </Fragment>
  )

  renderContent = () => {
    const { data = [], loading, gap, empty, error } = this.props;
    let chartPanel;

    if (empty) {
      chartPanel = <Callout title='No Data Available'>Insufficient data to populate this chart</Callout>;
    }

    if (error) {
      chartPanel = <Callout title='Unable to Load Data'>{error.message}</Callout>;
    }

    if (loading) {
      chartPanel = (
        <div style={{ height: '220px', position: 'relative' }}>
          <Loading />
        </div>
      );
    }

    return (
      <Grid>
        <Grid.Column sm={12} md={7}>
          <Panel sectioned>
            <ChartHeader title='Engagement Recency' />
            {chartPanel || (
              <BarChart
                gap={gap}
                timeSeries={data}
                tooltipContent={this.getTooltipContent}
                yKeys={_.keys(COHORTS).map((key) => ({ key, ...COHORTS[key] })).reverse()}
                xKey='dt'
                yAxisProps={this.getYAxisProps()}
                xAxisProps={this.getXAxisProps()}
              />
            )}
          </Panel>
        </Grid.Column>
        <Grid.Column sm={12} md={5} mdOffset={0}>
          {/* TODO finish actions */}
          <Actions actions={[
            { content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.', link: 'https://www.sparkpost.com' }
          ]}/>
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    const { facetId } = this.props;

    return (
      <Page
        breadcrumbAction={{ content: 'Back to Overview', to: '/signals', component: Link }}
        subtitle={`Engagement Recency for ${facetId}`}
        primaryArea={<DateFilter />}>
        {this.renderContent()}
        <OtherChartsHeader facetId={facetId} />
        {/* TODO replace with health score and engagement preview */}
        <Grid>
          <Grid.Column xs={12} sm={6}>
            {/* <SpamTrapsPreview /> */}
          </Grid.Column>
          <Grid.Column xs={12} sm={6}>
            {/* <SpamTrapsPreview /> */}
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

export default withEngagementRecencyDetails(EngagementRecencyPage);
