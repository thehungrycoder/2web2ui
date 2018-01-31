import React from 'react';
import { connect } from 'react-redux';
import { Grid, Panel } from '@sparkpost/matchbox';

import { PanelLoading } from 'src/components';
import { formatDateTime, relativeDateOptionsIndexed } from 'src/helpers/date';
import { formatFullNumber, formatPercent } from 'src/helpers/units';
import styles from './EngagementSummary.module.scss';

export function EngagementSummary({ accepted = 0, clicks = 0, filters, loading, opens = 0, targeted = 0 }) {
  if (loading) {
    return <PanelLoading minHeight="115px" />;
  }

  // targeted should always be the largest number, so if it is zero all others should be zero
  if (targeted === 0) {
    return null;
  }

  const timeRange = filters.relativeRange === 'custom'
    ? <span>from <strong>{formatDateTime(filters.from)}</strong> to <strong>{formatDateTime(filters.to)}</strong></span>
    : <span>in the <strong>{relativeDateOptionsIndexed[filters.relativeRange].toLowerCase()}</strong></span>;

  return (
    <Panel className={styles.EngagementSummary}>
      <Grid>
        <Grid.Column xs={12} md={3} xl={2}>
          <h1>{formatPercent(opens / targeted * 100)}</h1>
          <h6>Unique Open Rate</h6>
        </Grid.Column>
        <Grid.Column xs={12} md={3} xl={2}>
          <h1>{formatPercent(clicks / targeted * 100)}</h1>
          <h6>Unique Click Rate</h6>
        </Grid.Column>
        <Grid.Column xs={12} md={6} xl={8}>
          <p>
            Of <strong>{formatFullNumber(targeted)}</strong> targeted
            recipients, <strong>{formatFullNumber(accepted)}</strong> messages were
            accepted, <strong>{formatFullNumber(opens)}</strong> were opened
            and <strong>{formatFullNumber(clicks)}</strong> were clicked {timeRange}.
          </p>
        </Grid.Column>
      </Grid>
    </Panel>
  );
}

const mapStateToProps = ({ reportFilters: filters }) => ({ filters });
export default connect(mapStateToProps)(EngagementSummary);
