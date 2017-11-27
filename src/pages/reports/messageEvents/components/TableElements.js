import React from 'react';
import cx from 'classnames';
import { snakeToFriendly } from 'src/helpers/string';

import { Table } from '@sparkpost/matchbox';
import DisplayDate from './DisplayDate';

import styles from './HistoryTable.module.scss';

const Header = () => (
  <thead>
    <Table.Row>
      <th width='2px'/>
      <Table.HeaderCell className={styles.HeaderCell} width='35%'>
        Time
      </Table.HeaderCell>
      <Table.HeaderCell className={styles.HeaderCell} width='auto'>
        Event
      </Table.HeaderCell>
    </Table.Row>
  </thead>
);

const Row = ({ onClick, selected, type, timestamp, formattedDate }) => (
  <Table.Row onClick={onClick} className={cx(styles.Row, selected && styles.selected)}>
    <td className={styles.Bar}/>
    <Table.Cell>
      <DisplayDate timestamp={timestamp} formattedDate={formattedDate} />
    </Table.Cell>
    <Table.Cell>{ snakeToFriendly(type) }</Table.Cell>
  </Table.Row>
);

const TableWrapper = ({ children }) => <Table>{ children }</Table>;

export {
  Header,
  TableWrapper,
  Row
};
