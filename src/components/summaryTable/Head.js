import React from 'react';
import classnames from 'classnames';
import { Table } from '@sparkpost/matchbox';
import HeaderLabel from './HeaderLabel';
import styles from './SummaryTable.module.scss';

const Head = ({ columns, onSort, order }) => (
  <thead>
    <Table.Row>
      {columns.map(({ align = 'left', dataKey, label, sortable, width }) => (
        <Table.HeaderCell
          className={classnames(styles.Header, {
            [styles.CenterAlign]: align === 'center',
            [styles.RightAlign]: align === 'right'
          })}
          key={`header-${dataKey}`}
          width={width}
        >
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
