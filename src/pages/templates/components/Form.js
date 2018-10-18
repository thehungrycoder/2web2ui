/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { Field } from 'redux-form';
import config from 'src/config';

// Components
import { Panel } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import SubaccountSection from 'src/components/subaccountSection';
import { TextFieldWrapper, PanelLoading } from 'src/components';
import FromEmailWrapper from './FromEmail';

// Helpers & Validation
import { required, slug } from 'src/helpers/validation';
import { slugify } from 'src/helpers/string';
import { emailOrSubstitution, looseSubstitution } from './validation';

import styles from './FormEditor.module.scss';

export default class Form extends Component {
  // Fills in ID based on Name
  handleIdFill = (e) => {
    const { newTemplate, change, name } = this.props;
    if (!newTemplate) {
      return;
    }

    change(name, 'id', slugify(e.target.value));
  }

  componentDidMount() {
    this.props.listDomains();
  }

  componentWillReceiveProps(nextProps) {
    const { change, newTemplate, name } = this.props;
    const { domains } = nextProps;

    // If no verified sending domains, use sandbox
    if (newTemplate && !domains.length) {
      change(name, 'content.from.email', `${config.sandbox.localpart}@${config.sandbox.domain}`);
    }
  }

  validateDomain = (value) => {
    const { domains } = this.props;

    const parts = value.split('@');

    if (parts.length > 1) {
      const validSandboxDomain = parts[1] === config.sandbox.domain;
      const validDomain = parts[1] && (domains.map(({ domain }) => domain).includes(parts[1]) || !looseSubstitution(parts[1]));

      return validSandboxDomain || validDomain ? undefined : 'Must use a verified sending domain';
    }

    return undefined;
  }

  // Prevents unchecked value from equaling ""
  parseToggle = (value) => !!value

  fromEmailWarning() {
    const { domains, subaccountId } = this.props;

    if (!domains.length) {
      return subaccountId
        ? 'The selected subaccount does not have any verified sending domains.'
        : 'You do not have any verified sending domains to use.';
    }

    return null;
  }

  render() {
    const { newTemplate, readOnly, domains, hasSubaccounts, domainsLoading } = this.props;

    if (domainsLoading) {
      return <PanelLoading />;
    }

    return (
      <div>
        <Panel className={styles.FormPanel}>
          <Panel.Section>
            <Field
              name='name'
              component={TextFieldWrapper}
              label='Template Name'
              onChange={this.handleIdFill}
              disabled={readOnly}
              validate={required}
            />

            <Field
              name='id'
              component={TextFieldWrapper}
              label='Template ID'
              helpText={newTemplate ? 'A Unique ID for your template, we\'ll fill this in for you.' : null}
              disabled={!newTemplate || readOnly}
              validate={newTemplate ? [required, slug] : null}
            />
          </Panel.Section>
          {hasSubaccounts && <SubaccountSection newTemplate={newTemplate} disabled={readOnly} />}
        </Panel>
        <Panel>
          <Panel.Section>
            <Field
              name='content.subject'
              component={TextFieldWrapper}
              label='Subject'
              disabled={readOnly}
              validate={required}
            />

            <Field
              name='content.from.email'
              component={FromEmailWrapper}
              placeholder='example@email.com'
              label='From Email'
              disabled={!domains.length || readOnly}
              validate={[required, emailOrSubstitution, this.validateDomain]}
              domains={domains}
              helpText={this.fromEmailWarning()}
            />

            <Field
              name='content.from.name'
              component={TextFieldWrapper}
              label='From Name'
              helpText='A friendly from for your recipients.'
              disabled={readOnly}
            />

            <Field
              name='content.reply_to'
              component={TextFieldWrapper}
              label='Reply To'
              helpText='An email address recipients can reply to.'
              disabled={readOnly}
              validate={emailOrSubstitution}
            />

            <Field
              name='description'
              component={TextFieldWrapper}
              label='Description'
              helpText='Not visible to recipients.'
              disabled={readOnly}
            />
          </Panel.Section>
        </Panel>
        <Panel>
          <Panel.Section>
            <Field
              name='options.open_tracking'
              component={ToggleBlock}
              label='Track Opens'
              type='checkbox'
              parse={this.parseToggle}
              disabled={readOnly}
            />

            <Field
              name='options.click_tracking'
              component={ToggleBlock}
              label='Track Clicks'
              type='checkbox'
              parse={this.parseToggle}
              disabled={readOnly}
            />
          </Panel.Section>

          <Panel.Section>
            <Field
              name='options.transactional'
              component={ToggleBlock}
              label='Transactional'
              type='checkbox'
              parse={this.parseToggle}
              helpText='Transactional messages are triggered by a user’s actions on the website, like requesting a password reset, signing up, or making a purchase.'
              disabled={readOnly}
            />
          </Panel.Section>
        </Panel>
      </div>
    );
  }
}
