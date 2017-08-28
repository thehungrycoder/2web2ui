/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Panel, Button, TextField } from '@sparkpost/matchbox';

import styles from './ShareModal.module.scss';

class ShareModal extends Component {
  constructor(props) {
    super(props);
  }

  handleFocus = (e) => {
    e.target.select();
  }

  handleCopy = (e) => {
    this.textInput.select();
    document.execCommand('copy');
    this.textInput.blur();
  }

  render() {
    const { open, handleToggle, link } = this.props;

    return (
      <Modal open={open}>
        <Panel title='Share this report'>
          <Panel.Section>
            <input
              className={styles.Hidden}
              value={link} readOnly
              type='text'
              ref={(input) => { this.textInput = input; }} />
            <TextField
              value={link} readOnly
              onFocus={this.handleFocus}
              connectRight={<Button onClick={() => this.handleCopy()}>Copy</Button>}/>
            <Button primary onClick={handleToggle} className={styles.Done}>Done</Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}

export default ShareModal;
