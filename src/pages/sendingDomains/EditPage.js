import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { reduxForm } from 'redux-form';

import { get as getDomain } from 'src/actions/sendingDomains';
import { Loading, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';
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

  renderError() {
    return <ApiErrorBanner
      errorDetails={this.props.getError.message}
      message='Sorry, we seem to have had some trouble loading your Sending Domain.'
      reload={this.loadDomainProps}
    />;
  }

  renderPage() {
    const { domain } = this.props;

    if (!domain) {
      return null;
    }
    return (
      <EditBounce name={this.props.match.params.id} domain={domain} />
    );
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
        {getError ? this.renderError() : this.renderPage(id)}

      </Page>
    );
  }
}

const mapStateToProps = ({ sendingDomains: { domain, getError, getLoading }}) => ({
  domain,
  getError,
  getLoading
});

const FORM_NAME = 'sendingDomainEdit';

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default withRouter(connect(mapStateToProps, { getDomain })(reduxForm(formOptions)(EditPage)));
