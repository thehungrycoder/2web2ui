import React from 'react';
import PropTypes from 'prop-types';

import styles from './LabelledValue.module.scss';

const LabelledValue = ({ label, value, children }) => {
  const childrenMarkup = value
    ? <h6>{ value }</h6>
    : children;


  const labelMarkup = label
    ? <div className={styles.LabelContainer}><small className={styles.Label}>{ label }</small></div>
    : null;

  return (
    <div className={styles.LabelledValue}>
      { labelMarkup }
      <div className={styles.Content}>{ childrenMarkup }</div>
    </div>
  );
};

LabelledValue.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  value: PropTypes.oneOfType([
    PropTypes.node
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default LabelledValue;
