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
  hovered,
  otherHovered,
  ...props
}) => {
  const itemClasses = cx(
    styles.LegendItem,
    onClick && styles.enabled,
    children && styles.hasChildren,
    breadcrumb && styles.breadcrumb,
    hovered && styles.hovered,
    otherHovered && styles.otherHovered
  );

  const breadcrumbMarkup = breadcrumb
    ? <Icon name='ChevronLeft' className={styles.BreadcrumbIcon}/>
    : null;

  const expandMarkup = children && children.length
    ? <Icon name='ChevronRight' />
    : null;

  return (
    <a className={itemClasses} onClick={onClick} title={onClick && `View ${name}`} {...props}>
      { fill && <span className={styles.Color} style={{ backgroundColor: fill }}/> }
      { breadcrumbMarkup }
      <span className={styles.Name}>{name}{expandMarkup}</span>
      { count !== undefined && <span className={styles.Count}>{count.toLocaleString()}</span> }
    </a>
  );
};

LegendItem.displayName = 'PieChart.LegendItem';
export default LegendItem;
