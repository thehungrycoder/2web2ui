import React from 'react';
import PropTypes from 'prop-types';

import styles from './LabelledValue.module.scss';

const LabelledValue = ({ label, value }) => (
  <div className={styles.LabelledValue}>
    <div className={styles.LabelContainer}>
      <small className={styles.Label}>{ label }</small>
    </div>
    <div className={styles.Content}><h6>{ value }</h6></div>
  </div>
);

LabelledValue.propTypes = {
  label: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default LabelledValue;
