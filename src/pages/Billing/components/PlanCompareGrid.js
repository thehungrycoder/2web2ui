import React from 'react';
import { Grid } from '@sparkpost/matchbox';

function formatPlan (plan) {
  const formattedPlan = { monthly: '0', overage: 'N/A' };

  if (!plan) {
    plan = { name: '', monthly: 0, volume: 0, overage: 0 };
  }

  if (plan.overage) {
    formattedPlan.overage = `${plan.overage.toLocaleString()} per email`;
  }

  if (plan.monthly) {
    formattedPlan.monthly = `${plan.monthly.toLocaleString()} monthly`;
  }

  formattedPlan.volume = plan.volume.toLocaleString();
  formattedPlan.name = plan.name;

  return formattedPlan;
}

// TODO: use a table? <br/> are the best
const PlanCompareGrid = ({ currentPlan, selectedPlan }) => {
  const formattedCurrentPlan = formatPlan(currentPlan);
  const formattedSelectedPlan = formatPlan(selectedPlan);

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
        {formattedCurrentPlan.name} <br/>
        ${formattedCurrentPlan.monthly}<br/>
        {formattedCurrentPlan.volume} <br/>
        {formattedCurrentPlan.overage}
      </Grid.Column>
      <Grid.Column>
        New Plan <br/>
        {formattedSelectedPlan.name} <br/>
        ${formattedSelectedPlan.monthly}<br/>
        {formattedSelectedPlan.volume} <br/>
        {formattedSelectedPlan.overage}
      </Grid.Column>
    </Grid>
  );
};

export default PlanCompareGrid;
