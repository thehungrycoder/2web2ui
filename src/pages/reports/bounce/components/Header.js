import React from 'react';
import { Panel, Grid } from '@sparkpost/matchbox';

// TODO finish this
const Header = ({ aggregates }) => {
  if (!aggregates) {
    return null;
  }

  const bounceRate = 100 * (aggregates.countBounce / aggregates.countTargeted);

  return (
    <Grid>
      <Grid.Column>
        <Panel sectioned>
          <h3>{ bounceRate.toFixed(2) }%</h3>
          <p>Bounce Rate</p>
          <p>{ aggregates.countBounce.toLocaleString() } Bounces of { aggregates.countTargeted.toLocaleString() } Targeted</p>
        </Panel>
      </Grid.Column>
    </Grid>
  );
};

export default Header;
