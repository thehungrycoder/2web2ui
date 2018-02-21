import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';

import { CenteredLogo } from 'src/components';
import { Panel, Error, UnstyledLink } from '@sparkpost/matchbox';
import JoinForm from './components/JoinForm';
import JoinError from './components/JoinError';
import config from 'src/config';
import { logout } from 'src/actions/auth';
import { authenticate } from 'src/actions/auth';
import { loadScript } from 'src/helpers/loadScript';
import { addEvent } from 'src/helpers/googleAnalytics';
import { register } from 'src/actions/account';
import { AFTER_JOIN_REDIRECT_ROUTE, LINKS } from 'src/constants';
const { attribution, salesforceDataParams } = config;

export class JoinPage extends Component {

  state = {
    formData: {}
  };

  componentDidMount() {
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

  registerSubmit = (values) => {
    this.setState({ formData: values });
    const { register, authenticate } = this.props;
    const attributionData = this.getAndSetAttributionData();

    const signupData = { ...values, salesforce_data: attributionData, sfdcid: attributionData.sfdcid };

    return register(signupData)
      .then((accountData) => {
        addEvent('Completed form', 'create account', { form_type: 'create account' });
        return authenticate(accountData.username, values.password);
      })
      .then(() => this.props.history.push(AFTER_JOIN_REDIRECT_ROUTE));
    //.catch((e) => {});
  };

  render() {
    const { createError } = this.props.account;
    const { formData } = this.state;
    return (
      <div>
        {loadScript({ url: LINKS.RECAPTCHA_LIB_URL })}
        <CenteredLogo />

        <Panel sectioned accent title="Log In">
          { createError && <Error error={<JoinError errors={createError} data={formData} />} /> }

          <JoinForm onSubmit={this.registerSubmit} />
        </Panel>
        <small>Already have an account? <UnstyledLink to={'/auth'}>Log In</UnstyledLink>.</small>
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
