import React from 'react';
import styles from './LongTextContainer.module.scss';

const LongTextContainer = ({ text }) => (
  <div className={styles.LongText}>{text}</div>
);

export default LongTextContainer;
