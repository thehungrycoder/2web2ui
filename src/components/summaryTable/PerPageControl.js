import React from 'react';
import classnames from 'classnames';
import { Button } from '@sparkpost/matchbox';
import styles from './SummaryTable.module.scss';

const SIZES = [10, 25, 50, 100];

const PerPageControl = ({ onChange, perPage, totalCount }) => {
  if (!totalCount || totalCount < SIZES[0]) {
    return null;
  }

  return (
    <div className={styles.PerPageGroup}>
      <Button.Group>
        <span className={styles.PerPageLabel}>Per Page</span>
        {SIZES.map((size) => {
          if (totalCount < size) {
            return null;
          }

          return (
            <Button
              flat
              className={classnames(perPage === size && styles.Selected)}
              key={size}
              onClick={() => onChange(size)}
            >
              {size}
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default PerPageControl;
