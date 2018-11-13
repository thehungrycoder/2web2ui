import _ from 'lodash';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Error, Label } from '@sparkpost/matchbox';
import { FileUpload } from '@sparkpost/matchbox-icons';
import { shrinkToFit } from 'src/helpers/string';
import styles from './FileFieldWrapper.module.scss';

// TODO: Integrate in Matchbox if Dropzone isn't too big of a dependency
// TODO: Need a clear button
export default class FileFieldWrapper extends Component {
  handleCancel = () => {
    this.props.input.onBlur(); // run validation
  }

  // Always set value to dropped file even if rejected for validate functions to set error
  handleDrop = (acceptedFiles, rejectedFiles) => {
    const files = [...acceptedFiles, ...rejectedFiles];
    this.props.input.onChange(files[0]);
    this.props.input.onBlur(); // run validation
  }

  handleOpen = () => {
    this.dropzoneRef.open();
  }

  setDropzoneRef = (ref) => {
    this.dropzoneRef = ref;
  }

  render() {
    const { disabled, fileType, fileTypes, helpText, input, label, meta, required, style = {}, labelHidden, placeholder = 'Drag a file here, or click to browse' } = this.props;
    const filename = _.get(input, 'value.name');
    let acceptedTypes = fileType ? `.${fileType}` : '';
    if (typeof fileTypes !== 'undefined' && fileTypes.length > 0) {
      acceptedTypes = fileTypes;
    }

    return (
      <fieldset className={styles.Field}>
        <Label id={input.id}>
          {!labelHidden ? label : null}{!labelHidden && required ? ' *' : null}
          {(meta.touched && meta.error) ? <span>{' '}<Error error={meta.error} wrapper='span' /></span> : null}
        </Label>
        <div className={styles.InputWrapper}>
          <Dropzone
            accept={acceptedTypes}
            activeClassName={styles.DropzoneActive}
            className={styles.Dropzone}
            style={style}
            disabledClassName={styles.DropzoneDisabled}
            disabled={disabled}
            id={input.id}
            multiple={false}
            name={input.name}
            onDrop={this.handleDrop}
            onFileDialogCancel={this.handleCancel}
            ref={this.setDropzoneRef}
          >
            {(filename && !meta.error)
              ? <span>{shrinkToFit(filename, 50)}</span>
              : <span className={styles.Placeholder}><FileUpload /><span>{placeholder}</span></span>}
          </Dropzone>
        </div>
        {helpText ? <div className={styles.Help}>{helpText}</div> : null}
      </fieldset>
    );
  }
}
