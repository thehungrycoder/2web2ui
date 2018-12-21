import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Grid } from '@sparkpost/matchbox';
import Page from './components/SignalsPage';
import BarChart from './components/charts/barchart/BarChart';
import Actions from './components/Actions';
import TooltipMetric from './components/charts/tooltip/TooltipMetric';
import DateFilter from './components/filters/DateFilter';
import withSpamTrapDetails from './containers/SpamTrapDetailsContainer';
import { Loading } from 'src/components';
import Empty from './components/Empty';
import OtherChartsHeader from './components/OtherChartsHeader';
import Calculation from './components/viewControls/Calculation';
import ChartHeader from './components/ChartHeader';
import { formatFullNumber, roundToPlaces } from 'src/helpers/units';
import moment from 'moment';
import _ from 'lodash';

// TODO replace with health score and engagement preview
// import SpamTrapsPreview from './components/previews/SpamTrapsPreview';

export class SpamTrapPage extends Component {
  state = {
    calculation: 'absolute',
    selected: null
  }

  componentDidMount() {
    const { selected } = this.props;
    if (selected) {
      this.setState({ selected });
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      const last = _.last(data) || {};
      this.setState({ selected: last.dt });
    }
  }

  handleCalculationToggle = (value) => {
    this.setState({ calculation: value });
  }

  handleDateSelect = (node) => {
    this.setState({ selected: _.get(node, 'payload.dt') });
  }

  getYAxisProps = () => {
    const { calculation } = this.state;

    return {
      tickFormatter: calculation === 'relative' ? (tick) => `${roundToPlaces(tick * 100, 2)}%` : null
    };
  }

  getXAxisProps = () => {
    const { data } = this.props;
    return {
      interval: data.length - 2, // Show only first and last tick marks
      tickFormatter: (tick) => moment(tick).format('M/D')
    };
  }

  getTooltipContent = ({ payload = {}}) => (
    <Fragment>
      <TooltipMetric label='Spam Trap Hits' value={formatFullNumber(payload.trap_hits)} />
      <TooltipMetric label='Injections' value={formatFullNumber(payload.injections)} />
      <TooltipMetric label='Spam Trap Rate' value={`${roundToPlaces(payload.relative_trap_hits * 100, 4)}%`} />
    </Fragment>
  )

  renderContent = () => {
    const { data = [], loading, gap, empty } = this.props;
    const { calculation, selected } = this.state;
    let chartPanel;

    if (loading) {
      chartPanel = (
        <div style={{ height: '220px', position: 'relative' }}>
          <Loading />
        </div>
      );
    }

    if (empty) {
      // TODO Render with Callout component
      chartPanel = <Empty>Insufficient data to populate this chart</Empty>;
    }

    // TODO Render error with Callout component

    return (
      <Grid>
        <Grid.Column sm={12} md={7}>
          <Panel sectioned>
            <ChartHeader
              title='Spam Trap Monitoring'
              primaryArea={
                <Calculation
                  initialSelected={calculation}
                  onChange={this.handleCalculationToggle}
                />
              }
            />
            {chartPanel || (
              <BarChart
                gap={gap}
                onClick={this.handleDateSelect}
                selected={selected}
                timeSeries={data}
                tooltipContent={this.getTooltipContent}
                yKey={calculation === 'absolute' ? 'trap_hits' : 'relative_trap_hits'}
                xKey='dt'
                yAxisProps={this.getYAxisProps()}
                xAxisProps={this.getXAxisProps()}
              />
            )}
          </Panel>
        </Grid.Column>
        <Grid.Column sm={12} md={5} mdOffset={0}>
          {/* TODO finish actions */}
          <Actions date={selected} actions={[
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
        subtitle={`Spam Trap Monitoring for ${facetId}`}
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

export default withSpamTrapDetails(SpamTrapPage);
