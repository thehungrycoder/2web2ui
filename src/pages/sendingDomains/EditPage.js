import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { reduxForm } from 'redux-form';

import { get as getDomain } from 'src/actions/sendingDomains';
import { Loading, ApiErrorBanner } from 'src/components';
import { SetupSending } from './components/SetupSending';
import { Page } from '@sparkpost/matchbox';

const breadcrumbAction = {
  content: 'Sending Domains',
  Component: Link,
  to: '/account/sending-domains'
};

const FORM_NAME = 'sendingDomainEdit';

export class EditPage extends Component {
  componentDidMount() {
    this.loadDomainProps();
  }

  loadDomainProps = () => {
    this.props.getDomain(this.props.match.params.id);
  };

  renderSections = () => {
    const { domain, match: { params: { id }}} = this.props;

    if (!domain) {
      return null;
    }

    return (
      <SetupSending form={FORM_NAME} id={id} domain={domain}/>
    );
  };

  renderError() {
    return <ApiErrorBanner
      errorDetails={this.props.getError.message}
      message="Sorry, we seem to have had some trouble loading your Sending Domain."
      reload={this.loadDomainProps}
    />;
  }

  render() {
    const { getLoading, getError, domain, match: { params: { id }}} = this.props;

    if (getLoading) {
      return <Loading />;
    }

    return (
      <Page
        title={`Edit ${id}`}
        breadcrumbAction={breadcrumbAction}
      >
        {getError ? this.renderError() : this.renderSections(domain)}

      </Page>
    );
  }
}

const mapStateToProps = ({ sendingDomains: { domain, getError, getLoading }}) => ({
  domain,
  getError,
  getLoading,
  initialValues: {
    ...domain
  }
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from the redux store
};

export default withRouter(connect(mapStateToProps, { getDomain })(reduxForm(formOptions)(EditPage)));
