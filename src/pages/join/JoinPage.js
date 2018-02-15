/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { SparkPost } from 'src/components';
import { Panel, UnstyledLink, Error } from '@sparkpost/matchbox';
import JoinForm from './components/JoinForm';
import styles from './JoinPage.module.scss';
import config from 'src/config';
import { logout } from 'src/actions/auth';
import { authenticate, login } from 'src/actions/auth';

import { register } from 'src/actions/account';
import { DEFAULT_REDIRECT_ROUTE, LINKS } from 'src/constants';
const { attribution, salesforceDataParams, links, gaTag } = config;


export class JoinPage extends Component {

  state = {
    formData: {}
  }

  injectGA() { //TODO find better way of doing this in react. 
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
    const cookieOptions = {
      expires: attribution.cookieDuration,
      expirationUnit: 'seconds',
      path: '/',
      domain: attribution.cookieDomain
    };

    if (!trackingData) {
      trackingData = _.pick(params, salesforceDataParams);
      cookie.set(attribution.cookieName, trackingData, cookieOptions);
    }
    return trackingData;
  }

  createSupportLink() {
    const { formData } = this.state;
    return links.submitTicket + encodeURI('?interaction[name]=' + formData.first_name + ' ' + formData.last_name + '&interaction[email]=' + formData.email + '&email[subject]=Account requires manual review');
  }

  handleSignupFailure = (error) => {
    let status;
    let mainError; 
    const { formData } = this.state;
    try { 
      if(error.response.data.errors[0].message) {
        mainError = error.response.data.errors[0].message;
      } else {
        mainError = error.message;
      }
      status = error.response.status;
    } catch(e) {}

    if (status === 400 && mainError.match(/\brecaptcha\b/i)) {
      return 'There was an error with your reCAPTCHA response, please try again.';
    } else if ((status === 400 || status === 403) && mainError.match(/^invalid email/i)) {
      return 'Email address is not valid.';
    } else if (status === 409 && mainError.match(/^AWS Account already exists/i)) {
      return 'It looks like you\'ve already created a SparkPost account through the AWS Marketplace. There may be a brief delay for your AWS account info to synchronize. Please wait a few minutes and then sign in.';
    } else if (status === 409 && mainError.match(/\bemail\b/i)) {
      return <span>It looks like you already have a SparkPost account with {formData.email}. 
         <UnstyledLink to="/auth">Sign in</UnstyledLink>
      </span>;
    } else if (status === 403 && mainError.match(/^Sign up blocked/i)) {
      return <span>Your account requires manual review. To proceed with sign up, please <UnstyledLink to={this.createSupportLink()}>contact support</UnstyledLink>.</span>;
    } else if (status === 403 && mainError.match(/^forbidden/i)) {
      return 'SparkPost is not currently available in your location.';
    } else {
      return <span>Something went wrong. Please try again in a few minutes or <UnstyledLink to={links.submitTicket}>contact support</UnstyledLink></span>
    }
  }

  trackSignup = () => {
    //TODO verify data structure and/or move it to an Analytics service (ask brian).
    window.gtag('config', gaTag, { 
      event_category: 'Completed form', 
      event_action: 'create account', 
      data: { form_type: 'create account' }
    });
  }

  registerSubmit = (values) => {
    //TODO
    //- retrieve salesforce_data - DONE
    //- retrieve sfdcid - DONE
    //- retrieve analytics session id - SKIP
    //- handle and retrieve recaptcha - DONE
    //- track signup after signup is completed - DONE
    //- fix TOU checkbox alignment when validation error is shown
    //- handle recaptcha lib loading on join page only
    //- Enable eslint

    this.setState({ formData: values });
    const { register, authenticate } = this.props;
    const attributionData = this.getAndSetAttributionData();

    const signupData = { ...values, salesforce_data: attributionData, sfdcid: attributionData.sfdcid };

    return register(signupData)
      .then((accountData) => {
        this.trackSignup();
        return authenticate(accountData.username, values.password);
      })
      .then(() => this.props.history.push(DEFAULT_REDIRECT_ROUTE))
      .catch((e) => {});
  }

  renderError = (errors) => {
    return (
      <Error error={this.handleSignupFailure(errors)} />
    );
  }

  render() {
    const { createError } = this.props.account;
    return (
      <div>
        <div className={styles.LogoWrapper}>
          <UnstyledLink to={LINKS.SP_HOME_PAGE} title="SparkPost">
            <SparkPost.Logo />
          </UnstyledLink>
        </div>

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
