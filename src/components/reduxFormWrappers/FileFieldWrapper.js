import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { Button, Error, Tag } from '@sparkpost/matchbox';

import { shrinkToFit } from 'src/helpers/string';

import styles from './FileFieldWrapper.module.scss';

const maxLabelLength = 50;

export default class FileFieldWrapper extends Component {
  dropzoneRef = null;

  handleDrop = (files, errors) => {
    const { input: { onChange, onBlur }} = this.props;
    if (files.length) {
      onChange(files[0]);
      onBlur(); // Fake up onBlur to update redux-form validation and error state
    }
  };

  renderError() {
    const { meta: { error }} = this.props;
    return <Error error={error} />;
  }

  renderFilename() {
    const { input: { value: file }} = this.props;

    return <Tag className={styles.Tag}>
      {file ? shrinkToFit(file.name, maxLabelLength) : 'No file selected'}
    </Tag>;
  }

  render() {
    const { id, label, name, meta: { touched, error }, disabled } = this.props;

    return <div>
      <label id={id} htmlFor={id} className={styles.Label}>{label}</label>
      <Dropzone
        ref={(ref) => this.dropzoneRef = ref}
        name={name}
        multiple={false}
        accept='.csv'
        disablePreview
        disableClick
        className={styles.Dropzone}
        onDrop={this.handleDrop}>
        { touched && error ? this.renderError() : this.renderFilename() }
        <Button
          disabled={disabled}
          onClick={() => this.dropzoneRef.open()}>Choose a CSV file</Button>
      </Dropzone>
    </div>;
  }
}
