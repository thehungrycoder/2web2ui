import React, { Component } from 'react';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import { PanelLoading, PageLink } from 'src/components';
import withSpamTrapDetails from '../../containers/SpamTrapDetails.container';
import BarChart from '../charts/barchart/BarChart';
import Empty from '../Empty';
import ChartHeader from '../ChartHeader';

export class SpamTrapsPreview extends Component {

  renderContent = () => {
    const { data, gap, empty } = this.props;

    if (empty) {
      return <Empty height='100px' />;
    }

    return (
      <BarChart
        height={170}
        disableHover
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        gap={gap}
        timeSeries={data}
        yKey='trap_hits'
        yAxisProps={{ hide: true }}
        xAxisProps={{ hide: true }}
      />
    );
  }

  render() {
    const { facet, facetId, loading } = this.props;

    if (loading) {
      return <PanelLoading minHeight='170px' />;
    }

    return (
      <PageLink to={`/signals/spam-traps/${facet}/${facetId}`}>
        <Panel sectioned>
          <ChartHeader
            title='Spam Trap Monitoring'
            primaryArea={
              // TODO fill tooltip content
              <Tooltip dark horizontalOffset='-14px' content={'Content'}>
                <InfoOutline size={24} />
              </Tooltip>
            }
          />
          {this.renderContent()}
        </Panel>
      </PageLink>
    );
  }
}

export default withSpamTrapDetails(SpamTrapsPreview);
