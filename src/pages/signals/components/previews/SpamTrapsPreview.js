import React, { Component } from 'react';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading, PageLink } from 'src/components';
import Callout from 'src/components/callout';
import { SPAM_TRAP_INFO } from '../../constants/info';
import withSpamTrapDetails from '../../containers/SpamTrapDetailsContainer';
import BarChart from '../charts/barchart/BarChart';
import ChartHeader from '../ChartHeader';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { formatNumber } from 'src/helpers/units';

export class SpamTrapsPreview extends Component {
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
        yKey='trap_hits'
        yAxisProps={{
          tickFormatter: (tick) => formatNumber(tick),
          domain: ['auto', 'auto']
        }}
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
      <PageLink to={`/signals/spam-traps/${facet}/${facetId}${setSubaccountQuery(subaccountId)}`}>
        <Panel>
          <Panel.Section>
            <ChartHeader
              title='Spam Trap Monitoring'
              hideLine
              tooltipContent={SPAM_TRAP_INFO}
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

export default withSpamTrapDetails(SpamTrapsPreview);
