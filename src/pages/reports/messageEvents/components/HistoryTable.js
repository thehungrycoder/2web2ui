/* eslint-disable */
import React, { Component } from 'react';

import { TableCollection } from 'src/components';
import { Panel } from '@sparkpost/matchbox';
import { Header, Row } from './TableElements';

import styles from './HistoryTable.module.scss';

class HistoryTable extends Component {
  createRows = () => {
    const { messageHistory, selectedId, handleEventClick } = this.props;

    return messageHistory.map((row) => {
      const selected = row.event_id === selectedId && messageHistory.length > 1;
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
          headerComponent={Header}
          rowComponent={Row}
          rows={rows}
          pagination={false}
        />
      </Panel>
    );
  }
}

export default HistoryTable;
