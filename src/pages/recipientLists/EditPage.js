import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';

import {
  listRecipientLists,
  setCurrentRecipientList,
  updateRecipientList,
  deleteRecipientList
} from 'src/actions/recipientLists';

import { showAlert } from 'src/actions/globalAlert';
import currentRecipientList from 'src/selectors/recipientLists';
import { Loading, DeleteModal } from 'src/components';

import RecipientListForm from './components/RecipientListForm';

export class EditPage extends Component {
  state = {
    showDelete: false
  };

  toggleDelete = () => this.setState({ showDelete: !this.state.showDelete });

  secondaryActions = [
    {
      content: 'Delete',
      onClick: this.toggleDelete
    }
  ];

  deleteRecipientList = () => {
    const { current, deleteRecipientList, history } = this.props;

    return deleteRecipientList(current.id).then(() => {
      showAlert({
        type: 'success',
        message: 'Deleted recipient list'
      });
      history.push('/lists/recipient-lists');
    }).catch((err) => showAlert({
      type: 'error',
      message: 'Delete failed'
    }));
  };

  updateRecipientList = (values) => {
    const { updateRecipientList, showAlert, history } = this.props;

    return updateRecipientList(values).then(() => {
      showAlert({
        type: 'success',
        message: 'Updated recipient list'
      });
      history.push('/lists/recipient-lists');
    }).catch((err) => showAlert({
      type: 'error',
      message: 'Update failed'
    }));
  };

  componentDidMount() {
    const {
      match: { params: { id }},
      list,
      listRecipientLists,
      setCurrentRecipientList
    } = this.props;
    if (list.length === 0) {
      // Load the whole list if we haven't yet
      return listRecipientLists().then(() => setCurrentRecipientList(id));
    } else {
      // We have the list in store. Just select the current one.
      return setCurrentRecipientList(id);
    }
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return <Page
      title='Update Recipient List'
      secondaryActions={this.secondaryActions}
      breadcrumbAction={{
        content: 'Recipient Lists',
        Component: Link,
        to: '/lists/recipient-lists' }}>

      <RecipientListForm editMode={true} onSubmit={this.updateRecipientList} />

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
  current: currentRecipientList(state),
  list: state.recipientLists.list,
  error: state.recipientLists.error,
  loading: state.recipientLists.listLoading
});

const mapDispatchToProps = {
  listRecipientLists,
  setCurrentRecipientList,
  updateRecipientList,
  deleteRecipientList,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPage));
