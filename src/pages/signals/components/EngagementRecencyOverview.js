/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import SummaryTable, { Column } from 'src/components/summaryTable';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import BarChartDataCell from './dataCells/BarChartDataCell';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import PercentDataCell from './dataCells/PercentDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import Calculation from './viewControls/Calculation';
import ChartType from './viewControls/ChartType';
import styles from './SpamTrapOverview.module.scss';

class EngagementRecencyOverview extends React.Component {
  state = {
    calculation: 'relative',
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
    const { getEngagementRecency, signalOptions, summaryTable } = this.props;
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

    getEngagementRecency({
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
      search = setSubaccountQuery(signalOptions.subaccount.id);
    }

    history.push({
      pathname: `/signals/engagement-recency/${facet.key}/${facetId}`,
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
          <h5>Engagement Recency Summary</h5>
          <div className={styles.Tooltip}>
            <Tooltip
              children={<InfoOutline size={18} />}
              content={`
                This reports the share over time of your email that has been sent to recipients who
                most recently opened messages or clicked links during several defined time periods.
              `}
              dark
              horizontalOffset="-1rem"
              right
            />
          </div>
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
                  dimension="engagement-recency"
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
            label="Daily Recently Engaged Recipients"
            width="30%"
            component={({ history, ...data }) => {
              const id = data[facet.key];

              if (chartType === 'bar') {
                return (
                  <BarChartDataCell
                    data={_.last(history)}
                    dataKey={calculation === 'relative' ? 'relative_engaged_recipients' : 'engaged_recipients'}
                    label="Recently Engaged Recipients"
                    max={calculation === 'relative' ? metaData.currentRelativeMax : metaData.currentMax}
                    onClick={this.handleClick(id)}
                    relative={calculation === 'relative'}
                  />
                );
              }

              return (
                <SparklineDataCell
                  data={history}
                  dataKey={calculation === 'relative' ? 'relative_engaged_recipients' : 'engaged_recipients'}
                  label="Recently Engaged Recipients"
                  onClick={this.handleClick(id)}
                  relative={calculation === 'relative'}
                />
              );
            }}
          />
          {calculation === 'relative' ? (
            <Column
              align="right"
              dataKey="current_relative_engaged_recipients"
              label="Current Ratio"
              width="20%"
              component={({ current_relative_engaged_recipients }) => (
                <PercentDataCell value={current_relative_engaged_recipients} />
              )}
            />
          ) : (
            <Column
              align="right"
              dataKey="current_engaged_recipients"
              label="Current Count"
              width="20%"
              component={({ current_engaged_recipients }) => (
                <NumericDataCell value={current_engaged_recipients} />
              )}
            />
          )}
          <Column
            align="right"
            dataKey="total_engagement"
            label="Total Recipients"
            width="20%"
            component={({ total_engagement }) => <NumericDataCell value={total_engagement} />}
          />
        </SummaryTable>
      </Panel>
    );
  }
}

export default EngagementRecencyOverview;
