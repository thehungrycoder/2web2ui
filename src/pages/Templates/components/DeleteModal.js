import React, { Component } from 'react';
import { Panel, Button, Modal } from '@sparkpost/matchbox';

import styles from './DeleteModal.module.scss';

class DeleteModal extends Component {
  render() {
    const { open, handleToggle, handleDelete } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Delete Template' sectioned>
          <p>Are you sure you want to delete this template? Both draft and published versions of this template will be deleted.</p>
          <Button onClick={handleDelete} primary className={styles.Confirm}>Delete</Button>
          <Button onClick={handleToggle} className={styles.Cancel}>Cancel</Button>
        </Panel>
      </Modal>
    );
  }
}

export default DeleteModal;
