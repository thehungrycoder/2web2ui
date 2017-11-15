import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import { TextField, Icon, Button, Tooltip } from '@sparkpost/matchbox';

/**
 * Reusable TextField with a copy button for strings
 */
class CopyField extends Component {
  static defaultProps = {
    hideCopy: false
  }

  state = {
    copied: false
  }

  handleFieldFocus = (e) => {
    e.target.select();
  }

  handleCopy = () => {
    copy(this.props.value);
    this.setState({ copied: true });
    window.setTimeout(() => {
      this.setState({ copied: false });
    }, 3000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.object) {
      this.setState({ copied: false });
    }
  }

  render() {
    const { value, hideCopy } = this.props;
    const { copied } = this.state;
    let connectRight = null;

    if (!hideCopy) {
      const button = <Button onClick={() => this.handleCopy()}><Icon name='Copy' size={14}/> Copy</Button>;
      connectRight = copied
        ? <Tooltip content='Copied to clipboard!' style={{ width: '40px' }}>{ button }</Tooltip>
        : button;
    }

    return (
      <TextField
        readOnly
        connectRight={connectRight}
        value={value}
        onFocus={this.handleFieldFocus} />
    );
  }
}

CopyField.propTypes = {
  value: PropTypes.string,
  hideCopy: PropTypes.bool
};

export default CopyField;
