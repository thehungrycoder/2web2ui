import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from '@sparkpost/matchbox';
import Modal from './Modal';
import styles from './ConfirmationModal.module.scss';
import { Loading } from 'src/components/loading/Loading';

export default class ConfirmationModal extends Component {

  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirmVerb: PropTypes.string
  };

  renderContent() {
    const { children = null, content = children, onConfirm, onCancel, confirmVerb = 'Confirm' } = this.props;
    return (
      <div>
        {content}
        <Button onClick={onConfirm} primary className={styles.Confirm}>
          {confirmVerb}
        </Button>
        <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
      </div>
    );
  }

  render() {
    const {
      open,
      title,
      isPending,
      onCancel
    } = this.props;

    return (
      <Modal open={open} onClose={onCancel}>
        <Panel title={title} accent sectioned>
          {isPending ? <div className={styles.Loading}><Loading /></div> : this.renderContent()}
        </Panel>
      </Modal>
    );
  }
}
