import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import qs from 'query-string';
import cookie from 'js-cookie';
import _ from 'lodash';

import { CenteredLogo } from 'src/components';
import { Panel, Error, UnstyledLink } from '@sparkpost/matchbox';
import JoinForm from './components/JoinForm';
import JoinError from './components/JoinError';
import JoinLink from './components/JoinLink';
import config from 'src/config';
import { inSPCEU } from 'src/config/tenant';
import { authenticate } from 'src/actions/auth';
import { loadScript } from 'src/helpers/loadScript';
import { addEvent } from 'src/helpers/googleAnalytics';
import { register } from 'src/actions/account';
import { AFTER_JOIN_REDIRECT_ROUTE, LINKS, AWS_COOKIE_NAME } from 'src/constants';

export class JoinPage extends Component {
  state = {
    formData: {}
  };

  getAttributionData = () => {
    const { params } = this.props;
    const existingCookie = cookie.getJSON(config.attribution.cookieName) || {};
    return _.pick({ ...existingCookie, ...params }, config.salesforceDataParams);
  };

  registerSubmit = (values) => {
    this.setState({ formData: values });
    const { params: { plan }, register, authenticate } = this.props;
    const { sfdcid, ...attributionData } = this.getAttributionData();
    const accountFields = _.omit(values, 'email_opt_in');

    const signupData = {
      ...accountFields,
      sfdcid,
      salesforce_data: { ...attributionData, email_opt_out: !values.email_opt_in }
    };

    return register(signupData)
      .then((accountData) => {
        addEvent('Completed form', 'create account', { form_type: 'create account' });
        return authenticate(accountData.username, values.password);
      })
      .then(() => this.props.history.push(AFTER_JOIN_REDIRECT_ROUTE, { plan }));
  };

  render() {
    const { createError } = this.props.account;
    const { formData } = this.state;
    const title = inSPCEU() ? 'Sign Up For SparkPost EU' : 'Sign Up';

    return (
      <div>
        {loadScript({ url: LINKS.RECAPTCHA_LIB_URL })}
        <CenteredLogo showAwsLogo={this.props.isAWSsignUp} />

        <Panel accent title={title}>
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
          left={<small>Already have an account? <UnstyledLink Component={Link} to='/auth'>Log In</UnstyledLink>.</small>}
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
    isAWSsignUp: !!cookie.get(AWS_COOKIE_NAME)
  };
}

export default withRouter(connect(mapStateToProps, { authenticate, register })(JoinPage));
