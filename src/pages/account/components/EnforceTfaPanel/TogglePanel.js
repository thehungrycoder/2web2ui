import React from 'react';
import { Grid, Panel, Toggle } from '@sparkpost/matchbox';
import LabelledValue from 'src/components/labelledValue/LabelledValue';

export const TogglePanel = ({ readOnly, tfaRequired, toggleTfaRequired }) => {
  const tfaRequiredMsg = tfaRequired
    ? 'All users must have two-factor authentication enabled to login to this account.'
    : 'Each user can manage their own two-factor authentication settings.';

  return (
    <Panel.Section>
      <Grid>
        <Grid.Column xs={11}>
          <LabelledValue label="Status">
            <h6>{tfaRequired ? 'Required' : 'Optional'}</h6>
            <p>{tfaRequiredMsg}</p>
          </LabelledValue>
        </Grid.Column>
        <Grid.Column xs={1}>
          <Toggle
            id="enforceTfa"
            disabled={readOnly}
            checked={tfaRequired}
            onChange={toggleTfaRequired}
          />
        </Grid.Column>
      </Grid>
    </Panel.Section>
  );
};

export default TogglePanel;
