import React from 'react';
import { Panel, Table } from '@sparkpost/matchbox';
import CollectionView from './CollectionView';
import TableHeader from '../collection/TableHeader';
import styles from './TableCollection.module.scss';

const TableWrapper = (props) => (
  <Panel>
    <div className={styles.TableWrapper}>
      <Table>{props.children}</Table>
    </div>
  </Panel>
);

const TableBody = (props) => <tbody>{props.children}</tbody>;

const TableCollectionView = ({ rowComponent, headerComponent, columns, rows }) => {
  const HeaderComponent = headerComponent ? headerComponent : () => <TableHeader columns={columns} onSort={() => {}} />;
  const TableRow = rowComponent ? rowComponent : Table.Row;

  return (
    <CollectionView
      outerWrapper={TableWrapper}
      headerComponent={HeaderComponent}
      bodyWrapper={TableBody}
      rowComponent={TableRow}
      {...this.props}
      rows={rows}
    />
  );
};

export default TableCollectionView;
