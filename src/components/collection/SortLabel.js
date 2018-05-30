import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';
import { ArrowDropDown, ArrowDropUp } from '@sparkpost/matchbox-icons';
import cx from 'classnames';

import styles from './SortLabel.module.scss';

const SortLabel = ({ label, direction, ...rest }) => {

  const classes = cx(
    styles.SortLabel,
    direction === 'asc' && styles.asc,
    direction === 'desc' && styles.desc,
  );

  return (
    <UnstyledLink className={classes} {...rest}>
      <span>{label}</span>
      <span className={styles.Up}><ArrowDropUp /></span>
      <span className={styles.Down}><ArrowDropDown /></span>
    </UnstyledLink>
  );
};

export default SortLabel;
