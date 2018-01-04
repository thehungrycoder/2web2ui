import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, TextField } from '@sparkpost/matchbox';
import emailAddresses from 'email-addresses';

import { Loading } from 'src/components';
import PreviewPanel from './PreviewPanel';

export default class PreviewPage extends React.Component {
  static defaultProps = {
    loading: true
  }

  state = {
    sending: false,
    to: ''
  }

  // Reset input error message and set new value
  onTextChange = (event) => {
    this.setState({ error: undefined, to: event.currentTarget.value });
  }

  onSend = () => {
    const emails = emailAddresses.parseAddressList(this.state.to);

    if (emails === null) {
      return this.setState({ error: 'Please provide valid email address(es)' });
    }

    this.setState({ sending: true });

    this.props.sendPreview({
      id: this.props.template.id,
      mode: this.props.mode,
      emails: emails.map((e) => e.address),
      from: this.props.template.content.from.email
    }).then(this.onSendSuccess).catch(this.onSendFail);
  }

  onSendFail = (error) => {
    this.props.showAlert({ message: error.message, type: 'error' });
    this.setState({ sending: false });
  }

  onSendSuccess = ({ total_accepted_recipients }) => {
    this.props.showAlert({
      message: `Successfully sent to ${total_accepted_recipients} recipients.`,
      type: 'success'
    });
    this.setState({ sending: false, to: '' });
  }

  render() {
    const { editTemplatePath, loading, mode, preview, template } = this.props;

    if (loading) {
      return <Loading />;
    }

    const pageProps = {
      breadcrumbAction: {
        Component: Link,
        content: 'Edit Template',
        to: editTemplatePath
      },
      primaryAction: {
        content: 'Send Email',
        disabled: this.state.sending,
        onClick: this.onSend
      },
      title: `${template.name} (${_.capitalize(mode)})`
    };

    const { email, name } = preview.from;

    return (
      <Page {...pageProps}>
        <Panel sectioned>
          <TextField
            error={this.state.error}
            label="To"
            placeholder="Send to recipient email addresses"
            onChange={this.onTextChange}
            value={this.state.to}
          />
          <TextField disabled label="From" value={name ? `${name} <${email}>` : email} />
          <TextField disabled label="Subject" value={preview.subject} />
          <PreviewPanel html={preview.html} text={preview.text} />
        </Panel>
      </Page>
    );
  }
}
