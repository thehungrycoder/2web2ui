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
    if (file && !(touched && error)) {
      return <Tag>{file.name}</Tag>;
    }
    return null;
  }

  render() {
    return <Dropzone
      ref={(ref) => this.dropzoneRef = ref}
      name={this.props.name}
      multiple={false}
      accept='.csv'
      disablePreview
      disableClick
      className={styles.FileInputWrapper}
      onDrop={this.handleDrop}>
      { this.renderError() }
      { this.renderFilename() }
      <Button onClick={() => this.dropzoneRef.open()}>Choose a CSV file</Button>
    </Dropzone>;
  }
}

