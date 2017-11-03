import React from 'react';
import cx from 'classnames';
import { Icon } from '@sparkpost/matchbox';

import styles from './LegendItem.module.scss';

const LegendItem = ({
  name,
  count,
  fill,
  children,
  breadcrumb,
  onClick,
  ...props
}) => {
  const itemClasses = cx(
    styles.LegendItem,
    onClick && styles.enabled,
    children && styles.hasChildren,
    breadcrumb && styles.breadcrumb
  );

  const breadcrumbMarkup = breadcrumb
    ? <Icon name='ChevronLeft' />
    : null;

  return (
    <a className={itemClasses} onClick={onClick} title={onClick && `View ${name}`} {...props}>
      { fill && <span className={styles.Color} style={{ backgroundColor: fill }}/> }
      <span className={styles.Name}>{ breadcrumbMarkup }{name}</span>
      { count && <span className={styles.Count}>{count.toLocaleString()}</span> }
    </a>
  );
};

export default LegendItem;
