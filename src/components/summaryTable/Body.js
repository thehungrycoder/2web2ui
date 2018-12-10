import React from 'react';
import classnames from 'classnames';
import { Table } from '@sparkpost/matchbox';
import Loading from 'src/components/loading';
import styles from './SummaryTable.module.scss';

const Body = ({ columns, data, loading, perPage }) => {
  if (loading) {
    return (
      <tbody>
        <Table.Row>
          <Table.Cell className={styles.Loading} colSpan={columns.length}>
            <Loading />
          </Table.Cell>
        </Table.Row>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.slice(0, perPage).map((rowOfData, rowIndex) => (
        <Table.Row key={`row-${rowIndex}`}>
          {columns.map(({ component: Component, dataKey }) => (
            <Table.Cell
              className={classnames(styles.Cell, { [styles.DataCell]: !Component })}
              key={`cell-${dataKey}`}
            >
              {Component ? <Component {...rowOfData} /> : rowOfData[dataKey]}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </tbody>
  );
};

export default Body;
