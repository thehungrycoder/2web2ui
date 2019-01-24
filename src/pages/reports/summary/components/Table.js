import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { _getTableData } from 'src/actions/summaryChart';
import { addFilters } from 'src/actions/reportOptions';
import typeaheadCacheSelector from 'src/selectors/reportFilterTypeaheadCache';

import { TableCollection, TableHeader, Unit, Loading } from 'src/components';
import GroupByOption from './GroupByOption';
import { Empty } from 'src/components';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import { GROUP_CONFIG } from './tableConfig';
import _ from 'lodash';

import styles from './Table.module.scss';

export class Table extends Component {

  handleRowClick = (item) => {
    this.props.addFilters([item]);
  }

  getColumnHeaders() {
    const { metrics, groupBy } = this.props;
    const isAggColumn = groupBy === 'aggregate';

    const primaryCol = isAggColumn
      ? null
      : {
        label: GROUP_CONFIG[groupBy].label,
        className: styles.HeaderCell,
        sortKey: GROUP_CONFIG[groupBy].keyName
      };

    const metricCols = metrics.map(({ label, key }) => ({
      key,
      label: <div className={styles.RightAlign}>{label}</div>,
      className: cx(styles.HeaderCell, styles.NumericalHeader),
      sortKey: isAggColumn ? null : key
    }));

    return [primaryCol, ...metricCols];
  }

  getRowData = () => {
    const { metrics, groupBy, typeaheadCache } = this.props;
    const group = GROUP_CONFIG[groupBy];

    return (row) => {
      let value = row[group.keyName];
      let filter = {
        type: group.label,
        value
      };

      // Matches typeahead filter object for subaccounts
      if (filter.type === 'Subaccount') {
        const subaccount = _.find(typeaheadCache, { type: 'Subaccount', id: filter.value });
        const id = filter.value;
        value = _.get(subaccount, 'value') || `Deleted (ID ${filter.value})`;

        if (filter.value === 0) {
          value = 'Master Account (ID 0)';
        }

        filter = { ...filter, value, id };
      }

      const primaryCol = groupBy === 'aggregate' ? 'Aggregate Total' : <UnstyledLink onClick={() => this.handleRowClick(filter)}>{value}</UnstyledLink>;

      const metricCols = metrics.map((metric) => (
        <div className={styles.RightAlign}>
          <Unit value={row[metric.key]} unit={metric.unit}/>
        </div>
      ));

      return [primaryCol, ...metricCols];
    };
  }

  getDefaultSortColumn = () => {
    const { metrics } = this.props;
    return metrics[0].key;
  }

  renderAggregateTable() {
    const { tableData } = this.props;

    return (
      <TableCollection
        headerComponent={() => <TableHeader columns={this.getColumnHeaders()}/>}
        getRowData={this.getRowData()}
        rows={tableData}
      />
    );
  }

  renderGroupByTable() {
    const { tableData, groupBy } = this.props;
    const rowKeyName = GROUP_CONFIG[groupBy].keyName;

    return (
      <TableCollection
        rowKeyName={rowKeyName}
        columns={this.getColumnHeaders()}
        getRowData={this.getRowData()}
        pagination
        defaultPerPage={10}
        rows={tableData}
        defaultSortColumn={this.getDefaultSortColumn()}
        defaultSortDirection='desc'
      />
    );
  }

  renderTable() {
    const { tableData, tableLoading, groupBy } = this.props;

    if (tableLoading) {
      return (
        <div className={styles.LoadingSection}>
          <div className={styles.Loading}><Loading /></div>
        </div>
      );
    }

    if (!tableData.length) {
      return <Empty message='There is no data to display' />;
    }

    return (
      groupBy === 'aggregate'
        ? this.renderAggregateTable()
        : this.renderGroupByTable()
    );
  }

  render() {
    return (
      <Panel>
        <Panel.Section>
          <GroupByOption/>
        </Panel.Section>
        {this.renderTable()}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  typeaheadCache: typeaheadCacheSelector(state),
  ...state.summaryChart
});
export default connect(mapStateToProps, { _getTableData, addFilters })(Table);
