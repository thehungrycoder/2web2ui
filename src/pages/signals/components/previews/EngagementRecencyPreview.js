import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading, PageLink } from 'src/components';
import Callout from 'src/components/callout';
import { ENGAGEMENT_RECENCY_INFO } from '../../constants/info';
import withEngagementRecencyDetails from '../../containers/EngagementRecencyDetailsContainer';
import BarChart from '../charts/barchart/BarChart';
import ChartHeader from '../ChartHeader';
import cohorts from '../../constants/cohorts';
import _ from 'lodash';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { roundToPlaces } from 'src/helpers/units';

export class EngagementRecencyPreview extends Component {
  getYAxisProps = () => ({
    tickFormatter: (tick) => `${roundToPlaces(tick * 100, 0)}%`,
    domain: [0, 1],
    ticks: [0, 0.25, 0.5, 0.75, 1.0]
  })

  renderContent = () => {
    const { data, gap, empty, error } = this.props;

    if (error) {
      return <Callout height='170px' title='Unable to Load Data'>{error.message}</Callout>;
    }

    if (empty) {
      return <Callout height='170px' title='No Data Available'>Insufficient data to populate this chart</Callout>;
    }

    return (
      <BarChart
        height={170}
        disableHover
        margin={{ top: 12, left: 12, right: 0, bottom: 12 }}
        gap={gap}
        timeSeries={data}
        yKeys={_.keys(cohorts).map((key) => ({ key, ...cohorts[key] })).reverse()}
        yAxisProps={this.getYAxisProps()}
        xAxisProps={{ hide: true }}
      />
    );
  }

  render() {
    const { facet, facetId, loading, subaccountId } = this.props;

    if (loading) {
      return <PanelLoading minHeight='170px' />;
    }

    return (
      <PageLink to={`/signals/engagement-recency/${facet}/${facetId}${setSubaccountQuery(subaccountId)}`}>
        <Panel>
          <Panel.Section>
            <ChartHeader
              title='Engagement Recency'
              hideLine
              tooltipContent={ENGAGEMENT_RECENCY_INFO}
            />
          </Panel.Section>
          <Panel.Section>
            {this.renderContent()}
          </Panel.Section>
        </Panel>
      </PageLink>
    );
  }
}

export default withEngagementRecencyDetails(EngagementRecencyPreview);
