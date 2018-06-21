import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import SuppressionSearch from './components/SuppressionSearch';
import RecipientDelete from './components/DeleteButton';

import {
  getRecipientList,
  updateRecipientList,
  deleteRecipientList
} from 'src/actions/recipientLists';

import { searchSuppressions } from 'src/actions/suppressions';

import { showAlert } from 'src/actions/globalAlert';
import { Loading, DeleteModal } from 'src/components';

import RecipientListForm from './components/RecipientListForm';
import RecipientListAddRecipientForm from './components/RecipientListAddRecipientForm';

const columns = [
  { label: 'Email', sortKey: 'email' },
  { label: 'Name', sortKey: 'name' },
  { label: 'Return Path', sortKey: 'return_path' },
  { label: 'Matadata', sortKey: 'metadata' },
  null
];

export class EditPage extends Component {
  state = {
    showDelete: false,
    showClean: false
  };

  toggleDelete = () => this.setState({ showDelete: !this.state.showDelete });

  toggleClean = () => this.setState({ showClean: !this.state.showClean });

  // cleanList = () => {
  //   console.log('here');
  //   return this.props.searchSuppressions({ dateOptions: {}, subaccount: 0 }).then((results) => {
  //     console.log(results);
  //   });
  // }

  secondaryActions = [
    {
      content: 'Delete',
      onClick: this.toggleDelete
    },
    {
      content: 'Clean List',
      onClick: this.toggleClean
    }
  ];

  getRowData = (rowData) => {
    const { address, return_path, metadata } = rowData;
    const { email, name } = address;
    return [
      email,
      name,
      return_path,
      metadata,
      <RecipientDelete email={email} list={this.props.current} />
    ];
  }

  deleteRecipientList = () => {
    const { current, deleteRecipientList, showAlert, history } = this.props;

    return deleteRecipientList(current.id).then(() => {
      showAlert({
        type: 'success',
        message: 'Deleted recipient list'
      });
      history.push('/lists/recipient-lists');
    });
  };

  updateRecipientList = (values) => {
    const { updateRecipientList, showAlert, history } = this.props;

    return updateRecipientList(values).then(() => {
      showAlert({
        type: 'success',
        message: 'Updated recipient list'
      });
      history.push('/lists/recipient-lists');
    });
  };

  componentDidMount() {
    const {
      match: { params: { id }},
      getRecipientList,
      history
    } = this.props;

    return getRecipientList(id).catch((err) => {
      history.push('/lists/recipient-lists');
    });
  }

  render() {
    const { loading, current } = this.props;

    if (loading || current === null) {
      return <Loading />;
    }

    const { recipients } = current;
    const { showClean } = this.state;

    return <Page
      title='Manage Recipient List'
      secondaryActions={this.secondaryActions}
      breadcrumbAction={{
        content: 'Recipient Lists',
        Component: Link,
        to: '/lists/recipient-lists' }}>

      {showClean
        ? <SuppressionSearch />
        : (<div><RecipientListForm editMode={true} onSubmit={this.updateRecipientList} />
          <RecipientListAddRecipientForm list={current} /></div>)

      }
      <TableCollection
        columns={columns}
        rows={recipients}
        getRowData={this.getRowData}
        pagination
      />

      <DeleteModal
        open={this.state.showDelete}
        title='Are you sure you want to delete this recipient list?'
        content={<p>The recipient list will be immediately and permanently removed. This cannot be undone.</p>}
        onCancel={this.toggleDelete}
        onDelete={this.deleteRecipientList}
      />
    </Page>;
  }
}

const mapStateToProps = (state) => ({
  current: state.recipientLists.current,
  loading: state.recipientLists.currentLoading || state.suppressions.listLoading,
  list: state.recipientLists.list,
  error: state.recipientLists.error,
  suppressions: state.suppressions.list
});

const mapDispatchToProps = {
  getRecipientList,
  updateRecipientList,
  deleteRecipientList,
  searchSuppressions,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPage));
