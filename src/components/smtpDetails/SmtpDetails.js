import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UnstyledLink } from '@sparkpost/matchbox';
import { LabelledValue, CopyField } from 'src/components';

import config from 'src/config';
const smtpAuth = config.smtpAuth;
const smtpDesc = 'Use the information below to configure your SMTP client to relay via SparkPost.';

/**
 * SMTP Info Table
 * autoGenerateKey - enables a CopyField and creates a new apie key on mount
 */
class SmtpDetails extends Component {
  componentDidMount() {
    // TODO generate key
  }

  render() {
    const { autoGenerateKey } = this.props;

    const smtpDescContent = autoGenerateKey
      ? `${smtpDesc} We generated an API key for you to use as a password.`
      : `${smtpDesc} You need an API key to use as a password when filling out the information.`;

    const passwordContent = autoGenerateKey
      ? <CopyField value='password'/>
      : <p>The password is an API key with <strong>Send via SMTP</strong><em>(smtp/inject)</em> permisions.  <UnstyledLink to='/account/api-keys' Component={Link}>Manage API Keys</UnstyledLink></p>;

    return (
      <Fragment>
        <p>{smtpDescContent}</p>
        <LabelledValue label='Host' value={smtpAuth.host}/>
        <LabelledValue label='Port' value={smtpAuth.port}/>
        { config.smtpAuth.alternativePort && <LabelledValue label='Alternative Port' value={`${smtpAuth.alternativePort}`}/> }
        <LabelledValue label='Authentication' value='AUTH LOGIN'/>
        <LabelledValue label='Encryption' value='STARTTLS'/>
        <LabelledValue label='Username' value={smtpAuth.username}/>
        <LabelledValue label='Password'>{passwordContent}</LabelledValue>
      </Fragment>
    );
  }
}

SmtpDetails.defaultProps = {
  autoGenerateKey: false
};

SmtpDetails.propTypes = {
  autoGenerateKey: PropTypes.bool
};

export default SmtpDetails;
