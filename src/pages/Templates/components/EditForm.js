import React, { Component } from 'react';

// Components
import { Panel, TextField } from '@sparkpost/matchbox';

class EditForm extends Component {
  render () {
    return (
      <Panel sectioned>
        <TextField label='Template Name'/>

        <TextField label='Template ID' disabled value='asdfsd' />
        <p>A Unique ID for your template, we'll fill this in for you.</p>

        <TextField label='From Name'/>
        <p>A friendly from for your recipients.</p>

        <TextField label='From Email'/>

        <TextField label='Reply To'/>
        <p>An email address recipients can reply to.</p>

        <TextField label='Subject'/>

        <TextField label='Description'/>
        <p>Not visible to recipients.</p>
      </Panel>
    );
  }
}

export default EditForm;
