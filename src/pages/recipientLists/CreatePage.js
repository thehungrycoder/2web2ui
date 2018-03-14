import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';

import { createRecipientList } from 'src/actions/recipientLists';
import { showAlert } from 'src/actions/globalAlert';

import RecipientListForm from './components/RecipientListForm';

export class CreatePage extends Component {

  createRecipientList = (values) => {
    const { createRecipientList, showAlert, history } = this.props;

    return createRecipientList(values).then(() => {
      showAlert({
        type: 'success',
        message: 'Created recipient list'
      });
      history.push('/lists/recipient-lists');
    });
  };

  render() {

    return <Page
      title='Create Recipient List'
      breadcrumbAction={{
        content: 'Recipient Lists',
        Component: Link,
        to: '/lists/recipient-lists' }}>

      <RecipientListForm onSubmit={this.createRecipientList} />

    </Page>;
  }
}

const mapDispatchToProps = {
  createRecipientList,
  showAlert
};

export default withRouter(connect(undefined, mapDispatchToProps)(CreatePage));
