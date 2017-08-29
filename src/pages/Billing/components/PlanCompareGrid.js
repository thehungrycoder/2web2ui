import React from 'react';
import { Grid } from '@sparkpost/matchbox';

// TODO: use a table?
const PlanCompareGrid = ({ currentPlan, selectedPlan }) => {
  // Current plan already has this set up from BillingPage
  selectedPlan.monthly = selectedPlan.monthly ? selectedPlan.monthly : '0';
  selectedPlan.overage = selectedPlan.overage ? selectedPlan.overage : 'N/A';

  return (
    <Grid>
      <Grid.Column xs={2}>
        <p>
          <br/>
          Plan: <br/>
          Price: <br/>
          Emails: <br/>
          Overage: <br/>
        </p>
      </Grid.Column>
      <Grid.Column>
        Current Plan <br/>
        {currentPlan.name} <br/>
        ${currentPlan.monthly.toLocaleString()}/mo <br/>
        {currentPlan.volume.toLocaleString()} <br/>
        {currentPlan.overage.toLocaleString()}
      </Grid.Column>
      <Grid.Column>
        New Plan <br/>
        {selectedPlan.name} <br/>
        ${selectedPlan.monthly.toLocaleString()}/mo <br/>
        {selectedPlan.volume.toLocaleString()} <br/>
        {selectedPlan.overage.toLocaleString()}
      </Grid.Column>
    </Grid>
  );
};

export default PlanCompareGrid;
