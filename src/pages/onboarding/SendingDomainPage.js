import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { create as createDomain } from 'src/actions/sendingDomains';
import { showAlert } from 'src/actions/globalAlert';
import { Panel, UnstyledLink, Button, Icon } from '@sparkpost/matchbox';
import { TextFieldWrapper, CenteredLogo } from 'src/components';
import Steps from './components/Steps';
import { required, domain } from 'src/helpers/validation';
import { LINKS } from 'src/constants';

import styles from './Onboarding.module.scss';

class SendingDomainPage extends Component {
  handleDomainCreate = (values) => {
    const { createDomain, showAlert, history } = this.props;

    return createDomain(values).then(() => {
      history.push('/super-hidden-route/email');
    }).catch((err) => {
      showAlert({ type: 'error', message: 'Could not add domain', details: err.message });
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='Welcome to SparkPost!'>
          <form onSubmit={handleSubmit(this.handleDomainCreate)}>

            <Panel.Section>
              <p>Let's get you set up to send some email!</p>
              <p>Which domain will you be sending from? <UnstyledLink to={LINKS.ONBOARDING_SENDING} external>Learn more about sending domains</UnstyledLink>.</p>
              <Field
                component={TextFieldWrapper}
                label='Domain Name'
                placeholder='email.example.com'
                name='domain'
                validate={[required, domain]}
                disabled={submitting}
              />
            </Panel.Section>
            <Panel.Section>
              <Button primary submit disabled={submitting}>{submitting ? 'Adding Domain...' : 'Add Domain'}</Button>
              <UnstyledLink
                to='/super-hidden-route/email'
                Component={Link}
                className={styles.SkipLink}>
                  Skip for now <Icon name='ArrowRight'/>
              </UnstyledLink>
            </Panel.Section>
          </form>
          <Steps />
        </Panel>
      </Fragment>
    );
  }
}


const formOptions = { form: 'onboardingDomain' };
export default withRouter(connect(null, { createDomain, showAlert })(reduxForm(formOptions)(SendingDomainPage)));
