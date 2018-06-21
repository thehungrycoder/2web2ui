import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from '@sparkpost/matchbox';

import { getRecipientList, updateRecipientList } from 'src/actions/recipientLists';
import { showAlert } from '../../../actions/globalAlert';

export class RecipientDelete extends Component {

  getRecipientsDiff() {
    const { email: deleteTarget, list } = this.props;
    return _.compact(_.map(list.recipients, (recipient) => {
      if (recipient.address.email === deleteTarget) {
        return null; //remove it from list;
      }

      //remove empty return_path as that's causing error (todo: investigate)

      if (!recipient.return_path) {
        return _.omit(recipient, ['return_path']);
      } else {
        return recipient;
      }
    }));

  }

  handleDeletion = () => {
    const { list } = this.props;
    //note: in real world we should fetch it again

    const newList = {
      ...this.props.list,
      recipients: this.getRecipientsDiff()
    };

    return this.props.updateRecipientList(newList)
      .then(() => this.props.getRecipientList(list.id))
      .then(() => {
        this.props.showAlert({
          type: 'success',
          message: `Recipient ${this.props.email} is removed from ${this.props.list.name}`
        });
      });
  };

  render() {
    const { loading } = this.props;

    return <Button size='small' onClick={this.handleDeletion} disabled={loading}>Delete</Button>;
  }
}


const mapStateToProps = (state) => ({
  loading: state.recipientLists.updateLoading
});

const mapDispatchToProps = {
  getRecipientList,
  updateRecipientList,
  showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipientDelete);

