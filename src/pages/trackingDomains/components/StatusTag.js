import React from 'react';
import { Tooltip, Tag } from '@sparkpost/matchbox';
import styles from './TrackingDomainRow.module.scss';

export default function({ status }) {
  if (status === 'blocked') {
    return (
      <Tooltip
        content='This domain is not available for use. For more information, please contact support.'
        dark>
        <Tag className={styles.Tag}>Blocked</Tag>
      </Tooltip>
    );
  }

  if (status === 'pending') {
    return (
      <Tooltip
        content='This domain is pending review, please check back again soon.'
        dark>
        <Tag className={styles.Tag}>Pending</Tag>
      </Tooltip>
    );
  }

  if (status === 'unverified') {
    return <Tag className={styles.Tag} yellow>Unverified</Tag>;
  }

  return null;
}
