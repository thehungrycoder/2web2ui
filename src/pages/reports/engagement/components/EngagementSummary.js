import React from 'react';
import { connect } from 'react-redux';

import { PanelLoading } from 'src/components';
import { formatFullNumber } from 'src/helpers/units';
import MetricsSummary from '../../components/MetricsSummary';

export function EngagementSummary({ clicks = 0, filters, loading = true, targeted = 0 }) {
  if (loading) {
    return <PanelLoading minHeight="115px" />;
  }

  // targeted should always be the largest number, so if it is zero all others should be zero
  if (targeted === 0) {
    return null;
  }

  return (
    <MetricsSummary
      {...filters}
      rateTitle="Unique Click Rate"
      rateValue={clicks / targeted * 100}
    >
      <strong>{formatFullNumber(clicks)}</strong> of your messages were clicked
      of <strong>{formatFullNumber(targeted)}</strong> messages targeted
    </MetricsSummary>
  );
}

const mapStateToProps = ({ reportFilters: filters }) => ({ filters });
export default connect(mapStateToProps)(EngagementSummary);
