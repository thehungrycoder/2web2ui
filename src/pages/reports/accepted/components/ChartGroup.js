import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Panel } from '@sparkpost/matchbox';
import { Loading, PieChart } from 'src/components';
import { generateColors } from 'src/helpers/color';
import styles from './ChartGroup.module.scss';

// Chart color palette generated from:
const primaryColor = '#0097b3';

export class ChartGroup extends Component {
  state = {
    hoveredItem: null,
    active: null
  };

  /**
   * Handles mouse over event for LegendItems and BounceChart
   * @param  {Object} e - Recharts synthetic event - behavior mimiced from Legend
   * @param  {string} hoverSet - 'primary' | 'secondary'
   */
  handleMouseOver = (e, hoverSet) => {
    const { deliveries } = this.props;
    const { active } = this.state;
    const { name, count } = e;

    let dataSet = deliveries;

    if (active) {
      dataSet = active.children;
    }

    const hoveredItem = {
      name,
      count,
      index: _.findIndex(dataSet, { name }),
      dataSet: hoverSet
    };

    this.setState({ hoveredItem });
  }

  handleMouseOut = () => {
    this.setState({ hoveredItem: null });
  }

  handleClick = ({ name, children, count }) => {
    if (children) {
      this.setState({
        active: { name, children, count },
        hoveredItem: null
      });
    }
  }

  handleBreadcrumb = () => {
    this.setState({ active: null });
  }

  getLabelProps = () => {
    const { aggregates } = this.props;
    const { hoveredItem } = this.state;

    const getRate = (n) => `${(100 * n).toFixed(2)}%`;

    return hoveredItem
      ? { name: hoveredItem.name, value: getRate(hoveredItem.count / aggregates.count_accepted) }
      : { name: 'Accepted Rate', value: getRate(aggregates.count_accepted / aggregates.count_targeted) };
  }

  getLegendHeaderData = () => {
    const { aggregates } = this.props;
    const { active } = this.state;

    // Header with breadcrumb & active data
    if (active) {
      return [
        { name: 'All Accepted', breadcrumb: true, onClick: this.handleBreadcrumb },
        { name: 'All Targeted', count: aggregates.count_targeted },
        { name: active.name, count: active.count }
      ];
    }

    // Default header
    return [
      { name: 'Targeted', count: aggregates.count_targeted },
      { name: 'All Accepted', count: aggregates.count_accepted }
    ];
  }

  // Gets primary and secondary data for BounceChart & Legend
  getData = () => {
    const { deliveries } = this.props;
    const { active } = this.state;

    let primaryData = deliveries;

    if (active) {
      primaryData = active.children;
    }

    return {
      primaryData: generateColors(primaryData, primaryColor)
    };
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Panel title='Accepted Attempt Rates' sectioned className={styles.LoadingPanel}><Loading /></Panel>;
    }

    return (
      <Panel title='Accepted Attempt Rates' sectioned>
        <Grid>
          <Grid.Column xs={12} lg={5}>
            <div className={styles.ChartWrapper}>
              <PieChart.Chart
                {...this.getData()}
                hoveredItem={this.state.hoveredItem}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onClick={this.handleClick} />
              <PieChart.ActiveLabel {...this.getLabelProps()}/>
            </div>
          </Grid.Column>
          <Grid.Column xs={12} lg={7}>
            <PieChart.Legend
              headerData={this.getLegendHeaderData()}
              {...this.getData()}
              hoveredItem={this.state.hoveredItem}
              onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
              onClick={this.handleClick} />
          </Grid.Column>
        </Grid>
      </Panel>
    );
  }
}

const mapStateToProps = ({ acceptedReport }) => ({
  loading: acceptedReport.aggregatesLoading,
  deliveries: acceptedReport.deliveries,
  aggregates: acceptedReport.aggregates
});
export default connect(mapStateToProps, {})(ChartGroup);
