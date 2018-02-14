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

  timeout = null

  handleFieldFocus = (e) => {
    e.target.select();
  }

  handleCopy = () => {
    copy(this.props.value);
    this.setState({ copied: true });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ copied: false }), 3000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.object) {
      this.setState({ copied: false });
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { value, hideCopy, ...fieldProps } = this.props;
    const { copied } = this.state;
    let connectRight = null;

    if (!hideCopy) {
      const button = <Button onClick={this.handleCopy}><Icon name='Copy' size={14}/> Copy</Button>;
      connectRight = copied
        ? <Tooltip dark content='Copied to clipboard!'>{ button }</Tooltip>
        : button;
    }

    return (
      <TextField
        readOnly
        connectRight={connectRight}
        value={value}
        onFocus={this.handleFieldFocus}
        {...fieldProps}
      />
    );
  }
}

CopyField.propTypes = {
  value: PropTypes.string,
  hideCopy: PropTypes.bool
};

export default CopyField;
