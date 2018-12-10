import React from 'react';
import { Table } from '@sparkpost/matchbox';
import HeaderLabel from './HeaderLabel';
import styles from './SummaryTable.module.scss';

const Head = ({ columns, onSort, order }) => (
  <thead>
    <Table.Row>
      {columns.map(({ dataKey, label, sortable }) => (
        <Table.HeaderCell className={styles.Header} key={`header-${dataKey}`}>
          <HeaderLabel
            dataKey={dataKey}
            label={label}
            onSort={onSort}
            order={order}
            sortable={sortable}
          />
        </Table.HeaderCell>
      ))}
    </Table.Row>
  </thead>
);

export default Head;
