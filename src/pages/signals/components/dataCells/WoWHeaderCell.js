import React from 'react';
import { Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import styles from './DataCell.module.scss';

const WoWHeaderCell = () => (
  <Tooltip content='Week Over Week Change' dark>
    WoW <InfoOutline size={15} className={styles.InfoIcon}/>
  </Tooltip>
);

export default WoWHeaderCell;
