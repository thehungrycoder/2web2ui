import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getEventSamples, testWebhook } from '../../../actions/webhooks';

import { Button, Panel } from '@sparkpost/matchbox';
import ResponseBlock from './ResponseBlock';
import RequestBlock from './RequestBlock';

class TestTab extends Component {
  state = {
    testSent: false,
    buildRequest: _.once(this.buildTestRequest)
  }

  componentDidMount() {
    if (!this.props.samples) {
      this.props.getEventSamples(this.props.webhook.events);
    }
  }

  buildTestRequest(webhook, payload) {
    const parser = document.createElement('a');
    parser.href = webhook.target;

    const requestLines = [
      `POST ${parser.pathname} HTTP/1.1`,
      `Host: ${parser.hostname}`,
      'Content-Type: application/json',
      'X-MessageSystems-Batch-ID: 77c2b630-d712-11e4-9642-efc2723b99c1' // hardcoded value in the API
    ];

    if (webhook.auth_token) {
      requestLines.push(`X-MessageSystems-Webhook-Token: ${webhook.auth_token}`);
    }
    if (webhook.auth_type === 'oauth2') {
      requestLines.push('Authorization: Bearer <OAUTH2 ACCESS TOKEN>');
    } else if (webhook.auth_type === 'basic') {
      requestLines.push('Authorization: Basic <BASE64 ENCODED CREDENTIALS>');
    }

    requestLines.push('Connection: close');
    requestLines.push('');
    requestLines.push(JSON.stringify(payload, null, '  '));
    return requestLines.join('\n');
  }

  testWebhook(id, payload) {
    this.props.testWebhook(id, payload);
    this.setState({ testSent: true });
  }

  render() {
    if (this.props.samplesLoading) {
      return (<div>Loading...</div>);
    }

    const { webhook, samples, testResponse, testLoading } = this.props;
    const { testSent, buildRequest } = this.state;

    const buttonText = testSent ? testLoading ? 'Sending...' : 'Re-send batch' : 'Send Test Batch';
    const testRequest = buildRequest(webhook, samples);

    return (
      <Panel sectioned>
        <Panel.Section>
          <div>
            <Button primary disabled={testLoading} onClick={() => { this.testWebhook(webhook.id, testRequest); }}>
              {buttonText}
            </Button>
            <br/>
            <br/>
          </div>
          { testLoading && <div>Sending test...</div> }
          { !testLoading && <ResponseBlock testSent={testSent} testResponse={testResponse}/> }
          <RequestBlock testSent={testSent} testRequest={testRequest} targetURL={webhook.target}/>
        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  samples: webhooks.samples,
  samplesLoading: webhooks.samplesLoading,
  testLoading: webhooks.testLoading,
  testResponse: webhooks.testResponse
});

export default connect(mapStateToProps, { getEventSamples, testWebhook })(TestTab);
