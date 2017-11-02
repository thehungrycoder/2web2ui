import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Panel } from '@sparkpost/matchbox';
import ActiveLabel from './ActiveLabel';
import BounceChart from './BounceChart';
import Legend from './Legend';
import { Loading } from 'src/components';

import styles from './ChartGroup.module.scss';

class ChartGroup extends Component {
  state = {
    hover: null,
    hoverSet: null,
    active: null
  };

  handleMouseOver = (e, hoverSet) => {
    const { categories, types } = this.props;
    const { active } = this.state;
    const { name, count } = e;

    let data = hoverSet === 'primary' ? categories : types;

    if (active) {
      data = active.subcategories;
    }

    const hover = { name, count, index: _.findIndex(data, { name }) };
    this.setState({ hover, hoverSet });
  }

  handleMouseOut = () => {
    this.setState({ hover: null, hoverSet: null });
  }

  handleClick = ({ name, subcategories, count }) => {
    if (subcategories) {
      this.setState({
        active: { name, subcategories, count },
        hover: null,
        hoverSet: null
      });
    }
  }

  handleBreadcrumb = () => {
    this.setState({ active: null });
  }

  getLabelProps = () => {
    const { aggregates } = this.props;
    const { hover } = this.state;

    const getRate = (n) => `${(100 * n).toFixed(2)}%`;

    return hover
      ? { name: hover.name, value: getRate(hover.count / aggregates.countBounce) }
      : { name: 'Bounce Rate', value: getRate(aggregates.countBounce / aggregates.countTargeted) };
  }

  getLegendHeaderData = () => {
    const { aggregates } = this.props;
    const { active } = this.state;

    if (active) {
      return [
        { name: 'All Bounces', breadcrumb: true, onClick: this.handleBreadcrumb },
        { name: active.name, count: active.count, disableInteraction: true }
      ];
    }

    return [
      { name: 'Targeted', count: aggregates.countTargeted, disableInteraction: true },
      { name: 'All Bounces', count: aggregates.countBounce, disableInteraction: true }
    ];
  }

  getData = () => {
    const { categories, types } = this.props;
    const { active } = this.state;

    let primaryData = categories;
    let secondaryData = types;

    if (active) {
      primaryData = active.subcategories;
      secondaryData = null;
    }

    return { primaryData, secondaryData };
  }

  render() {
    const { loading, aggregates } = this.props;

    if (loading || !aggregates) {
      return <Panel title='Bounce Rates' sectioned className={styles.LoadingPanel}><Loading /></Panel>;
    }

    return (
      <Panel title='Bounce Rates' sectioned>
        <Grid>
          <Grid.Column xs={12} lg={5}>
            <div className={styles.ChartWrapper}>
              <BounceChart
                {...this.getData()}
                hover={this.state.hover}
                hoverSet={this.state.hoverSet}
                handleMouseOver={this.handleMouseOver}
                handleMouseOut={this.handleMouseOut}
                handleClick={this.handleClick} />
              <ActiveLabel {...this.getLabelProps()}/>
            </div>
          </Grid.Column>
          <Grid.Column xs={12} lg={7}>
            <Legend
              headerData={this.getLegendHeaderData()}
              {...this.getData()}
              handleMouseOver={this.handleMouseOver}
              handleMouseOut={this.handleMouseOut}
              handleClick={this.handleClick} />
          </Grid.Column>
        </Grid>
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.bounceReport.aggregatesLoading || state.bounceReport.categoriesLoading,
  aggregates: state.bounceReport.aggregates,
  categories: state.bounceReport.categories,
  types: state.bounceReport.types
});
export default connect(mapStateToProps, {})(ChartGroup);
