import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Banner } from '@sparkpost/matchbox';
import CreateForm from './components/CreateForm';
import { createTrackingDomain } from 'src/actions/trackingDomains';
import { showAlert } from 'src/actions/globalAlert';

export class CreatePage extends Component {

  onSubmit = (data) => {
    const { history, showAlert, createTrackingDomain } = this.props;
    return createTrackingDomain(data).then(() => {
      showAlert({ type: 'success', message: `Successfully added ${data.domain}` });
      history.push('/account/tracking-domains');
    });
  };

  render() {
    return (
      <div>
        <Page
          title='Create Tracking Domain'
          breadcrumbAction={{ content: 'Back to Tracking Domains', to: '/account/tracking-domains', Component: Link }}
        />
        <Banner
          status="info"
          title="Verification required">
          <p>Tracking domains need to be verified via DNS. You'll need to <strong>add a CNAME record</strong> with the value of <strong>spgo.io</strong> to this domain's DNS settings before it can be used or set as the default. <a href="http://google.com" target="_blank" rel="noopener noreferrer">Learn more about editing your DNS settings.</a></p>
        </Banner>
        <CreateForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default connect(null, { createTrackingDomain, showAlert })(CreatePage);
