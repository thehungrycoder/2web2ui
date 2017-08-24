import React, { Component } from 'react';

import styles from './Legend.module.scss';

class Legend extends Component {
  renderMetric(metric) {
    return (
      <div className={styles.Metric} key={metric.name}>
        <span className={styles.Color} style={{ backgroundColor: metric.stroke }}/>
        { metric.label }
      </div>
    );
  }

  render() {
    const { metrics } = this.props;

    return (
      <div className={styles.Legend}>
        { metrics && metrics.map((metric) => this.renderMetric(metric)) }
      </div>
    );
  }
}

export default Legend;
