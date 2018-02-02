import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { get as getDomain } from 'src/actions/sendingDomains';
import { Loading, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import AssignTrackingDomain from './components/AssignTrackingDomain';
import EditBounce from './components/EditBounce';

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
      <div>
        <EditBounce id={id} domain={domain} />
        <AssignTrackingDomain domain={domain} />
      </div>
    );
  }

  renderError() {
    return <ApiErrorBanner
      errorDetails={this.props.getError.message}
      message='Sorry, we seem to have had some trouble loading your Sending Domain.'
      reload={this.loadDomainProps}
    />;
  }

  render() {
    const { domain, getError, match: { params: { id }}} = this.props;

    if (domain.id !== id) {
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

const mapStateToProps = ({ sendingDomains: { domain, getError }}) => ({
  domain,
  getError
});


export default withRouter(connect(mapStateToProps, { getDomain })(EditPage));
