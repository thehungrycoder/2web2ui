import React from 'react';
import { UnstyledLink, Icon } from '@sparkpost/matchbox';
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
      <Icon name='CaretUp' className={styles.Up}/>
      <Icon name='CaretDown' className={styles.Down}/>
    </UnstyledLink>
  );
};

export default SortLabel;
