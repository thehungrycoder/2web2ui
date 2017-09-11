import React from 'react';
import { Tooltip } from '@sparkpost/matchbox';

import styles from './Permissions.module.scss';

const PermissionsColumn = ({ grants }) => {
  if (!grants.length) {
    return <span>None</span>;
  }

  const tooltipContent = (
    <span className={styles.Permissions}>
      {grants.join(', ')}
    </span>
  );

  return (
    <Tooltip content={tooltipContent}>
      {grants.length}
    </Tooltip>
  );
};

export default PermissionsColumn;
