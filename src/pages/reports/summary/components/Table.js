/* eslint-disable */
import React, { Component } from 'react';
import cx from 'classnames';
import { TableCollection, Unit, Loading } from 'src/components';
import Empty from '../../components/Empty';
import { Panel, Select, Grid } from '@sparkpost/matchbox';
import { GROUP_OPTIONS, GROUP_COL_CONFIG } from './tableConfig';
import _ from 'lodash';

import styles from './Table.module.scss';

class Table extends Component {

  getColumnHeaders() {
    const { metrics, groupBy } = this.props;
    return [
      {
        label: GROUP_COL_CONFIG[groupBy].columnLabel,
        className: styles.HeaderCell
      },
      ...metrics.map(({ label }) => ({
        label: <div className={styles.RightAlign}>{ label }</div>,
        className: cx(styles.HeaderCell, styles.NumericalHeader)
      }))
    ];
  }

  getRowData() {
    const { metrics, groupBy } = this.props;
    const key = GROUP_COL_CONFIG[groupBy].key;

    return (row) => {

      return [
        String(row[key]),
        ...metrics.map((metric) => {
          return <div className={styles.RightAlign}><Unit value={row[metric.key]} unit={metric.unit}/></div>
        })
      ];
    }
  }

  renderTable() {
    const { tableData, tableLoading } = this.props;

    if (tableLoading) {
      return (
        <div className={styles.LoadingSection}>
          <div className={styles.Loading}><Loading /></div>
        </div>
      );
    }

    if (!tableData.length) {
      return <Empty message='There is not data for your current query' />
    }

    return (
      <TableCollection
          columns={this.getColumnHeaders()}
          getRowData={this.getRowData()}
          pagination
          defaultPerPage={10}
          rows={this.props.tableData}
          filterBox={{ show: false }}
        />
    )
  }

  render() {
    const { tableLoading } = this.props;

    return (
      <div>
        <Panel>
          <Panel.Section>
            <Grid>
              <Grid.Column xs={12} md={6}>
                <Select
                  label='Group By'
                  options={GROUP_OPTIONS}
                  value={this.props.groupBy}
                  onChange={this.props.onGroupChange}/>
              </Grid.Column>
              <Grid.Column></Grid.Column>
            </Grid>
          </Panel.Section>
          { this.renderTable() }
          </Panel>
      </div>
    );
  }
}

export default Table;
