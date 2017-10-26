import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, ApiErrorBanner, TableCollection } from 'src/components';

import RecipientListsEmptyState from './components/RecipientListsEmptyState';

import { listRecipientLists } from 'src/actions/recipientLists';

const columns = ['Name', 'ID', 'Recipients'];

const primaryAction = {
  content: 'Create Recipient List',
  Component: Link,
  to: '/lists/recipient-lists/create'
};

const getRowData = ({ name, id, total_accepted_recipients }) => [
  <Link to={`/lists/recipient-lists/${id}`}>{name}</Link>,
  id,
  total_accepted_recipients
];


const renderCollection = (rows) => (
  <div>
    <Page title='Recipient Lists' primaryAction={primaryAction}/>
    <TableCollection
      columns={columns}
      getRowData={getRowData}
      pagination={true}
      rows={rows}
      filterBox={{
        show: true,
        keyMap: { count: 'total_accepted_recipients' },
        exampleModifiers: ['name', 'id', 'count'],
        itemToStringKeys: ['name', 'id']
      }}
    />
  </div>
);

export class ListPage extends Component {
  componentDidMount() {
    this.props.listRecipientLists();
  }

  onReloadApiBanner = () => {
    this.props.listRecipientLists({ force: true }); // force a refresh
  }

  renderError({ payload }) {
    return (
      <div>
        <Page title='Recipient Lists' primaryAction={primaryAction}/>
        <ApiErrorBanner
          errorDetails={payload.message}
          message="Sorry, we ran into an error loading your Recipient Lists"
          reload={this.onReloadApiBanner}
        />
      </div>
    );
  }

  render() {
    const { error, loading, recipientLists } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        { error
          ? this.renderError(error)
          : recipientLists.length
            ? renderCollection(recipientLists)
            : <RecipientListsEmptyState />
        }
      </div>
    );
  }
}

const mapStateToProps = ({ recipientLists }) => ({
  error: recipientLists.error,
  loading: recipientLists.listLoading,
  recipientLists: recipientLists.list
});

export default connect(mapStateToProps, { listRecipientLists })(ListPage);
