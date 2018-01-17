import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@sparkpost/matchbox';

import styles from './MetricCard.module.scss';

const MetricCard = ({ label, value, ...rest }) => (
  <Panel className={styles.Panel} {...rest}>
    <h1 className={styles.Value}>{value}</h1>
    <h6 className={styles.Label}>{label}</h6>
  </Panel>
);

MetricCard.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  label: PropTypes.string
};

export default MetricCard;
