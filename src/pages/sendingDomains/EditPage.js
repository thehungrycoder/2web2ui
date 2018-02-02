import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { selectDomain } from 'src/selectors/sendingDomains';
import { get as getDomain, remove as deleteDomain, update as updateDomain } from 'src/actions/sendingDomains';
import { showAlert } from 'src/actions/globalAlert';
import { Loading, ApiErrorBanner, DeleteModal } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import AssignTrackingDomain from './components/AssignTrackingDomain';
import EditBounce from './components/EditBounce';
import SetupSending from './components/SetupSending';

import { apiResponseToAlert } from 'src/helpers/apiMessages';

import { DomainStatus } from './components/DomainStatus';

const breadcrumbAction = {
  content: 'Sending Domains',
  Component: Link,
  to: '/account/sending-domains'
};

export class EditPage extends Component {
  state = {
    showDelete: false
  };

  toggleDelete = () => this.setState({ showDelete: !this.state.showDelete });

  secondaryActions = [
    {
      content: 'Delete',
      onClick: this.toggleDelete
    }
  ];

  afterDelete = () => {
    this.toggleDelete();
    this.props.history.push('/account/sending-domains');
  };

  deleteDomain = () => {
    const {
      domain: { id, subaccount_id: subaccount },
      deleteDomain,
      showAlert
    } = this.props;

    return deleteDomain({ id, subaccount })
      .then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${id} deleted.`
        });
        this.afterDelete();
      }).catch((err) => {
        showAlert(apiResponseToAlert(err, 'Could not delete domain'));
        this.afterDelete();
      });
  };

  shareDomainChange = () => {
    const {
      domain: { id, shared_with_subaccounts, subaccount_id: subaccount },
      updateDomain,
      showAlert
    } = this.props;
    return updateDomain({ id, subaccount, shared_with_subaccounts: !shared_with_subaccounts })
      .catch((err) =>
        showAlert(apiResponseToAlert(err, 'Could not update domain')));
  }

  componentDidMount() {
    return this.loadDomainProps();
  }

  loadDomainProps = () => this.props.getDomain(this.props.match.params.id);

  renderPage() {
    const { domain, match: { params: { id }}} = this.props;


    return (
      <div>
        <DomainStatus domain={domain} onShareDomainChange={this.shareDomainChange} />
        <SetupSending domain={domain} />
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
        secondaryActions={this.secondaryActions}
        breadcrumbAction={breadcrumbAction}
      >
        { getError ? this.renderError() : this.renderPage() }

        <DeleteModal
          open={this.state.showDelete}
          title='Are you sure you want to delete this sending domain?'
          content={<p>Any future transmission that uses this domain will be rejected.</p>}
          onCancel={this.toggleDelete}
          onDelete={this.deleteDomain}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  getError: state.sendingDomains.getError,
  domain: selectDomain(state, props)
});


const mapDispatchToProps = {
  getDomain,
  deleteDomain,
  updateDomain,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPage));
