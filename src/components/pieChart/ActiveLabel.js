import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActiveLabel.module.scss';

/**
 * Label that appears inside pie chart
 */
const ActiveLabel = ({
  name,
  value
}) => (
  <div className={styles.ActiveLabel}>
    <div className={styles.Label}>{name}</div>
    <div className={styles.Line}/>
    <div className={styles.Value}>{value}</div>
  </div>
);

ActiveLabel.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ActiveLabel.displayName = 'PieChart.ActiveLabel';
export default ActiveLabel;
