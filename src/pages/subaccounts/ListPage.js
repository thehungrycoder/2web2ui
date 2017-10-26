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

  render() {
    const { error, loading, subaccounts } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <ApiErrorBanner
          errorDetails={this.props.error.message}
          message="Sorry, we ran into an error loading your Subaccounts"
          reload={this.onReloadApiBanner}
        />
      );
    }

    return (
      <Page
        title='Subaccounts'
        primaryAction={primaryAction}
        empty={{
          test: subaccounts.length === 0,
          title: 'Subaccounts',
          image: 'Users',
          content: <p>Subaccounts are a good way of managing external client accounts.</p>,
          secondaryAction: {
            content: 'Learn more',
            to: 'https://developers.sparkpost.com/api/subaccounts.html',
            target: '_blank'
          }
        }}>
        <TableCollection
          columns={columns}
          getRowData={getRowData}
          pagination={true}
          rows={subaccounts}
          filterBox={{
            show: true,
            exampleModifiers: ['name', 'id', 'status'],
            itemToStringKeys: ['name', 'id']
          }}
        />
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
