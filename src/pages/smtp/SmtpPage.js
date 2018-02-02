import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import { Page, Panel } from '@sparkpost/matchbox';
import { LabelledValue, ShortKeyCode } from 'src/components';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { update as updateAccount } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';
import { listApiKeys } from 'src/actions/api-keys';
import { selectApiKeysForSmtp } from 'src/selectors/api-keys';
import config from 'src/config';
const smtpAuth = config.smtpAuth;
const smtpDesc = 'Use the information below to configure your SMTP client to relay via SparkPost. You need an API key to use as a password when filling out the information.';

export class SmtpPage extends Component {
  componentDidMount() {
    this.props.listApiKeys({ id: 0 });
  }

  toggleTracking = () => {
    const { updateAccount } = this.props;
    const { account: { options: { smtp_tracking_default }}} = this.props;
    const body = {
      options: {
        smtp_tracking_default: !smtp_tracking_default
      }
    };

    return updateAccount(body)
      .then(() => showAlert({
        type: 'success',
        message: 'Default SMTP Engagement Tracking updated.'
      }))
      .catch((err) => showAlert({
        type: 'error',
        message: 'Unable to update SMTP Engagement Tracking.',
        details: err.message
      }));
  };

  renderSMTPDeets() {
    const { shortKey } = this.props;

    return (
      <Panel sectioned>
        <p>{smtpDesc}</p>
        <LabelledValue label='Host' value={smtpAuth.host}/>
        <LabelledValue label='Port' value={smtpAuth.port}/>
        { config.smtpAuth.alternativePort && <LabelledValue label='Alternative Port' value={`${smtpAuth.alternativePort}`}/> }
        <LabelledValue label='Authentication' value='AUTH LOGIN'/>
        <LabelledValue label='Encryption' value='STARTTLS'/>
        <LabelledValue label='Username' value={smtpAuth.username}/>
        <LabelledValue label='Password'>
          { shortKey
            ? <ShortKeyCode shortKey={shortKey} />
            : <span>The password is an API key, and to create one: <Link to='/account/api-keys/create'>Create API Key</Link></span>
          }
        </LabelledValue>
      </Panel>
    );

  }

  renderTracking() {
    const { updateLoading } = this.props;
    return (
      <Panel sectioned title='Engagement Tracking'>
        <p>Engagement tracking allows the ability to show how many recipients opened messages or clicked links. This is the default setting for engagement tracking for SMTP.</p>
        <Field
          name='options.smtp_tracking_default'
          component={ToggleBlock}
          label='SMTP Engagement Tracking'
          type='checkbox'
          disabled={updateLoading}
          onChange={this.toggleTracking}
        />
      </Panel>
    );
  }

  render() {
    return (
      <Page title='SMTP Relay'>
        { this.renderSMTPDeets() }
        { this.renderTracking() }
      </Page>
    );

  }
}

const mapStateToProps = ({ account, ...state }) => {
  const apiKeys = selectApiKeysForSmtp(state);
  const shortKey = _.get(apiKeys, '0.short_key', null);

  return {
    shortKey,
    updateLoading: account.updateLoading,
    account,
    initialValues: {
      ...account
    }
  };
};

const formOptions = {
  form: 'smtpDefaultOptions'
};

export default connect(mapStateToProps, { updateAccount, listApiKeys })(reduxForm(formOptions)(SmtpPage));
