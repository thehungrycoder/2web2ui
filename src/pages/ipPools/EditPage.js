import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, DeleteModal, ApiErrorBanner } from 'src/components';
import PoolForm from './components/PoolForm';

import { showAlert } from 'src/actions/globalAlert';
import { listPools, getPool, updatePool, deletePool } from 'src/actions/ipPools';
import { updateSendingIp } from 'src/actions/sendingIps';
import { shouldShowIpPurchaseCTA } from 'src/selectors/ipPools';

import { decodeIp } from 'src/helpers/ipNames';
import isDefaultPool from './helpers/defaultPool';


const breadcrumbAction = {
  content: 'IP Pools',
  Component: Link,
  to: '/account/ip-pools'
};

export class EditPage extends Component {
  state = {
    showDelete: false
  };

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };

  onUpdatePool = (values) => {
    const { updateSendingIp, updatePool, showAlert, history, match: { params: { id }}} = this.props;

    /**
     * Pick out the IPs whose pool assignment is not the current pool ergo
     * have been reassigned by the user.
     */
    const changedIpKeys = Object.keys(values).filter((key) =>
      key !== 'name' && key !== 'signing_domain' && values[key] !== id);

    // if signing_domain is not set, then we want to clear it out to empty string.
    values.signing_domain = values.signing_domain || '';

    // Update each changed sending IP
    return Promise.all(changedIpKeys.map((ipKey) =>
      updateSendingIp(decodeIp(ipKey), values[ipKey])))
      .then(() => {
        // Update the pool itself
        if (!isDefaultPool(id)) {
          return updatePool(id, values);
        }
      })
      .then((res) => {
        showAlert({
          type: 'success',
          message: `Updated IP pool ${id}.`
        });
        history.push('/account/ip-pools');
      });
  };

  onDeletePool = () => {
    const { deletePool, showAlert, history, match: { params: { id }}} = this.props;

    return deletePool(id).then(() => {
      showAlert({
        type: 'success',
        message: `Deleted IP pool ${id}.`
      });
      history.push('/account/ip-pools');
    });
  };

  loadDependentData = () => {
    this.props.listPools();
    this.props.getPool(this.props.match.params.id);
  };

  componentDidMount() {
    this.loadDependentData();
  }

  renderError() {
    const { listError, getError } = this.props;
    const msg = listError ? listError.message : getError.message;
    return <ApiErrorBanner
      errorDetails={msg}
      message="Sorry, we seem to have had some trouble loading your IP pool."
      reload={this.loadDependantData}
    />;
  }

  renderForm() {
    const { error } = this.props;

    if (error) {
      return this.renderError();
    }

    return <PoolForm onSubmit={this.onUpdatePool} isNew={false} />;
  }

  render() {
    const { loading, pool, showPurchaseCTA } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title={`${pool.name} (${pool.id})`}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={
          [{
            content: 'Delete',
            onClick: this.toggleDelete,
            visible: !isDefaultPool(this.props.match.params.id)
          },
          { content: 'Purchase IPs',
            to: '/account/billing',
            component: Link,
            visible: showPurchaseCTA
          }]
        }>

        {this.renderForm()}

        <DeleteModal
          open={this.state.showDelete}
          title='Are you sure you want to delete this IP Pool?'
          content={<p>IPs in this pool will be re-assigned to your Default pool.</p>}
          onCancel={this.toggleDelete}
          onDelete={this.onDeletePool}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { getLoading, getError, listLoading, listError, pool } = state.ipPools;

  return {
    loading: getLoading || listLoading,
    error: listError || getError,
    pool,
    listError,
    getError,
    showPurchaseCTA: shouldShowIpPurchaseCTA(state)
  };
};

export default withRouter(connect(mapStateToProps, {
  updatePool,
  deletePool,
  getPool,
  listPools,
  updateSendingIp,
  showAlert
})(EditPage));
