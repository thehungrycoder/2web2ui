import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { create as createDomain } from 'src/actions/sendingDomains';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';
import { TextFieldWrapper, CenteredLogo } from 'src/components';
import Steps from './components/Steps';
import SkipLink from './components/SkipLink';
import { required, domain } from 'src/helpers/validation';
import * as analytics from 'src/helpers/analytics';
import { LINKS, ANALYTICS_ONBOARDING, ANALYTICS_ONBOARDING_LEARN_MORE, ANALYTICS_ONBOARDING_CREATE_DOMAIN } from 'src/constants';

export class SendingDomainPage extends Component {
  handleDomainCreate = (values) => {
    const { createDomain } = this.props;

    return createDomain(values).catch((err) => {
      // Required to properly control 'submitFailed' & 'submitSucceeded'
      throw new SubmissionError(err);
    });
  }

  componentDidUpdate(prevProps) {
    const { submitSucceeded, history } = this.props;

    // Redirect here instead of the createDomain promise
    // to avoid redirects if component unmounts before the promise resolves
    if (!prevProps.submitSucceeded && submitSucceeded) {
      analytics.trackEvent(ANALYTICS_ONBOARDING, ANALYTICS_ONBOARDING_CREATE_DOMAIN, { action: ANALYTICS_ONBOARDING_CREATE_DOMAIN });
      history.push('/onboarding/email');
    }
  }

  trackLearnMoreClick = () => analytics.trackEvent(ANALYTICS_ONBOARDING, ANALYTICS_ONBOARDING_LEARN_MORE,
    { action: ANALYTICS_ONBOARDING_LEARN_MORE });

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent title='Welcome to SparkPost!'>
          <form onSubmit={handleSubmit(this.handleDomainCreate)}>
            <Panel.Section>
              <p>Let's get you set up to send some email!</p>
              <p>Which domain will you be sending from? <UnstyledLink to={LINKS.ONBOARDING_SENDING} onClick={this.trackLearnMoreClick} external>
              Learn more about sending domains</UnstyledLink>.</p>
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
export default withRouter(connect(null, { createDomain })(reduxForm(formOptions)(SendingDomainPage)));
