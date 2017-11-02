import React from 'react';
import cx from 'classnames';

import styles from './LegendItem.module.scss';

const LegendItem = ({
  name,
  count,
  fill,
  subcategories,
  disableInteraction,
  ...props
}) => {
  const classes = cx(
    styles.LegendItem,
    !disableInteraction && styles.enabled,
    subcategories && styles.hasChildren
  );

  return (
    <a className={classes} {...props}>
      { fill && <span className={styles.Color} style={{ backgroundColor: fill }}/> }
      <span className={styles.Name}>{name}</span>
      <span className={styles.Count}>{count.toLocaleString()}</span>
    </a>
  );
};

export default LegendItem;
