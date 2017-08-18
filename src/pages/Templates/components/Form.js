import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

// Components
import { Panel, TextField } from '@sparkpost/matchbox';
import ToggleBlock from './ToggleBlock';

import styles from './FormEditor.module.scss';

// TODO use shared component instead of this
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

const ID_ALLOWED_CHARS = 'a-z0-9_-';

// TODO move this into shared helpers
const slugify = (value) => value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();

class Form extends Component {
  // Fills in ID based on Name
  handleIdFill(e) {
    const { newTemplate, change } = this.props;
    if (!newTemplate) {
      return;
    }

    const idValue = slugify(e.target.value).replace(new RegExp(`[^${ID_ALLOWED_CHARS}]`, 'g'), '');
    change('id', idValue);
  }

  componentDidMount() {
    const { change, newTemplate } = this.props;
    if (newTemplate) { // TODO update to reflect sending domains
      change('content.from.email', 'sandbox@sparkpostbox.com');
    }
  }

  render() {
    const { newTemplate, published } = this.props;

    return (
      <Panel className={styles.Panel}>
        <Panel.Section>
          <Field
            name='name' id='name'
            component={TextFieldWrapper}
            label='Template Name'
            onChange={(e) => this.handleIdFill(e)}
            disabled={published}
          />

          <Field
            name='id' id='id'
            component={TextFieldWrapper}
            label='Template ID'
            helpText={'A Unique ID for your template, we\'ll fill this in for you.'}
            disabled={!newTemplate || published}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='content.from.name' id='fromName'
            component={TextFieldWrapper}
            label='From Name'
            helpText='A friendly from for your recipients.'
            disabled={published}
          />

          <Field
            name='content.from.email' id='fromEmail'
            component={TextFieldWrapper}
            label='From Email'
            disabled={newTemplate || published}
          />

          <Field
            name='reply_to' id='replyTo'
            component={TextFieldWrapper}
            label='Reply To'
            helpText='An email address recipients can reply to.'
            disabled={published}
          />

          <Field
            name='content.subject' id='subject'
            component={TextFieldWrapper}
            label='Subject'
            disabled={published}
          />

          <Field
            name='description' id='description'
            component={TextFieldWrapper}
            label='Description'
            helpText='Not visible to recipients.'
            disabled={published}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='options.open_tracking' id='openTracking'
            component={ToggleBlock}
            label='Track Opens'
            type='checkbox'
            parse={(value) => !!value} // Prevents unchecked value from equaling ""
            disabled={published}
          />

          <Field
            name='options.click_tracking' id='clickTracking'
            component={ToggleBlock}
            label='Track Clicks'
            type='checkbox'
            parse={(value) => !!value}
            disabled={published}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='options.transactional' id='transactional'
            component={ToggleBlock}
            label='Transactional'
            type='checkbox'
            parse={(value) => !!value}
            helpText='Transactional messages are triggered by a user’s actions on the website, like requesting a password reset, signing up, or making a purchase.'
            disabled={published}
          />
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = (state, { name }) => ({ form: name });
const formOptions = {};

export default compose(
  connect(mapStateToProps, { change }),
  reduxForm(formOptions)
)(Form);
