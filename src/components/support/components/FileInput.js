import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Tag, Error } from '@sparkpost/matchbox';

import { shrinkToFit } from 'src/helpers/string';

import styles from './FileInput.module.scss';

const defaultLabel = 'No file selected';

const maxLabelLength = 50;

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
      return <Tag className={styles.Tag} onRemove={this.clear}>{shrinkToFit(label, maxLabelLength)}</Tag>;
    }
    return <Tag className={styles.Tag}>No file selected</Tag>;
  }

  buildAcceptList(accept) {
    if (Array.isArray(accept)) {
      return accept.join(',');
    }
    return accept;
  }

  render() {
    const { accept = '', meta: { touched, error }, children } = this.props;

    const errorMarkup = touched && error ? <Error inline={true} error={error} /> : null;

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
        { error ? errorMarkup : this.renderTag() }
    </div>;
  }
}

FileInput.propTypes = {
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

