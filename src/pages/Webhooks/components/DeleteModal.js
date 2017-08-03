import React, { Component } from 'react';
import { Panel, Button, Modal } from '@sparkpost/matchbox';

class DeleteModal extends Component {
  render () {
    const { open, handleToggle, handleDelete } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Delete Webhook' sectioned>
          <p>Are you sure you want to delete this webhook?</p>
          <Button onClick={handleDelete} primary>Delete</Button>
          <Button onClick={handleToggle}>Cancel</Button>
        </Panel>
      </Modal>
    );
  }
}

export default DeleteModal;
