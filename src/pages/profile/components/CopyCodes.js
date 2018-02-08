import React, { Component } from 'react';
import { Button, Icon, Tooltip } from '@sparkpost/matchbox';
import copy from 'copy-to-clipboard';

export default class CopyCodes extends Component {
  state = {
    copied: false
  };
  timeout = null;

  copyToClipboard = () => {
    copy(this.props.codes.join('\n'));
    this.setState({ copied: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ copied: false }), 3000);
  }

  render() {
    const { copied } = this.state;

    const button = <Button onClick={this.copyToClipboard}><Icon name='Copy' size={14}/>Copy</Button>;
    return copied
      ? <Tooltip dark content='Copied to clipboard!'>{ button }</Tooltip>
      : button;

  }
}

