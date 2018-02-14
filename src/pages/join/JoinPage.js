/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { SparkPost } from 'src/components';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import JoinForm from './JoinForm';
import styles from './JoinPage.module.scss';
import config from 'src/config';
import { logout } from 'src/actions/auth';
import { register } from 'src/actions/account';
import { DEFAULT_REDIRECT_ROUTE, LINKS } from 'src/constants';
const { attribution, salesforceDataParams } = config;

export class JoinPage extends Component {

  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    document.body.appendChild(script); //TODO find better way of doing this in react. 

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

  handleSignupFailure = (errors) => {
    console.error(errors);
  }

  registerSubmit = (values) => {
    //TODO
    //- retrieve salesforce_data - DONE
    //- retrieve sfdcid - DONE
    //- retrieve analytics session id
    //- handle and retrieve recaptcha - DONE
    //- track signup after signup is completed
    //- fix TOU checkbox alignment when validation error is shown
    //- handle recaptcha lib loading on join page only

    console.log('received', values);
    const { register } = this.props;
    const attributionData = this.getAndSetAttributionData();

    const signupData = { ...values, salesforce_data: attributionData, sfdcid: attributionData.sfdcid };

    /*
    {"results":{"message":"Account created, welcome to SparkPost!","customer_id":209744,"username":"mohammad-hossain-8613"}}
    */
    return register(signupData)
      .then((accountData) => this.props.authenticate(accountData.username, values.password))
      .then(() => this.props.history.push(DEFAULT_REDIRECT_ROUTE))
      .catch(this.handleSignupFailure);
  }

  render() {
    return (
      <div>
        <div className={styles.LogoWrapper}>
          <UnstyledLink to={LINKS.SP_HOME_PAGE} title="SparkPost">
            <SparkPost.Logo />
          </UnstyledLink>
        </div>

        <Panel sectioned accent title="Log In">
          <JoinForm onSubmit={this.registerSubmit} />
        </Panel>
        Already have an account? <Link to={'/auth'}>Log In</Link>.
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    params: qs.parse(props.location.search)
  };
}

export default withRouter(connect(mapStateToProps, { logout, register })(JoinPage));
