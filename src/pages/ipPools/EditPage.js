import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';
import { Loading, DeleteModal } from 'src/components';
import PoolForm from './components/PoolForm';

import { showAlert } from 'src/actions/globalAlert';
import { listPools, getPool, updatePool, deletePool } from 'src/actions/ipPools';


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
    if (this.id !== 'default') {
      this.secondaryActions.push(
        {
          content: 'Delete',
          onClick: this.toggleDelete
        }
      );
    }
  }

  componentDidMount() {
    this.props.listPools();
    this.props.getPool(this.id);
  }

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };

  updatePool = (values) => {
    const { updatePool, showAlert, history } = this.props;

    // Update each changed sending IP
    // Do not update the default pool
    // Update the pool itself
    return updatePool(this.id, values).then((res) => {
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

  deletePool = () => {
    const { deletePool, showAlert, history } = this.props;

    deletePool(this.id).then(() => {
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

  render() {

    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page
        title="Edit IP Pool"
        breadcrumbAction={breadcrumbAction}
        secondaryActions={this.secondaryActions}>
        <Panel>
          <Panel.Section>
            <PoolForm onSubmit={this.updatePool} isNew={false} />
          </Panel.Section>
        </Panel>
        <DeleteModal
          open={this.state.showDelete}
          title='Delete IP Pool'
          text='Are you sure you want to delete this IP Pool?'
          handleToggle={this.toggleDelete}
          handleDelete={this.deletePool}
        />
      </Page>
    );
  }
}

const mapStateToProps = ({ ipPools }) => ({
  loading: ipPools.getLoading || ipPools.listLoading
});

export default withRouter(connect(mapStateToProps, {
  updatePool,
  deletePool,
  getPool,
  listPools,
  showAlert
})(EditPage));
