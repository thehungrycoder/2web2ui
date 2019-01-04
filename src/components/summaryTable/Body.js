import React from 'react';
import classnames from 'classnames';
import { Table } from '@sparkpost/matchbox';
import Callout from 'src/components/callout';
import Loading from 'src/components/loading'; // todo, move to src/components
import Billboard from './Billboard';
import styles from './SummaryTable.module.scss';

const Body = ({ columns, data, empty, error, loading, perPage }) => {
  const colSpan = columns.length;

  if (loading) {
    return (
      <Billboard colSpan={colSpan}>
        <Loading />
      </Billboard>
    );
  }

  if (error) {
    return (
      <Billboard colSpan={colSpan}>
        <Callout title="Unable to Load Data" children={error} />
      </Billboard>
    );
  }

  if (empty) {
    return (
      <Billboard colSpan={colSpan}>
        <Callout title="No Data Available" />
      </Billboard>
    );
  }

  return (
    <tbody>
      {data.slice(0, perPage).map((rowOfData, rowIndex) => (
        <Table.Row key={`row-${rowIndex}`}>
          {columns.map(({ align = 'left', component: Component, dataKey }) => (
            <Table.Cell
              className={classnames(styles.Cell, {
                [styles.DataCell]: !Component,
                [styles.CenterAlign]: align === 'center',
                [styles.RightAlign]: align === 'right'
              })}
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
