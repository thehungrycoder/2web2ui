import React from 'react';
import { Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import CheckboxGroup from '../components/CheckboxGroup';

/* Takes in the event tree and builds a grid of checkboxes using the
CheckboxGroup component */
export default function(eventsTree) {
  const checkboxes = eventsTree.map((parent, index) => {
    const options = parent.events.map((child) => ({ label: child.label, value: child.key }));

    return (
    <Grid.Column xs={2} lg={2} md={2} key={index}>
      <Field parent={parent.label} name={parent.key} options={options} component={CheckboxGroup} />
    </Grid.Column>
    );
  });

  return (<Grid>{checkboxes}</Grid>);
}
