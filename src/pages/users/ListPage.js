import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

import { listUsers } from 'src/actions/users';

import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
import TableCollection from 'src/components/collection/TableCollection';
import Layout from 'src/components/layout/Layout';

const COLUMNS = ['Name', 'Role', 'Email', 'Last Login'];

// TODO: handling underscores
const getRowData = ({ access, email, last_login, name }) => [
  name,
  access,
  email,
  last_login
];

export class ListPage extends Component {
  componentDidMount() {
    this.props.listUsers();
  }

  renderError() {
    const { error, listUsers } = this.props;

    if (!error) { return null; }

    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={listUsers}
      />
    );
  }

  render() {
    const { loading, users } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title="Users" />
        {this.renderError()}
        <TableCollection
          columns={COLUMNS}
          getRowData={getRowData}
          pagination={true}
          rows={users}
        />
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.users.error,
  loading: state.users.loading,
  users: state.users.list
});

export default connect(mapStateToProps, { listUsers })(ListPage);
