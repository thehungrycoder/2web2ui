import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, TextField } from '@sparkpost/matchbox';

import { ApiErrorBanner, Loading } from 'src/components';
import { parseRecipientEmailAddresses } from 'src/helpers/email';
import PreviewPanel from './components/PreviewPanel';

export default class PreviewPage extends Component {
  static defaultProps = {
    preview: { from: {}},
    template: {}
  }

  state = {
    loading: true,
    sending: false,
    to: ''
  }

  componentDidMount() {
    this.onLoad();
  }

  onLoad = () => {
    if (!this.state.loading) {
      this.setState({ loading: true });
    }

    return this.props.onLoad(this.props.match.params.id, this.props.subaccountId)
      .then(() => { this.setState({ loadingError: undefined, loading: false }); })
      .catch((error) => { this.setState({ loadingError: error, loading: false }); });
  }

  onSend = () => {
    const emails = parseRecipientEmailAddresses(this.state.to);

    if (_.trim(this.state.to) === '') {
      this.setState({ validationError: 'At least one email address is required' });
      return;
    }

    if (emails === null) {
      this.setState({ validationError: 'An email address is invalid' });
      return;
    }

    this.setState({ sending: true, validationError: undefined });

    return this.props.sendPreview({
      id: this.props.template.id,
      mode: this.props.mode,
      emails: emails.map((e) => e.address),
      from: this.props.preview.from.email,
      subaccountId: this.props.subaccountId
    }).then(this.onSendSuccess).catch(this.onSendFail);
  }

  onSendFail = (error) => {
    this.setState({ sending: false });
  }

  onSendSuccess = () => {
    this.props.showAlert({ message: 'Successfully sent a test email', type: 'success' });
    this.setState({ sending: false, to: '' });
  }

  // Reset input error message and set new value
  onTextChange = (event) => {
    this.setState({ to: event.currentTarget.value, validationError: undefined });
  }

  render() {
    const { canSendEmail, mode, preview, returnPath, template } = this.props;
    const { loading, loadingError, sending, to, validationError } = this.state;

    if (loading) {
      return <Loading />;
    }

    const pageProps = {
      breadcrumbAction: {
        Component: Link,
        content: 'Back To Template',
        to: returnPath
      },
      primaryAction: canSendEmail ? {
        content: 'Send Email',
        disabled: sending || !!loadingError,
        onClick: this.onSend
      } : undefined,
      title: `${template.name || ''} (${_.capitalize(mode)})`
    };

    const { email, name } = preview.from;

    return (
      <Page {...pageProps}>
        {loadingError && (
          <ApiErrorBanner
            errorDetails={loadingError.message}
            message="Unable to load your template preview"
            reload={this.onLoad}
          />
        )}
        <Panel sectioned>
          {canSendEmail &&
              <TextField
                disabled={!!loadingError}
                error={validationError}
                label="To"
                placeholder="Send to recipient email addresses"
                onChange={this.onTextChange}
                value={to}
              />
          }
          <TextField disabled label="From" value={name ? `${name} <${email}>` : email} />
          <TextField disabled label="Subject" value={preview.subject} />
          <PreviewPanel html={preview.html} text={preview.text} />
        </Panel>
      </Page>
    );
  }
}
