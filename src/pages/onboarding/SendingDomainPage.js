import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { create as createDomain } from 'src/actions/sendingDomains';
import { showAlert } from 'src/actions/globalAlert';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';
import { TextFieldWrapper, CenteredLogo } from 'src/components';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';
import { required, domain } from 'src/helpers/validation';
import { LINKS } from 'src/constants';

export class SendingDomainPage extends Component {
  handleDomainCreate = (values) => {
    const { createDomain, showAlert } = this.props;

    return createDomain(values).catch((err) => {
      showAlert({ type: 'error', message: 'Could not add domain', details: err.message });

      // Required to properly control 'submitFailed' & 'submitSucceeded'
      throw new SubmissionError(err);
    });
  }

  componentDidUpdate(prevProps) {
    const { submitSucceeded, history } = this.props;

    // Redirect here instead of the createDomain promise
    // to avoid redirects if component unmounts before the promise resolves
    if (!prevProps.submitSucceeded && submitSucceeded) {
      history.push('/onboarding/email');
    }
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
              <SkipLink to='/onboarding/email'>Skip for now</SkipLink>
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
