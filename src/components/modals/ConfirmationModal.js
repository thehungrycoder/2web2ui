import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from '@sparkpost/matchbox';
import Modal from './Modal';
import styles from './ConfirmationModal.module.scss';

export default class ConfirmationModal extends Component {

  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirmVerb: PropTypes.string
  };

  render() {
    const {
      open,
      title,
      content = null,
      onCancel,
      onConfirm,
      confirmVerb = 'Confirm'
    } = this.props;

    return (
      <Modal open={open}>
        <Panel title={title} accent sectioned>
          {content}
          <Button onClick={onConfirm} primary className={styles.Confirm}>{confirmVerb}</Button>
          <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
        </Panel>
      </Modal>
    );
  }
}
