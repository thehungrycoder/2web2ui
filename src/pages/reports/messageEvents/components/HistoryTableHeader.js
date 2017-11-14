import React from 'react';
import { Table } from '@sparkpost/matchbox';

import styles from './HistoryTable.module.scss';

const HistoryTableHeader = () => (
  <thead>
    <Table.Row>
      <Table.HeaderCell className={styles.HeaderCell} width='42.5%'>
        <h5 className={styles.PanelTitle}>Message History</h5>
        Time
      </Table.HeaderCell>
      <Table.HeaderCell className={styles.HeaderCell} width='42.5%'>
        Event
      </Table.HeaderCell>
      <Table.HeaderCell width='5%'></Table.HeaderCell>
    </Table.Row>
  </thead>
);

export default HistoryTableHeader;
