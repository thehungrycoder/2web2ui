import React from 'react';
import styles from './DataCell.module.scss';
import { ArrowDropUp, ArrowDropDown } from '@sparkpost/matchbox-icons';

const WoWDataCell = ({ value, reverse }) => {
  let caret = null;
  let content = '- - -';

  if (value > 0) {
    caret = <ArrowDropUp className={reverse ? styles.Red : styles.Green} />;
  }

  if (value < 0) {
    caret = <ArrowDropDown className={reverse ? styles.Green : styles.Red} />;
  }

  if (value !== null) {
    content = (
      <span className={styles.WowWrapper}>
        <span className={styles.WowCaret}>{caret}</span>
        <span className={styles.WowValue}>{value}%</span>
      </span>
    );
  }

  return <div className={styles.PaddedCell}>{content}</div>;
};

export default WoWDataCell;
