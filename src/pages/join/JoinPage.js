import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';

import { CenteredLogo, PageLink } from 'src/components';
import { Panel, Error } from '@sparkpost/matchbox';
import JoinForm from './components/JoinForm';
import JoinError from './components/JoinError';
import JoinLink from './components/JoinLink';
import config from 'src/config';
import { inSPCEU } from 'src/config/tenant';
import { authenticate } from 'src/actions/auth';
import { loadScript } from 'src/helpers/loadScript';
import * as analytics from 'src/helpers/analytics';
import { register } from 'src/actions/account';
import { AFTER_JOIN_REDIRECT_ROUTE, LINKS, AWS_COOKIE_NAME, ANALYTICS_CREATE_ACCOUNT } from 'src/constants';

export class JoinPage extends Component {
  state = {
    formData: {}
  };

  extractQueryParams = () => {
    const { params } = this.props;
    const existingCookie = cookie.getJSON(config.attribution.cookieName) || {};

    const allData = { ...existingCookie, ...params };

    return {
      sfdcid: allData.sfdcid,
      attributionData: _.pick(allData, config.salesforceDataParams),
      creationParams: allData
    };
  }

  registerSubmit = (values) => {
    this.setState({ formData: values });
    const { params: { plan }, register, authenticate } = this.props;
    const { sfdcid, attributionData, creationParams } = this.extractQueryParams();

    const accountFields = _.omit(values, 'email_opt_in');
    const signupData = {
      ...accountFields,
      sfdcid,
      salesforce_data: { ...attributionData, email_opt_out: !values.email_opt_in },
      creation_params: creationParams
    };

    return register(signupData)
      .then((accountData) => {
        analytics.setVariable('username', accountData.username);
        analytics.trackFormSuccess(ANALYTICS_CREATE_ACCOUNT, { form_type: ANALYTICS_CREATE_ACCOUNT });
        return authenticate(accountData.username, values.password);
      })
      .then(() => this.props.history.push(AFTER_JOIN_REDIRECT_ROUTE, { plan }));
  };

  render() {
    const { createError } = this.props.account;
    const { formData } = this.state;

    return (
      <div>
        {loadScript({ url: LINKS.RECAPTCHA_LIB_URL })}
        <CenteredLogo showAwsLogo={this.props.isAWSsignUp} />

        <Panel accent title={this.props.title}>
          {
            createError &&
              <Panel.Section>
                <Error error={<JoinError errors={createError} data={formData} />} />
              </Panel.Section>
          }
          <Panel.Section>
            <JoinForm onSubmit={this.registerSubmit} />
          </Panel.Section>
        </Panel>
        <Panel.Footer
          left={<small>Already have an account? <PageLink to="/auth">Log In</PageLink>.</small>}
          right={<JoinLink location={this.props.location} />}
        />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    account: state.account,
    params: qs.parse(props.location.search),
    isAWSsignUp: !!cookie.get(AWS_COOKIE_NAME),
    title: inSPCEU() ? 'Sign Up For SparkPost EU' : 'Sign Up'
  };
}

export default withRouter(connect(mapStateToProps, { authenticate, register })(JoinPage));
