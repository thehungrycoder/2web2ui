import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { create as createDomain } from 'src/actions/sendingDomains';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel } from '@sparkpost/matchbox';

import CreateForm from './components/CreateForm';

export class CreatePage extends Component {
  handleCreate = (values) => {
    const { createDomain, history } = this.props;

    return createDomain(values)
      .then(() => history.push(`/account/sending-domains/edit/${values.domain}`));
  }

  render() {
    return (
      <Page breadcrumbAction={{ content: 'Back to Sending Domains', Component: Link, to: '/account/sending-domains' }}>
        <Panel title='Add a Domain'>
          <CreateForm onSubmit={this.handleCreate} />
        </Panel>
      </Page>
    );
  }
}

export default withRouter(connect(null, { createDomain, showAlert })(CreatePage));
