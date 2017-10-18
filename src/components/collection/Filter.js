import React from 'react';
import { Panel, Grid, TextField } from '@sparkpost/matchbox';

export default function CollectionFilter({ onChange }) {
  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <Panel>
      <Grid>
        <Grid.Column>
          <TextField onChange={handleChange} />
        </Grid.Column>
      </Grid>
    </Panel>
  );
}
