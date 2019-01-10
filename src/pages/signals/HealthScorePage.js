/* eslint-disable max-lines */
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Grid } from '@sparkpost/matchbox';
import Page from './components/SignalsPage';
import BarChart from './components/charts/barchart/BarChart';
import DivergingBar from './components/charts/divergingBar/DivergingBar';
import HealthScoreActions from './components/actionContent/HealthScoreActions';
import TooltipMetric from './components/charts/tooltip/TooltipMetric';
import DateFilter from './components/filters/DateFilter';
import { HEALTH_SCORE_INFO } from './constants/info';
import withHealthScoreDetails from './containers/HealthScoreDetailsContainer';
import { Loading } from 'src/components';
import Callout from 'src/components/callout';
import OtherChartsHeader from './components/OtherChartsHeader';
import ChartHeader from './components/ChartHeader';
import { formatFullNumber, roundToPlaces, formatNumber } from 'src/helpers/units';
import moment from 'moment';
import _ from 'lodash';

import SpamTrapsPreview from './components/previews/SpamTrapsPreview';
import EngagementRecencyPreview from './components/previews/EngagementRecencyPreview';

export class HealthScorePage extends Component {
  state = {
    selectedDate: null
  }

  componentDidMount() {
    const { selected } = this.props;

    if (selected) {
      this.setState({ selectedDate: selected });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;
    const { selectedDate } = this.state;

    const dataSetChanged = prevProps.data !== data;
    const containsSelectedDay = _.find(data, ['date', selectedDate]);

    if (dataSetChanged && !containsSelectedDay) {
      const last = _.last(data);
      this.setState({ selectedDate: last.date });
    }
  }

  handleDateSelect = (node) => {
    this.setState({ selectedDate: _.get(node, 'payload.date') });
  }

  getXAxisProps = () => {
    const { xTicks } = this.props;
    return {
      ticks: xTicks,
      tickFormatter: (tick) => moment(tick).format('M/D')
    };
  }

  renderContent = () => {
    const { data = [], loading, gap, empty, error } = this.props;
    const { selectedDate } = this.state;

    const selectedWeights = _.get(_.find(data, ['date', selectedDate]), 'weights', []);
    const currentWeights = _.get(_.last(data), 'weights');

    let panelContent;

    if (empty) {
      panelContent = <Callout title='No Data Available'>Insufficient data to populate this chart</Callout>;
    }

    if (error) {
      panelContent = <Callout title='Unable to Load Data'>{error.message}</Callout>;
    }

    if (loading) {
      panelContent = (
        <div style={{ height: '220px', position: 'relative' }}>
          <Loading />
        </div>
      );
    }

    return (
      <Grid>
        <Grid.Column sm={12} md={7}>
          <Panel sectioned>
            <ChartHeader title='Health Score' tooltipContent={HEALTH_SCORE_INFO} />
            {panelContent || (
              <Fragment>
                <BarChart
                  gap={gap}
                  onClick={this.handleDateSelect}
                  selected={selectedDate}
                  timeSeries={data}
                  tooltipContent={({ payload = {}}) => (
                    <TooltipMetric label='Health Score' value={`${roundToPlaces(payload.health_score * 100, 1)}`} />
                  )}
                  yKey='health_score'
                  yAxisProps={{
                    tickFormatter: (tick) => tick * 100
                  }}
                  xAxisProps={this.getXAxisProps()}
                />
                <ChartHeader title='Injections' />
                <BarChart
                  gap={gap}
                  height={190}
                  onClick={this.handleDateSelect}
                  selected={selectedDate}
                  timeSeries={data}
                  tooltipContent={({ payload = {}}) => (
                    <TooltipMetric label='Injections' value={formatFullNumber(payload.injections)} />
                  )}
                  yKey='injections'
                  yAxisProps={{
                    tickFormatter: (tick) => formatNumber(tick)
                  }}
                  xAxisProps={this.getXAxisProps()}
                />
              </Fragment>
            )}
          </Panel>
        </Grid.Column>
        <Grid.Column sm={12} md={5} mdOffset={0}>
          <ChartHeader title='Health Score Components' hideLine padding='1rem 0 1rem' />
          {(!loading && !selectedWeights.length) && (
            <Callout>Insufficient data to populate this chart</Callout>
          )}

          {!panelContent && Boolean(selectedWeights.length) && (
            <DivergingBar
              data={selectedWeights}
              xKey='weight'
              yKey='weight_type'
            />
          )}
          {!panelContent && <HealthScoreActions weights={currentWeights} />}
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    const { facetId } = this.props;

    return (
      <Page
        breadcrumbAction={{ content: 'Back to Overview', to: '/signals', component: Link }}
        subtitle={`Health Score for ${facetId}`}
        primaryArea={<DateFilter />}>
        {this.renderContent()}
        <OtherChartsHeader facetId={facetId} />
        <Grid>
          <Grid.Column xs={12} sm={6}>
            <SpamTrapsPreview />
          </Grid.Column>
          <Grid.Column xs={12} sm={6}>
            <EngagementRecencyPreview />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

export default withHealthScoreDetails(HealthScorePage);
