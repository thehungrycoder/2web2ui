/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import SummaryTable, { Column } from 'src/components/summaryTable';
import BarChartDataCell from './dataCells/BarChartDataCell';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import PercentDataCell from './dataCells/PercentDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import Calculation from './viewControls/Calculation';
import ChartType from './viewControls/ChartType';
import styles from './SpamTrapOverview.module.scss';

class SpamTrapOverview extends React.Component {
  state = {
    calculation: 'relative',
    chartType: 'line'
  }

  componentDidMount() {
    const { getSubaccounts, subaccounts } = this.props;

    if (_.isEmpty(subaccounts)) {
      getSubaccounts();
    }

    this.getData();
  }

  componentDidUpdate(prevProps) {
    const controlsHaveChanged = (
      !_.isEqual(prevProps.signalOptions, this.props.signalOptions) ||
      !_.isEqual(prevProps.summaryTable, this.props.summaryTable)
    );

    if (controlsHaveChanged) {
      this.getData();
    }
  }

  getData = () => {
    const { getSpamHits, signalOptions, summaryTable } = this.props;
    let order;
    let orderBy;

    if (summaryTable.order) {
      order = summaryTable.order.ascending ? 'asc' : 'desc';
      orderBy = summaryTable.order.dataKey;
    }

    getSpamHits({
      facet: signalOptions.facet,
      filter: signalOptions.facetSearchTerm,
      limit: summaryTable.perPage,
      offset: (summaryTable.currentPage - 1) * summaryTable.perPage,
      order,
      orderBy,
      relativeRange: signalOptions.relativeRange,
      subaccount: signalOptions.subaccount
    });
  }

  handleCalculationChange = (calculation) => {
    this.setState({ calculation });
  }

  handleChartTypeChange = (chartType) => {
    this.setState({ chartType });
  }

  handleClick = (facetId) => ({ date }) => {
    const { facet, history, signalOptions } = this.props;
    let search;

    if (signalOptions.subaccount) {
      search = { subaccount: signalOptions.subaccount.id };
    }

    history.push({
      pathname: `/signals/spam-traps/${facet.key}/${facetId}`,
      search,
      state: {
        date
      }
    });
  }

  render() {
    const {
      data, error, facet, loading, metaData, signalOptions, subaccounts, tableName, totalCount
    } = this.props;
    const { calculation, chartType } = this.state;

    return (
      <Panel>
        <div className={styles.Header}>
          <h5>Spam Trap Monitoring Summary</h5>
          <div className={styles.Controls}>
            <Calculation initialSelected={calculation} onChange={this.handleCalculationChange} />
            <ChartType initialSelected={chartType} onChange={this.handleChartTypeChange} />
          </div>
        </div>
        <SummaryTable
          data={data}
          empty={data.length === 0}
          error={error && error.message}
          loading={loading}
          tableName={tableName}
          totalCount={totalCount}
        >
          <Column
            dataKey={facet.key}
            label={facet.label}
            sortable={facet.sortable}
            width="30%"
            component={(props) => {
              const id = props[facet.key];

              return (
                <FacetDataCell
                  facet={facet.key}
                  id={id}
                  name={_.get(subaccounts, `[${id}].name`)}
                  signalOptions={signalOptions}
                />
              );
            }}
          />
          <Column
            dataKey="history"
            label="Daily Spam Trap Hits"
            width="30%"
            component={({ history, ...data }) => {
              const id = data[facet.key];

              if (chartType === 'bar') {
                return (
                  <BarChartDataCell
                    data={_.last(history)}
                    dataKey={calculation === 'relative' ? 'relative_trap_hits' : 'trap_hits'}
                    label="Spam Trap Hits"
                    max={calculation === 'relative' ? metaData.currentRelativeMax : metaData.currentMax}
                    onClick={this.handleClick(id)}
                    relative={calculation === 'relative'}
                  />
                );
              }

              return (
                <SparklineDataCell
                  data={history}
                  dataKey={calculation === 'relative' ? 'relative_trap_hits' : 'trap_hits'}
                  label="Spam Trap Hits"
                  onClick={this.handleClick(id)}
                  relative={calculation === 'relative'}
                />
              );
            }}
          />
          {calculation === 'relative' ? (
            <Column
              align="right"
              dataKey="current_relative_trap_hits"
              label="Current Ratio"
              sortable
              width="20%"
              component={({ current_relative_trap_hits }) => (
                <PercentDataCell value={current_relative_trap_hits} />
              )}
            />
          ) : (
            <Column
              align="right"
              dataKey="current_trap_hits"
              label="Current Count"
              sortable
              width="20%"
              component={({ current_trap_hits }) => (
                <NumericDataCell value={current_trap_hits} />
              )}
            />
          )}
          <Column
            align="right"
            dataKey="total_injections"
            label="Total Injections"
            width="20%"
            component={({ total_injections }) => <NumericDataCell value={total_injections} />}
          />
        </SummaryTable>
      </Panel>
    );
  }
}

export default SpamTrapOverview;
