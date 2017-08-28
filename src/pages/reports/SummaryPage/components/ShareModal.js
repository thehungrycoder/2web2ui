/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Panel, Button, TextField, Icon } from '@sparkpost/matchbox';

import styles from './ShareModal.module.scss';

class ShareModal extends Component {
  state = {
    showConfimation: false
  }

  handleFocus = (e) => {
    e.target.select();
  }

  handleCopy = (e) => {
    this.textInput.select();
    document.execCommand('copy');
    this.textInput.blur();
    this.setState({ showConfimation: true })
  }

  handleToggle = () => {
    this.setState({ showConfimation: false });
    this.props.handleToggle();
  }

  render() {
    const { open, link } = this.props;

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
              connectRight={
                <Button onClick={() => this.handleCopy()}>
                  <Icon name='Copy' size={14} /> Copy
                </Button>
              }/>
              { this.state.showConfimation
                ? <p className={styles.Copied}>Copied to clipboard!</p>
                : null
              }
            <Button primary onClick={this.handleToggle}>Done</Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}

export default ShareModal;
