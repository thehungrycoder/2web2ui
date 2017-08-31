import React from 'react';
import { Panel, Grid } from '@sparkpost/matchbox';

function formatCurrentPlan (currentPlan) {
  const formattedPlan = { monthly: 0, overage: 'N/A' };

  if (!currentPlan) {
    currentPlan = { monthly: 0, volume: 0, overage: 0 };
  }

  if (currentPlan.overage) {
    formattedPlan.overage = `${currentPlan.overage.toLocaleString()} per email`;
  }

  if (currentPlan.monthly) {
    formattedPlan.monthly = `${currentPlan.monthly.toLocaleString()} monthly`;
  }

  formattedPlan.volume = currentPlan.volume.toLocaleString();

  return formattedPlan;
}

const YourPlanPanel = ({ currentPlan, actions }) => {
  // for plans without a monthly
  const formattedPlan = formatCurrentPlan(currentPlan);

  return (
    <Panel sectioned accent title='Your Plan' actions={actions}>
      <Panel.Section >
        <Grid>
          <Grid.Column>
            Price <br/><br/>
            ${ formattedPlan.monthly}
          </Grid.Column>
          <Grid.Column>
            Emails <br/><br/>
            { formattedPlan.volume }
          </Grid.Column>
          <Grid.Column>
            Overage <br/><br/>
            { formattedPlan.overage }
          </Grid.Column>
        </Grid>
      </Panel.Section>
    </Panel>
  );
};

export default YourPlanPanel;
