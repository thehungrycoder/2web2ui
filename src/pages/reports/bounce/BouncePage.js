import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { safeRate } from 'src/helpers/math';
import { refreshBounceReport } from 'src/actions/bounceReport';
import { addFilters } from 'src/actions/reportOptions';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { Percent } from 'src/components/formatters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { Page, UnstyledLink } from '@sparkpost/matchbox';
import ReportOptions from '../components/ReportOptions';
import BounceChart from './components/BounceChart';
import MetricsSummary from '../components/MetricsSummary';
import { mapStateToProps } from 'src/selectors/bounceReport';

const columns = [
  { label: 'Reason', width: '45%', sortKey: 'reason' },
  { label: 'Domain', sortKey: 'domain' },
  { label: 'Category', sortKey: 'bounce_category_name' },
  { label: 'Classification', sortKey: 'classification_id' },
  { label: 'Count (%)', sortKey: 'count_bounce' }
];

export class BouncePage extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshBounceReport(this.props.reportOptions);
    }
  }

  getRowData = (item) => {
    const { aggregates = {}, addFilters } = this.props;
    const { reason, domain, bounce_category_name, bounce_class_name } = item;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => addFilters([{ type: 'Recipient Domain', value: domain }])}>{ domain }</UnstyledLink>,
      bounce_category_name,
      bounce_class_name,
      <span>{item.count_bounce} <small>(<Percent value={(item.count_bounce / aggregates.countBounce) * 100} />)</small></span>
    ];
  };

  renderChart() {
    const { chartLoading, aggregates, categories, types } = this.props;
    if (!chartLoading && _.isEmpty(aggregates)) {
      return <Empty title='Bounce Rates' message='No bounces to report' />;
    }

    return <BounceChart
      loading={chartLoading}
      aggregates={aggregates}
      categories={categories}
      types={types}
    />;
  }

  renderCollection() {
    const { tableLoading, reasons } = this.props;

    if (tableLoading) {
      return <PanelLoading />;
    }

    if (!reasons.length) {
      return <Empty message={'No bounce reasons to report'} />;
    }

    return <TableCollection
      columns={columns}
      rows={reasons}
      getRowData={this.getRowData}
      defaultSortColumn='count_bounce'
      defaultSortDirection='desc'
      pagination
      filterBox={{
        show: true,
        keyMap: {
          category: 'bounce_category_name',
          classification: 'bounce_class_name'
        },
        itemToStringKeys: ['bounce_category_name', 'bounce_class_name', 'domain', 'reason'],
        exampleModifiers: ['domain', 'category', 'classification']
      }}
    />;
  }

  renderTopLevelMetrics() {
    const { chartLoading, aggregates } = this.props;
    const { countBounce, countTargeted } = aggregates;

    // Aggregates aren't ready until chart refreshes
    if (chartLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={safeRate(countBounce, countTargeted)}
        rateTitle='Bounce Rate'
      >
        <strong>{countBounce.toLocaleString()}</strong> of your messages were bounced of <strong>{countTargeted.toLocaleString()}</strong> messages targeted
      </MetricsSummary>
    );
  }

  render() {
    const { chartLoading, bounceSearchOptions } = this.props;

    return (
      <Page title='Bounce Report'>
        <ReportOptions reportLoading={chartLoading} searchOptions={bounceSearchOptions} />
        { this.renderTopLevelMetrics() }
        { this.renderChart() }
        <hr/>
        { this.renderCollection() }
      </Page>
    );
  }
}

const mapDispatchToProps = {
  addFilters,
  refreshBounceReport
};

export default connect(mapStateToProps, mapDispatchToProps)(BouncePage);
