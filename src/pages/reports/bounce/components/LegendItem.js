import React from 'react';
import cx from 'classnames';
import { Icon } from '@sparkpost/matchbox';

import styles from './LegendItem.module.scss';

const LegendItem = ({
  name,
  count,
  fill,
  subcategories,
  disableInteraction,
  breadcrumb,
  ...props
}) => {
  const itemClasses = cx(
    styles.LegendItem,
    !disableInteraction && styles.enabled,
    subcategories && styles.hasChildren,
    breadcrumb && styles.breadcrumb
  );

  const breadcrumbMarkup = breadcrumb
    ? <Icon name='ChevronLeft' />
    : null;

  return (
    <a className={itemClasses} {...props}>
      { fill && <span className={styles.Color} style={{ backgroundColor: fill }}/> }
      <span className={styles.Name}>{ breadcrumbMarkup }{name}</span>
      { count && <span className={styles.Count}>{count.toLocaleString()}</span> }
    </a>
  );
};

export default LegendItem;
