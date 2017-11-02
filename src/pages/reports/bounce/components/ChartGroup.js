/* eslint-disable */
import React, { Component } from 'react';
import { Grid } from '@sparkpost/matchbox';

import ActiveLabel from './ActiveLabel';
import BounceChart from './BounceChart';
import Legend from './Legend';

import styles from './ChartGroup.module.scss';

class ChartGroup extends Component {
  state = {
    active: null,
    activeSet: null
  };

  handleMouseOver = (e, activeSet) => {
    const { categories, types } = this.props;
    const { name, count } = e;

    const data = activeSet === 'primary' ? categories : types;
    const active = { name, count, index: _.findIndex(data, { name }) };
    this.setState({ active, activeSet });
  }

  handleMouseOut = () => {
    this.setState({ active: null, activeSet: null });
  }

  getLabelProps = () => {
    const { aggregates } = this.props;
    const { active } = this.state;

    const getRate = (n) => `${(100 * n).toFixed(2)}%`;

    return active
      ? { name: active.name, value: getRate(active.count / aggregates.countBounce) }
      : { name: 'Bounce Rate', value: getRate(aggregates.countBounce / aggregates.countTargeted) };
  }

  getLegendHeaderData = () => {
    const { aggregates } = this.props;
    return [
      { name: 'Targeted', count: aggregates.countTargeted, disableInteraction: true },
      { name: 'Bounce', count: aggregates.countBounce, disableInteraction: true }
    ]
  }

  render() {
    const { categories, types } = this.props;

    return (
      <Grid>
        <Grid.Column xs={6}>
          <div className={styles.ChartWrapper}>
            <BounceChart
              primaryData={categories}
              secondaryData={types}
              active={this.state.active}
              activeSet={this.state.activeSet}
              handleMouseOver={this.handleMouseOver}
              handleMouseOut={this.handleMouseOut}
            />
            <ActiveLabel {...this.getLabelProps()}/>
          </div>
        </Grid.Column>
        <Grid.Column>
          <Legend
            headerData={this.getLegendHeaderData()}
            primaryData={categories}
            secondaryData={types}
            handleMouseOver={this.handleMouseOver}
            handleMouseOut={this.handleMouseOut}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default ChartGroup;
