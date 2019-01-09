import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading, PageLink } from 'src/components';
import Callout from 'src/components/callout';
import withEngagementRecencyDetails from '../../containers/EngagementRecencyDetailsContainer';
import BarChart from '../charts/barchart/BarChart';
import ChartHeader from '../ChartHeader';
import cohorts from '../../constants/cohorts';
import _ from 'lodash';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

export class EngagementRecencyPreview extends Component {
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
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        gap={gap}
        timeSeries={data}
        yKeys={_.keys(cohorts).map((key) => ({ key, ...cohorts[key] })).reverse()}
        yAxisProps={{ hide: true, domain: [0, 1]}}
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
              tooltipContent='TODO'
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
