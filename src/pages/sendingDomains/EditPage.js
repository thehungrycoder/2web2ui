import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { get as getDomain } from 'src/actions/sendingDomains';
import { Loading, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import AssignTrackingDomain from './components/AssignTrackingDomain';

const breadcrumbAction = {
  content: 'Sending Domains',
  Component: Link,
  to: '/account/sending-domains'
};

export class EditPage extends Component {
  componentDidMount() {
    this.loadDomainProps();
  }

  loadDomainProps = () => {
    this.props.getDomain(this.props.match.params.id);
  };

  renderPage() {
    const { domain, match: { params: { id }}} = this.props;
    return (
      <AssignTrackingDomain sendingDomain={id} subaccount={domain.subaccount_id} trackingDomain={domain.tracking_domain} />
    );
  }

  renderError() {
    return <ApiErrorBanner
      errorDetails={this.props.getError.message}
      message="Sorry, we seem to have had some trouble loading your Sending Domain."
      reload={this.loadDomainProps}
    />;
  }

  render() {
    const { getLoading, getError, match: { params: { id }}} = this.props;

    if (getLoading) {
      return <Loading />;
    }

    return (
      <Page
        title={`Edit ${id}`}
        breadcrumbAction={breadcrumbAction}
      >
        {getError ? this.renderError() : this.renderPage()}

      </Page>
    );
  }
}

const mapStateToProps = ({ sendingDomains: { domain, getError, getLoading }}) => ({
  domain,
  getError,
  getLoading
});

export default withRouter(connect(mapStateToProps, { getDomain })(EditPage));
