import React from 'react';
import { connect } from 'react-redux';
import { Grid, Panel } from '@sparkpost/matchbox';

import { PanelLoading } from 'src/components';
import { formatFullNumber, formatPercent } from 'src/helpers/units';
import styles from './EngagementSummary.module.scss';

export function EngagementSummary({ accepted = 0, clicks = 0, filters, loading, opens = 0 }) {
  if (loading) {
    return <PanelLoading minHeight="115px" />;
  }

  // accepted should always be the largest number, so if it is zero all others should be zero
  if (accepted === 0) {
    return null;
  }

  return (
    <Panel className={styles.EngagementSummary}>
      <Grid>
        <Grid.Column xs={12} md={3} xl={2}>
          <h1>{formatPercent(opens / accepted * 100)}</h1>
          <h6>Unique Open Rate</h6>
        </Grid.Column>
        <Grid.Column xs={12} md={3} xl={2}>
          <h1>{formatPercent(clicks / opens * 100)}</h1>
          <h6>Unique Click Rate</h6>
        </Grid.Column>
        <Grid.Column xs={12} md={6} xl={8}>
          <p>
            <strong>{formatFullNumber(opens)}</strong> of
            your <strong>{formatFullNumber(accepted)}</strong> accepted messages were opened
            and <strong>{formatFullNumber(clicks)}</strong> of
            your <strong>{formatFullNumber(opens)}</strong> opened messages were clicked
          </p>
        </Grid.Column>
      </Grid>
    </Panel>
  );
}

const mapStateToProps = ({ reportFilters: filters }) => ({ filters });
export default connect(mapStateToProps)(EngagementSummary);
