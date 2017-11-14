/* eslint-disable */
import React, { Component } from 'react';
import cx from 'classnames';

import { TableCollection } from 'src/components';
import { Panel, Icon, Table } from '@sparkpost/matchbox';
import HistoryTableHeader from './HistoryTableHeader';
import TimeAgo from 'react-timeago';

import { capitalizeFirstLetter } from 'src/helpers/string';

import styles from './HistoryTable.module.scss';

const Row = ({ onClick, selected, type, timestamp }) => {
  return (
    <Table.Row onClick={onClick} className={cx(styles.Row, selected && styles.selected)}>
      <Table.Cell><TimeAgo date={timestamp} /></Table.Cell>
      <Table.Cell>{ capitalizeFirstLetter(type) }</Table.Cell>
      <Table.Cell>
        <Icon name='ChevronLeft' className={styles.Chevron} size={21}/>
      </Table.Cell>
    </Table.Row>
  );
}

class HistoryTable extends Component {
  createRows = () => {
    const { messageHistory, selectedId, handleEventClick } = this.props;

    return messageHistory.map((row) => {
      const selected = row.event_id === selectedId;
      return {
      ...row,
      selected,
      onClick: !selected ? () => handleEventClick(row.event_id) : null
    }})

  }

  render() {
    const rows = this.createRows();

    return (
      <Panel>
        <TableCollection
          headerComponent={HistoryTableHeader}
          rowComponent={Row}
          rows={rows}
          pagination={false}
        />
      </Panel>
    );
  }
}

export default HistoryTable;
