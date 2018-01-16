import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTime } from 'src/helpers/date';

import styles from './LabelledValue.module.scss';

function handleTypes(value, type) {
  switch (type) {
    case 'datetime':
      return formatDateTime(value);
    default:
      return value;
  }
}
const LabelledValue = ({ label, value, children, type }) => {
  const childrenMarkup = value
    ? <h6>{ handleTypes(value, type) }</h6>
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
  type: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default LabelledValue;
