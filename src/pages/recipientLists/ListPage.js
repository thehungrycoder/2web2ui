import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading, ApiErrorBanner, TableCollection } from 'src/components';
import { Users } from 'src/components/images';
import { listRecipientLists, validateRecipientList } from 'src/actions/recipientLists';
import { LINKS } from 'src/constants';
import Actions from './components/Actions';

const columns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'ID', sortKey: 'id' },
  { label: 'Recipients', sortKey: 'total_accepted_recipients', width: '20%' },
  null
];

const primaryAction = {
  content: 'Create Recipient List',
  Component: Link,
  to: '/lists/recipient-lists/create'
};

export class ListPage extends Component {

  getRowData = ({ name, id, total_accepted_recipients }) => [
    <Link to={`/lists/recipient-lists/edit/${id}`}>{name}</Link>,
    id,
    total_accepted_recipients,
    <Actions actions={[
      {
        content: 'Edit',
        to: `/lists/recipient-lists/edit/${id}`,
        component: Link
      },
      { //TODO: Disable/remove entry if process is already ongoing.
        content: 'Validate List',
        onClick: () => this.startValidation(id)
      }
    ]}/>
  ];

  startValidation = (id) => {
    const { validateRecipientList } = this.props;
    validateRecipientList(id);
  }
  componentDidMount() {
    this.props.listRecipientLists();
  }

  onReloadApiBanner = () => {
    this.props.listRecipientLists({ force: true }); // force a refresh
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.error.message}
        message="Sorry, we ran into an error loading your Recipient Lists"
        reload={this.onReloadApiBanner} />
    );
  }

  renderCollection() {
    return (
      <TableCollection
        columns={columns}
        getRowData={this.getRowData}
        pagination={true}
        rows={this.props.recipientLists}
        filterBox={{
          show: true,
          keyMap: { count: 'total_accepted_recipients' },
          exampleModifiers: ['name', 'id', 'count'],
          itemToStringKeys: ['name', 'id']
        }}
        defaultSortColumn='name'
      />
    );
  }

  render() {
    const { error, loading, recipientLists } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title='Recipient Lists'
        primaryAction={primaryAction}
        empty={{
          show: recipientLists.length === 0,
          image: Users,
          content: <p>Manage your recipient lists</p>,
          secondaryAction: {
            content: 'Learn More',
            to: LINKS.RECIP_API,
            external: true
          }}}>
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

const mapStateToProps = ({ recipientLists }) => ({
  error: recipientLists.error,
  loading: recipientLists.listLoading,
  recipientLists: recipientLists.list
});

const mapDispatchToProps = { validateRecipientList, listRecipientLists };

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
