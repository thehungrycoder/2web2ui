import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Panel } from '@sparkpost/matchbox';
import { Loading, PieChart } from 'src/components';
import { generateColors } from 'src/helpers/color';
import styles from './ChartGroup.module.scss';

// Chart color palette generated from:
const primaryColor = '#DB2F3D';
const secondaryColor = '#37aadc';

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
    const { categories, types } = this.props;
    const { active } = this.state;
    const { name, count } = e;

    let dataSet = hoverSet === 'primary' ? categories : types;

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
      ? { name: hoveredItem.name, value: getRate(hoveredItem.count / aggregates.countBounce) }
      : { name: 'Bounce Rate', value: getRate(aggregates.countBounce / aggregates.countTargeted) };
  }

  getLegendHeaderData = () => {
    const { aggregates } = this.props;
    const { active } = this.state;

    // Header with breadcrumb & active data
    if (active) {
      return [
        { name: 'Bounces', breadcrumb: true, onClick: this.handleBreadcrumb, count: aggregates.countBounce },
        { name: 'Targeted', count: aggregates.countTargeted },
        { name: active.name, count: active.count }
      ];
    }

    // Default header
    return [
      { name: 'Bounces', count: aggregates.countBounce },
      { name: 'Targeted', count: aggregates.countTargeted }
    ];
  }

  // Gets primary and secondary data for BounceChart & Legend
  getData = () => {
    const { categories, types } = this.props;
    const { active } = this.state;

    let primaryData = categories;
    let secondaryData = types;

    if (active) {
      primaryData = active.children;
      secondaryData = null;
    }

    return {
      primaryData: generateColors(primaryData, { color: primaryColor, rotate: 80, saturate: 0.06 }),
      secondaryData: secondaryData && generateColors(secondaryData, { color: secondaryColor })
    };
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Panel title='Bounce Rates' sectioned className={styles.LoadingPanel}><Loading /></Panel>;
    }

    return (
      <Panel title='Bounce Rates' sectioned>
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

const mapStateToProps = ({ bounceReport }) => ({
  loading: bounceReport.aggregatesLoading || bounceReport.categoriesLoading,
  aggregates: bounceReport.aggregates,
  categories: bounceReport.categories,
  types: bounceReport.types
});
export default connect(mapStateToProps, {})(ChartGroup);
