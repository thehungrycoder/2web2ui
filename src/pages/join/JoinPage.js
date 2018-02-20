import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { CenteredLogo } from 'src/components';
import { Panel, UnstyledLink, Error } from '@sparkpost/matchbox';
import JoinForm from './components/JoinForm';
import config from 'src/config';
import { logout } from 'src/actions/auth';
import { authenticate } from 'src/actions/auth';

import { register } from 'src/actions/account';
import { DEFAULT_REDIRECT_ROUTE, LINKS } from 'src/constants';
const { attribution, salesforceDataParams, gaTag } = config;

export class JoinPage extends Component {

  state = {
    formData: {}
  };

  injectGA() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    document.body.appendChild(script);
  }

  componentDidMount() {
    this.injectGA();
    this.props.logout();
  }

  getAndSetAttributionData = () => {
    const { params } = this.props;

    let trackingData = cookie.getJSON(attribution.cookieName);

    if (!trackingData) {
      const cookieOptions = {
        expires: attribution.cookieDuration,
        expirationUnit: 'seconds',
        path: '/',
        domain: attribution.cookieDomain
      };

      trackingData = _.pick(params, salesforceDataParams);
      cookie.set(attribution.cookieName, trackingData, cookieOptions);
    }
    return trackingData;
  };

  createSupportLink() {
    const { formData } = this.state;
    return LINKS.SUBMIT_SUPPORT_TICKET + encodeURI(`?interaction[name]=${formData.first_name} ${formData.last_name}&interaction[email]=${formData.email}&email[subject]=Account requires manual review`);
  }

  handleSignupFailure = (error) => {
    let status;
    let mainError;
    const { formData } = this.state;
    try {
      mainError = error.response.data.errors[0].message;
      status = error.response.status;
    } catch (e) {
      mainError = <span>Something went wrong. Please try again in a few minutes or <UnstyledLink to={LINKS.SUBMIT_SUPPORT_TICKET}>contact support</UnstyledLink></span>;
    }

    if (status === 400 && mainError.match(/\brecaptcha\b/i)) {
      return 'There was an error with your reCAPTCHA response, please try again.';
    } else if ((status === 400 || status === 403) && mainError.match(/^invalid email/i)) {
      return 'Email address is not valid.';
    } else if (status === 409 && mainError.match(/^AWS Account already exists/i)) {
      return 'It looks like you\'ve already created a SparkPost account through the AWS Marketplace. There may be a brief delay for your AWS account info to synchronize. Please wait a few minutes and then sign in.';
    } else if (status === 409 && mainError.match(/\bemail\b/i)) {
      return <span>It looks like you already have a SparkPost account with {formData.email}.&nbsp;
      <UnstyledLink to="/auth">Sign in</UnstyledLink>
      </span>;
    } else if (status === 403 && mainError.match(/^Sign up blocked/i)) {
      return <span>Your account requires manual review. To proceed with sign up, please <UnstyledLink to={this.createSupportLink()}>contact support</UnstyledLink>.</span>;
    } else if (status === 403 && mainError.match(/^forbidden/i)) {
      return 'SparkPost is not currently available in your location.';
    } else {
      return mainError;
    }
  };

  trackSignup = () => {
    window.gtag('config', gaTag, {
      event_category: 'Completed form',
      event_action: 'create account',
      data: { form_type: 'create account' }
    });
  };

  registerSubmit = (values) => {
    this.setState({ formData: values });
    const { register, authenticate } = this.props;
    const attributionData = this.getAndSetAttributionData();

    const signupData = { ...values, salesforce_data: attributionData, sfdcid: attributionData.sfdcid };

    return register(signupData)
      .then((accountData) => {
        this.trackSignup();
        return authenticate(accountData.username, values.password);
      })
      .then(() => this.props.history.push(DEFAULT_REDIRECT_ROUTE));
    //.catch((e) => {});
  };

  renderError = (errors) => (
    <Error error={this.handleSignupFailure(errors)} />
  );

  render() {
    const { createError } = this.props.account;
    return (
      <div>
        <CenteredLogo />

        <Panel sectioned accent title="Log In">
          { createError && this.renderError(createError)}

          <JoinForm onSubmit={this.registerSubmit} />
        </Panel>
        Already have an account? <Link to={'/auth'}>Log In</Link>.
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    account: state.account,
    params: qs.parse(props.location.search)
  };
}

export default withRouter(connect(mapStateToProps, { logout, authenticate, register })(JoinPage));
