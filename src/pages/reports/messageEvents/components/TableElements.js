/* eslint-disable */
import React from 'react';
import cx from 'classnames';
import TimeAgo from 'react-timeago';
import { capitalizeFirstLetter } from 'src/helpers/string';

import { Table, Icon, UnstyledLink } from '@sparkpost/matchbox';

import styles from './HistoryTable.module.scss';

const Header = () => (
  <thead>
    <Table.Row>
      <th width='2px'/>
      <Table.HeaderCell className={styles.HeaderCell} width='35%'>
        <h5 className={styles.PanelTitle}>Message History</h5>
        Time
      </Table.HeaderCell>
      <Table.HeaderCell className={styles.HeaderCell} width='35%'>
        Event
      </Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </thead>
);

const Row = ({ onClick, selected, type, timestamp }) => (
  <Table.Row onClick={onClick} className={cx(styles.Row, selected && styles.selected)}>
    <td className={styles.Bar}/>
    <Table.Cell><TimeAgo date={timestamp} /></Table.Cell>
    <Table.Cell>{ capitalizeFirstLetter(type) }</Table.Cell>
    <Table.Cell>
      <UnstyledLink onClick={onClick} className={styles.Link}>View Details</UnstyledLink>
      {/* <Icon name='ChevronLeft' className={styles.Chevron} size={21}/> */}
    </Table.Cell>
  </Table.Row>
);

export {
  Header,
  Row
};
