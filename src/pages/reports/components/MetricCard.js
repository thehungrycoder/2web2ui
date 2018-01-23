import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Tooltip, Icon } from '@sparkpost/matchbox';

import styles from './MetricCard.module.scss';

const MetricCard = ({ label, value, tooltipContent, ...rest }) => {
  const tooltip = tooltipContent
    ? <Tooltip dark content={tooltipContent} horizontalOffset='-1.1rem'><Icon name='InfoOutline'/></Tooltip>
    : null;

  return (
    <div className={styles.MetricCard}>
      <Panel className={styles.Panel} {...rest}>
        <h1 className={styles.Value}>{value}</h1>
        <h6 className={styles.Label}>{label} {tooltip}</h6>
      </Panel>
    </div>
  );
};

MetricCard.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ]),
  tooltipContent: PropTypes.string,
  label: PropTypes.string
};

export default MetricCard;
