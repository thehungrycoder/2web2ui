import React from 'react';
import { Grid, Panel, Toggle } from '@sparkpost/matchbox';
import LabelledValue from 'src/components/labelledValue/LabelledValue';
import ExternalLink from 'src/components/externalLink/ExternalLink';
import { LINKS } from 'src/constants';

export const TogglePanel = ({ tfaRequired, toggleTfaRequired }) => (
  <Panel
    title="Two-factor Authentication"
    actions={[
      {
        color: 'orange',
        content: 'Learn more',
        component: ExternalLink,
        to: LINKS.MANDATORY_TFA
      }
    ]}
  >
    <Panel.Section>
      <Grid>
        <Grid.Column xs={11}>
          <LabelledValue label="Status">
            <h6>{tfaRequired ? 'Required' : 'Optional'}</h6>
            <p>
              {tfaRequired
                ? 'All users must have two-factor authentication enabled to login to this account.'
                : 'Each user can manage their own two-factor authentication settings.'}
            </p>
          </LabelledValue>
        </Grid.Column>
        <Grid.Column xs={1}>
          <Toggle
            id="enforceTfa"
            checked={tfaRequired}
            onChange={toggleTfaRequired}
          />
        </Grid.Column>
      </Grid>
    </Panel.Section>
  </Panel>
);

export default TogglePanel;
