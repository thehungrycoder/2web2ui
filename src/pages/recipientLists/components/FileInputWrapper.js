import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { Button, Error, Tag } from '@sparkpost/matchbox';

import styles from './FileInputWrapper.module.scss';

export default class FileInputWrapper extends Component {
  dropzoneRef = null;

  handleDrop = (files, errors) => {
    const { input: { onChange, onBlur }} = this.props;
    if (files.length) {
      onChange(files[0]);
      onBlur(); // Fake up onBlur to update redux-form validation and error state
    }
  };

  renderError() {
    const { meta: { touched, error }} = this.props;
    if (touched && error) {
      return <Error error={error} />;
    }
    return null;
  }

  renderFilename() {
    const {
      input: { value: file },
      meta: { touched, error }
    } = this.props;
    if (!(touched && error)) {
      return <Tag className={styles.Tag}>{file ? file.name : 'No file selected'}</Tag>;
    }
    return null;
  }

  render() {
    const { id, label, name } = this.props;

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
        { this.renderFilename() }
        { this.renderError() }
        <Button onClick={() => this.dropzoneRef.open()}>Choose a CSV file</Button>
      </Dropzone>
    </div>;
  }
}

