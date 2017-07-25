import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

// Components
import { Panel, TextField } from '@sparkpost/matchbox';
import ToggleBlock from './ToggleBlock';

// TODO use shared component instead of this
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

const ID_ALLOWED_CHARS = 'a-z0-9_-';

// TODO move this into shared helpers
const slugify = (value) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

class EditForm extends Component {
  // Fills in ID based on Name
  handleIdFill (e) {
    const { newTemplate, change } = this.props;
    if (!newTemplate) {
      return;
    }

    const idValue = slugify(e.target.value).replace(new RegExp(`[^${ID_ALLOWED_CHARS}]`, 'g'), '');

    // Call redux-form change action
    change('id', idValue);
  }

  componentDidUpdate () {
    const { change, newTemplate } = this.props;
    if (newTemplate) {
      change('content.from.email', 'sandbox@sparkpostbox.com');
    }
  }

  render () {
    const { newTemplate } = this.props;

    return (
      <Panel>
        <Panel.Section>
          <Field
            name='name' id='name'
            component={TextFieldWrapper}
            label='Template Name'
            onChange={(e) => this.handleIdFill(e)}
          />

          <Field
            name='id' id='id'
            component={TextFieldWrapper}
            label='Template ID'
            helpText={`A Unique ID for your template, we'll fill this in for you.`}
            disabled={!newTemplate}
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
            disabled={newTemplate}
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
            parse={value => !!value} // Prevents unchecked value from equaling ""
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

export default connect(mapStateToProps, { change })(reduxForm(formOptions)(EditForm));
