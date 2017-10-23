import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page, EmptyState } from '@sparkpost/matchbox';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';

import { list as listSubaccounts } from 'src/actions/subaccounts';
import getRowData from './helpers/getRowData';

const columns = ['Name', 'ID', 'Status'];

const primaryAction = {
  content: 'Create Subaccount',
  Component: Link,
  to: '/account/subaccounts/create'
};

const renderEmpty = () => (
    <EmptyState
      title="Get started with Subaccounts"
      action={{ content: 'Create a Subaccount' }}
      secondaryAction={{ content: 'Learn more', to: 'https://developers.sparkpost.com/api/subaccounts.html', target: '_blank' }}
    >
      <p>Subaccounts are a good way of managing external client accounts.</p>
    </EmptyState>
  );

const renderCollection = (subaccounts) => (
    <div>
      <Page title='Subaccounts' primaryAction={primaryAction}/>
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={subaccounts}
      />
    </div>
  );

export class ListPage extends Component {
  componentDidMount() {
    this.props.listSubaccounts();
  }

  onReloadApiBanner = () => {
    this.props.listSubaccounts({ force: true }); // force a refresh
  };

  renderError() {
    return (
      <div>
        <Page title='Subaccounts' primaryAction={primaryAction}/>
        <ApiErrorBanner
          errorDetails={this.props.error.message}
          message="Sorry, we ran into an error loading your Subaccounts"
          reload={this.onReloadApiBanner}
        />
      </div>
    );
  }

  render() {
    const { error, loading, subaccounts } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        { error
          ? this.renderError()
          : subaccounts.length
            ? renderCollection(subaccounts)
            : renderEmpty()
        }
      </div>
    );
  }
}

const mapStateToProps = ({ subaccounts }) => ({
  subaccounts: subaccounts.list,
  loading: subaccounts.listLoading,
  error: subaccounts.listError
});

export default connect(mapStateToProps, { listSubaccounts })(ListPage);
