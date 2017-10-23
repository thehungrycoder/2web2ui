import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';

import { getPool, updatePool, deletePool } from 'src/actions/ipPools';
import { Layout, DeleteModal } from 'src/components';
import PoolForm from './components/PoolForm';

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
    this.props.getPool(this.id);
  }

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  }

  updatePool = (values) => {
    const { updatePool, history } = this.props;

    return updatePool(values).then((res) => {
      history.push('/account/ip-pools');
    });
  };

  deletePool = () => this.props.deletePool(this.id).then(() => {
    this.props.history.push('/account/ip-pools');
  })

  render() {
    return (
      <Layout.App loading={this.props.loading}>
        <Page title="Edit IP Pool" breadcrumbAction={breadcrumbAction} secondaryActions={this.secondaryActions} />
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
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ ipPools }) => ({
  loading: ipPools.getLoading
});

export default withRouter(connect(mapStateToProps, { updatePool, deletePool, getPool })(EditPage));
