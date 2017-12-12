/* eslint max-lines: ["error", 200] */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';
import { Loading, DeleteModal, ApiErrorBanner } from 'src/components';
import PoolForm from './components/PoolForm';

import { showAlert } from 'src/actions/globalAlert';
import { listPools, getPool, updatePool, deletePool } from 'src/actions/ipPools';
import { updateSendingIp } from 'src/actions/sendingIps';

import { decodeIp } from './helpers/ipNames';
import isDefaultPool from './helpers/defaultPool';


const breadcrumbAction = {
  content: 'IP Pools',
  Component: Link,
  to: '/account/ip-pools'
};

export class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.match.params.id;

    this.state = {
      showDelete: false
    };

    this.secondaryActions = [];
    if (!isDefaultPool(this.id)) {
      this.secondaryActions.push(
        {
          content: 'Delete',
          onClick: this.toggleDelete
        }
      );
    }
  }

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };

  onUpdatePool = (values) => {
    const { updateSendingIp, updatePool, showAlert, history } = this.props;

    // Pick out the IPs those pool assignment is not the current pool ergo
    // have been reassigned by the user.
    const changedIpKeys = Object.keys(values).filter((key) =>
      key !== 'name' && values[key] !== this.id);

    // Update each changed sending IP
    return Promise.all(changedIpKeys.map((ipKey) =>
      updateSendingIp(decodeIp(ipKey), values[ipKey])))
      .then(() => {
        // Update the pool itself
        if (!isDefaultPool(this.id)) {
          return updatePool(this.id, values);
        }
      })
      .then((res) => {
        showAlert({
          type: 'success',
          message: `Updated IP pool ${this.id}.`
        });
        history.push('/account/ip-pools');
      })
      .catch(() => showAlert({
        type: 'error',
        message: `Unable to update IP pool ${this.id}.`
      }));
  };

  onDeletePool = () => {
    const { deletePool, showAlert, history } = this.props;

    return deletePool(this.id).then(() => {
      showAlert({
        type: 'success',
        message: `Deleted IP pool ${this.id}.`
      });
      history.push('/account/ip-pools');
    })
      .catch(() => showAlert({
        type: 'error',
        message: `Unable to delete IP pool ${this.id}.`
      }));
  };

  loadDependantData = () => {
    this.props.listPools();
    this.props.getPool(this.id);
  };

  componentDidMount() {
    this.loadDependantData();
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

    return <Panel>
      <Panel.Section>
        <PoolForm onSubmit={this.onUpdatePool} isNew={false} />
      </Panel.Section>
    </Panel>;

  }

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page
        title="Edit IP Pool"
        breadcrumbAction={breadcrumbAction}
        secondaryActions={this.secondaryActions}>

        { this.renderForm() }

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

const mapStateToProps = ({ ipPools }) => {
  const { getLoading, getError, listLoading, listError } = ipPools;

  return {
    loading: getLoading || listLoading,
    error: listError || getError,
    listError,
    getError
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
