import React from 'react';
import { Table } from '@sparkpost/matchbox';
import styles from './SummaryTable.module.scss';

const Billboard = ({ children, colSpan }) => (
  <tbody>
    <Table.Row>
      <Table.Cell className={styles.Billboard} colSpan={colSpan}>
        {children}
      </Table.Cell>
    </Table.Row>
  </tbody>
);

export default Billboard;
