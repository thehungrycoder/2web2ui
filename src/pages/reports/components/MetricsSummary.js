import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Panel, Grid } from '@sparkpost/matchbox';
import { Percent } from 'src/components';
import { formatDateTime, relativeDateOptionsIndexed } from 'src/helpers/date';

import styles from './MetricsSummary.module.scss';

export class MetricsSummary extends Component {
  renderDate() {
    const { to, from, relativeRange } = this.props;

    if (relativeRange === 'custom') {
      return <span> from <strong>{formatDateTime(from)}</strong> to <strong>{formatDateTime(to)}</strong></span>;
    }

    return <span> in the <strong>{relativeDateOptionsIndexed[relativeRange].toLowerCase()}</strong></span>;
  }

  render() {
    const { children, rateValue, rateTitle, secondaryMessage } = this.props;

    return (
      <Panel className={styles.Panel}>
        <Grid>
          <Grid.Column xs={12} md={3} xl={2}>
            <div className={styles.panelvertical}>
              <h1 className={styles.RateValue}><Percent value={rateValue} /></h1>
              <h6 className={styles.RateTitle}>{rateTitle}</h6>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className={styles.panelvertical}>
              <p className={styles.Description}>
                {children}{this.renderDate()}.
              </p>
              {secondaryMessage && <p className={styles.Secondary}>{secondaryMessage}</p>}
            </div>
          </Grid.Column>
        </Grid>
      </Panel>
    );
  }
}

MetricsSummary.propTypes = {
  to: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
  relativeRange: PropTypes.string,
  rateValue: PropTypes.number,
  rateTitle: PropTypes.string,
  secondaryMessage: PropTypes.node
};

export default connect((state) => ({ ...state.reportOptions }))(MetricsSummary);
