import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import CreateForm from './components/Form';
import { createTrackingDomain } from 'src/actions/trackingDomains';
import { showAlert } from 'src/actions/globalAlert';

export class CreatePage extends Component {

  onSubmit = (data) => {
    const { history, showAlert } = this.props;
    this.props.createTrackingDomain(data).then(() => {
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
        <CreateForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default connect(null, { createTrackingDomain, showAlert })(CreatePage);
