import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { updateTemplate } from '../../../actions/templates';

// Components
import { Panel, TextField, Button } from '@sparkpost/matchbox';
import ToggleBlock from './ToggleBlock';

// TODO use shared component instead of this
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

class EditForm extends Component {
  render () {
    const { handleSubmit, updateTemplate } = this.props;

    return (
      <Panel>
        <Panel.Section>
          <Field
            name='name' id='name'
            component={TextFieldWrapper}
            label='Template Name'
          />

          <Field
            name='id' id='id'
            component={TextFieldWrapper}
            label='Template ID'
            helpText={`A Unique ID for your template, we'll fill this in for you.`}
            disabled // TODO disabled when editing
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='content.from.name' id='fromName'
            component={TextFieldWrapper}
            label='From Name'
            helpText='A friendly from for your recipients.'
          />

          <Field
            name='content.from.email' id='fromEmail'
            component={TextFieldWrapper}
            label='From Email'
            // disabled={} TODO disable if no sending domains exist
          />

          <Field
            name='reply_to' id='replyTo'
            component={TextFieldWrapper}
            label='Reply To'
            helpText='An email address recipients can reply to.'
          />

          <Field
            name='content.subject' id='subject'
            component={TextFieldWrapper}
            label='Subject'
          />

          <Field
            name='description' id='description'
            component={TextFieldWrapper}
            label='Description'
            helpText='Not visible to recipients.'
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='options.open_tracking' id='openTracking'
            component={ToggleBlock}
            label='Track Opens'
            type='checkbox'
            parse={value => !!value}
          />

          <Field
            name='options.click_tracking' id='clickTracking'
            component={ToggleBlock}
            label='Track Clicks'
            type='checkbox'
            parse={value => !!value}
          />

        </Panel.Section>

        <Panel.Section>

          <Field
            name='options.transactional' id='transactional'
            component={ToggleBlock}
            label='Transactional'
            type='checkbox'
            parse={value => !!value}
            helpText='Transactional messages are triggered by a user’s actions on the website, like requesting a password reset, signing up, or making a purchase.'
          />

        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ templates: { activeTemplate } }) => ({
  initialValues: { ...activeTemplate }

});

const formOptions = {
  form: 'templateEdit',
  enableReinitialize: true // required to update initial values from redux state
};

// breaks if you do reduxForm first
export default connect(mapStateToProps, { updateTemplate })(reduxForm(formOptions)(EditForm));
