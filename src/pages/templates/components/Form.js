import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';
import { list as listDomains } from 'src/actions/sendingDomains';
import { selectVerifiedDomains } from 'src/selectors/sendingDomains';
import config from 'src/config';

// Components
import { Panel } from '@sparkpost/matchbox';
import ToggleBlock from './ToggleBlock';
import { TextFieldWrapper } from 'src/components';
import FromDomainWrapper from './FromDomain';

// Helpers & Validation
import { required } from 'src/helpers/validation';
import { slugify } from 'src/helpers/string';
import { ID_ALLOWED_CHARS, idSyntax, emailOrSubstitution, verifiedDomain } from './validation';

import styles from './FormEditor.module.scss';

class Form extends Component {
  // Fills in ID based on Name
  handleIdFill = (e) => {
    const { newTemplate, change, name } = this.props;
    if (!newTemplate) {
      return;
    }

    const idValue = slugify(e.target.value).replace(new RegExp(`[^${ID_ALLOWED_CHARS}]`, 'g'), '');
    change(name, 'id', idValue);
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

  render() {
    const { newTemplate, published, domains } = this.props;
    console.log('DOMAINS', domains);
    return (
      <Panel className={styles.FormPanel}>
        <Panel.Section>
          <Field
            name='name'
            component={TextFieldWrapper}
            label='Template Name'
            onChange={this.handleIdFill}
            disabled={published}
            validate={required}
          />

          <Field
            name='id'
            component={TextFieldWrapper}
            label='Template ID'
            helpText={'A Unique ID for your template, we\'ll fill this in for you.'}
            disabled={!newTemplate || published}
            validate={[required, idSyntax]}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='content.from.name'
            component={TextFieldWrapper}
            label='From Name'
            helpText='A friendly from for your recipients.'
            disabled={published}
          />

          <Field
            name='content.from.email'
            component={FromDomainWrapper}
            label='From Email'
            disabled={!domains.length || published}
            validate={[required, emailOrSubstitution, verifiedDomain]}
            domains={domains}
          />

          <Field
            name='reply_to'
            component={TextFieldWrapper}
            label='Reply To'
            helpText='An email address recipients can reply to.'
            disabled={published}
            validate={emailOrSubstitution}
          />

          <Field
            name='content.subject'
            component={TextFieldWrapper}
            label='Subject'
            disabled={published}
            validate={required}
          />

          <Field
            name='description'
            component={TextFieldWrapper}
            label='Description'
            helpText='Not visible to recipients.'
            disabled={published}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='options.open_tracking'
            component={ToggleBlock}
            label='Track Opens'
            type='checkbox'
            parse={(value) => !!value} // Prevents unchecked value from equaling ""
            disabled={published}
          />

          <Field
            name='options.click_tracking'
            component={ToggleBlock}
            label='Track Clicks'
            type='checkbox'
            parse={(value) => !!value}
            disabled={published}
          />
        </Panel.Section>

        <Panel.Section>
          <Field
            name='options.transactional'
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

const mapStateToProps = (state) => ({
  domains: selectVerifiedDomains(state)
});

export default connect(mapStateToProps, { change, listDomains })(Form);
