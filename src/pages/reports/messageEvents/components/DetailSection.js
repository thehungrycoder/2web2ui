import React from 'react';
import PropTypes from 'prop-types';

import styles from './DetailSection.module.scss';

const DetailSection = ({ label, content }) => (
  <div className={styles.DetailSection}>
    <div className={styles.LabelContainer}>
      <small className={styles.Label}>{ label }</small>
    </div>
    <div className={styles.Content}><h6>{ content }</h6></div>
  </div>
);

DetailSection.propTypes = {
  label: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default DetailSection;
