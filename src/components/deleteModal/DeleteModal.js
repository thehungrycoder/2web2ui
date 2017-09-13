import React, { Component } from 'react';
import { Panel, Button, Modal } from '@sparkpost/matchbox';

import styles from './DeleteModal.module.scss';

class DeleteModal extends Component {
  render() {
    const { open, title, text, handleToggle, handleDelete } = this.props;

    return (
      <Modal open={open}>
        <Panel title={title} sectioned>
          <p>{text}</p>
          <Button onClick={handleDelete} primary className={styles.Confirm}>Delete</Button>
          <Button onClick={handleToggle} className={styles.Cancel}>Cancel</Button>
        </Panel>
      </Modal>
    );
  }
}

export default DeleteModal;
