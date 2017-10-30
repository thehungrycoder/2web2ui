import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import getRowData from './helpers/getRowData';

const columns = ['Name', 'ID', 'Status'];
const primaryAction = {
  content: 'Create Subaccount',
  Component: Link,
  to: '/account/subaccounts/create'
};

export class ListPage extends Component {
  componentDidMount() {
    this.props.listSubaccounts();
  }

  onReloadApiBanner = () => {
    this.props.listSubaccounts({ force: true }); // force a refresh
  };

  renderCollection() {
    return (
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={this.props.subaccounts}
        filterBox={{
          show: true,
          exampleModifiers: ['name', 'id', 'status'],
          itemToStringKeys: ['name', 'id']
        }}
      />
    );
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we ran into an error loading your Subaccounts"
        reload={this.onReloadApiBanner}
      />
    );
  }

  render() {
    const { error, loading, subaccounts } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title='Subaccounts'
        primaryAction={primaryAction}
        empty={{
          show: subaccounts.length === 0,
          title: 'Manage your subaccounts',
          image: 'Users',
          content: <p>Subaccounts are a good way of managing external client accounts.</p>,
          secondaryAction: {
            content: 'Learn more',
            to: 'https://developers.sparkpost.com/api/subaccounts.html',
            external: true
          }
        }}>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

const mapStateToProps = ({ subaccounts }) => ({
  subaccounts: subaccounts.list,
  loading: subaccounts.listLoading,
  error: subaccounts.listError
});

export default connect(mapStateToProps, { listSubaccounts })(ListPage);
