import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Tag, Error } from '@sparkpost/matchbox';

import styles from './FileInput.module.scss';

const defaultLabel = 'No file selected';

export default class FileInput extends Component {
  state = {
    label: null
  };

  onChange = (evt) => {
    let file = null;
    let label = defaultLabel;
    const files = Array(...evt.target.files);
    if (files.length > 0) {
      file = files[0];
      label = file.name;
    }

    this.updateValue(file, label);
    return file;
  }

  updateValue(newValue, label) {
    const { input: { onChange, onBlur }} = this.props;
    this.setState({ label });
    onChange(newValue);
    onBlur(newValue);
  }

  clear = () => this.updateValue(null, null);

  renderTag() {
    const { label } = this.state;
    if (label) {
      return <Tag className={styles.Tag} onRemove={this.clear}>{label}</Tag>;
    }
    return <Tag className={styles.Tag}>No file selected</Tag>;
  }

  renderError() {
    const { meta: { touched, error }} = this.props;
    if (touched && error) {
      return <Error error={error} />;
    }
  }

  buildAcceptList(accept) {
    if (Array.isArray(accept)) {
      return accept.join(',');
    }
    return accept;
  }

  render() {
    const { accept = '', children } = this.props;

    let fileInput;
    return <div>
      <input
        type='file'
        ref={(ref) => fileInput = ref}
        onChange={this.onChange}
        accept={this.buildAcceptList(accept)}
        className={styles.InputElement}
        />
        <Button onClick={() => fileInput && fileInput.click()}>{children}</Button>
        { this.renderTag() }
        { this.renderError() }
    </div>;
  }
}

FileInput.propTypes = {
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

