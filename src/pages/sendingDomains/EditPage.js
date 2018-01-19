import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { get as getDomain } from 'src/actions/sendingDomains';
import { Loading, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

const breadcrumbAction = {
  content: 'Sending Domains',
  Component: Link,
  to: '/account/sending-domains'
};

export class EditPage extends Component {
  constructor(props) {
    super(props);

    this.id = props.match.params.id;
  }

  componentDidMount() {
    this.props.getDomain(this.id);
  }

  loadDependantData = () => {
    this.props.getDomain(this.id);
  };

  renderError() {
    return <ApiErrorBanner
      errorDetails={this.props.getError.message}
      message="Sorry, we seem to have had some trouble loading your Sending Domain."
      reload={this.loadDependantData}
    />;
  }

  render() {
    const { getLoading, getError } = this.props;

    if (getLoading) {
      return <Loading />;
    }

    return (
      <Page
        title={`Edit ${this.id}`}
        breadcrumbAction={breadcrumbAction}
      >
        {getError ? this.renderError() : 'Coming soon'}

      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  domain: state.sendingDomains.domain,
  getError: state.sendingDomains.getError,
  getLoading: state.sendingDomains.getLoading
});

export default withRouter(connect(mapStateToProps, { getDomain })(EditPage));
