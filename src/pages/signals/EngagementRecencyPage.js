import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Grid } from '@sparkpost/matchbox';
import Page from './components/SignalsPage';
import BarChart from './components/charts/barchart/BarChart';
import EngagementRecencyActions from './components/actionContent/EngagementRecencyActions';
import TooltipMetric from './components/charts/tooltip/TooltipMetric';
import DateFilter from './components/filters/DateFilter';
import { ENGAGEMENT_RECENCY_COHORTS, ENGAGEMENT_RECENCY_INFO } from './constants/info';
import withEngagementRecencyDetails from './containers/EngagementRecencyDetailsContainer';
import { Loading } from 'src/components';
import Callout from 'src/components/callout';
import OtherChartsHeader from './components/OtherChartsHeader';
import ChartHeader from './components/ChartHeader';
import Legend from './components/charts/legend/Legend';
import { roundToPlaces } from 'src/helpers/units';
import moment from 'moment';
import _ from 'lodash';

import SpamTrapsPreview from './components/previews/SpamTrapsPreview';
import HealthScorePreview from './components/previews/HealthScorePreview';
import cohorts from './constants/cohorts';

export class EngagementRecencyPage extends Component {

  getYAxisProps = () => ({
    tickFormatter: (tick) => `${roundToPlaces(tick * 100, 0)}%`,
    domain: [0, 1],
    ticks: [0, 0.25, 0.5, 0.75, 1.0]
  })

  getXAxisProps = () => {
    const { xTicks } = this.props;
    return {
      ticks: xTicks,
      tickFormatter: (tick) => moment(tick).format('M/D')
    };
  }

  getTooltipContent = ({ payload = {}}) => (
    <Fragment>
      {_.keys(cohorts).map((key) => (
        <TooltipMetric
          key={key}
          color={cohorts[key].fill}
          label={cohorts[key].label}
          value={`${roundToPlaces(payload[key] * 100, 1)}%`}
        />
      ))}
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
          <Panel>
            <Panel.Section>
              <ChartHeader
                title='Engagement Recency'
                hideLine
                tooltipContent={ENGAGEMENT_RECENCY_INFO}
              />
            </Panel.Section>
            <Panel.Section>
              {chartPanel || (
                <div className='LiftTooltip'>
                  <BarChart
                    gap={gap}
                    timeSeries={data}
                    tooltipContent={this.getTooltipContent}
                    yKeys={_.keys(cohorts).map((key) => ({ key, ...cohorts[key] })).reverse()}
                    yAxisProps={this.getYAxisProps()}
                    xAxisProps={this.getXAxisProps()}
                  />
                  <Legend
                    items={_.values(cohorts)}
                    tooltipContent={(label) => ENGAGEMENT_RECENCY_COHORTS[label]}
                  />
                </div>
              )}
            </Panel.Section>
          </Panel>
        </Grid.Column>
        <Grid.Column sm={12} md={5} mdOffset={0}>
          {!chartPanel && <EngagementRecencyActions cohorts={_.last(data)} />}
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
        <Grid>
          <Grid.Column xs={12} sm={6}>
            <SpamTrapsPreview />
          </Grid.Column>
          <Grid.Column xs={12} sm={6}>
            <HealthScorePreview />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

export default withEngagementRecencyDetails(EngagementRecencyPage);
