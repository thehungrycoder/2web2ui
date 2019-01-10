/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import SummaryTable, { Column } from 'src/components/summaryTable';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { HEALTH_SCORE_INFO } from '../constants/info';
import BarChartDataCell from './dataCells/BarChartDataCell';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import ChartType from './viewControls/ChartType';
import styles from './SpamTrapOverview.module.scss';

class HealthScoreOverview extends React.Component {
  state = {
    chartType: 'line'
  }

  componentDidMount() {
    const { getSubaccounts, resetSummaryTable, subaccounts, tableName } = this.props;

    // todo, move to page component, so it is only called once
    if (_.isEmpty(subaccounts)) {
      getSubaccounts();
    }

    resetSummaryTable(tableName);
  }

  // assumptions, signalOptions and summaryTable should never both change on the same update and
  // resetting signal options will trigger a summary table reset which calls getData
  componentDidUpdate(prevProps) {
    const { resetSummaryTable, signalOptions, summaryTable, tableName } = this.props;

    if (prevProps.signalOptions !== signalOptions) {
      resetSummaryTable(tableName);
    }

    if (prevProps.summaryTable !== summaryTable) {
      this.getData();
    }
  }

  getData = () => {
    const { getHealthScore, signalOptions, summaryTable } = this.props;
    let { subaccount } = signalOptions;
    let order;
    let orderBy;

    if (summaryTable.order) {
      order = summaryTable.order.ascending ? 'asc' : 'desc';
      orderBy = summaryTable.order.dataKey;
    }

    if (subaccount && subaccount.id === undefined) {
      subaccount = undefined; // unset
    }

    getHealthScore({
      facet: signalOptions.facet,
      filter: signalOptions.facetSearchTerm,
      limit: summaryTable.perPage,
      offset: (summaryTable.currentPage - 1) * summaryTable.perPage,
      order,
      orderBy,
      relativeRange: signalOptions.relativeRange,
      subaccount
    });
  }

  handleChartTypeChange = (chartType) => {
    this.setState({ chartType });
  }

  handleClick = (facetId) => ({ date }) => {
    const { facet, history, signalOptions } = this.props;
    let search;

    if (facet.key === 'sid' && facetId === -1) {
      return; // ignore
    }

    if (signalOptions.subaccount) {
      search = setSubaccountQuery(signalOptions.subaccount.id);
    }

    history.push({
      pathname: `/signals/health-score/${facet.key}/${facetId}`,
      search,
      state: {
        date
      }
    });
  }

  render() {
    const {
      data, error, facet, loading, signalOptions, subaccounts, tableName, totalCount
    } = this.props;
    const { chartType } = this.state;

    return (
      <Panel>
        <div className={styles.Header}>
          <h5>Health Score Summary</h5>
          <div className={styles.Tooltip}>
            <Tooltip
              children={<InfoOutline size={18} />}
              content={HEALTH_SCORE_INFO}
              dark
              horizontalOffset="-1rem"
              right
            />
          </div>
          <div className={styles.Controls}>
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
                  dimension="health-score"
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
            label="Daily Health Score"
            width="30%"
            component={({ history, ...data }) => {
              const id = data[facet.key];

              if (chartType === 'bar') {
                return (
                  <BarChartDataCell
                    data={_.last(history)}
                    dataKey="health_score"
                    label="Health Score"
                    onClick={this.handleClick(id)}
                    relative={false}
                  />
                );
              }

              return (
                <SparklineDataCell
                  data={history}
                  dataKey="health_score"
                  label="Health Score"
                  onClick={this.handleClick(id)}
                  relative={false}
                />
              );
            }}
          />
          <Column
            align="right"
            dataKey="current_health_score"
            label="Current Score"
            sortable
            width="20%"
            component={({ current_health_score }) => (
              <NumericDataCell value={current_health_score} />
            )}
          />
          <Column
            align="right"
            dataKey="average_health_score"
            label="Average Score"
            width="20%"
            component={({ average_health_score }) => (
              <NumericDataCell value={average_health_score} />
            )}
          />
        </SummaryTable>
      </Panel>
    );
  }
}

export default HealthScoreOverview;
