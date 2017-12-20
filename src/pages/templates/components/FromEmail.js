import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, TextField } from '@sparkpost/matchbox';
import cx from 'classnames';

import sortMatch from 'src/helpers/sortMatch';
import styles from './FromEmail.module.scss';

/**
 * This component controls downshift's inputValue manually to prevent cursor jumping on change
 * See:
 * https://github.com/paypal/downshift#oninputvaluechange
 * https://github.com/paypal/downshift/issues/217
 */
export class FromEmail extends Component {

  state = {
    value: ''
  }

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  handleInputValueChange = (value) => {
    this.setState({ value });
  }

  handleStateChange = (changes, downshift) => {
    const { onChange } = this.props;

    // Push changes to redux form store
    if (changes.hasOwnProperty('inputValue')) {
      onChange && onChange(changes.inputValue);
    }

    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  }

  getMatches = (inputValue, selectedItem) => {
    const parts = inputValue.split('@');
    let matches = [];

    // Show matches as soon as '@' exists
    if (parts.length > 1) {
      // Removes selected domain from options
      matches = this.props.domains.reduce((options, { domain }) => {
        if (!selectedItem || parts[1] !== domain) {
          options.push(`${parts[0]}@${domain}`);
        }
        return options;
      }, []);

      matches = sortMatch(matches, inputValue, (item) => item);
    }

    return matches;
  }

  typeaheadFn = ({
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    selectedItem,
    isOpen
  }) => {
    const { domains, onChange, value, error, ...rest } = this.props;
    let matches = this.getMatches(inputValue, selectedItem);

    // Create ActionList actions from matches
    matches = matches.map((item, index) => getItemProps({
      index, item,
      content: item,
      highlighted: highlightedIndex === index
    }));

    const textFieldProps = getInputProps({ ...rest, error: !isOpen && error ? error : undefined, value: this.state.value });
    const listClasses = cx(styles.List, (isOpen && matches.length) && styles.open);

    return (
      <div className={styles.Typeahead}>
        <TextField {...textFieldProps} />
        <ActionList className={listClasses} actions={matches} />
      </div>
    );
  }

  render() {
    return (
      <Downshift
        onInputValueChange={this.handleInputValueChange}
        onStateChange={this.handleStateChange}
        selectedItem={this.state.value} >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

const FromEmailWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <FromEmail
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest} />
  );
};

export default FromEmailWrapper;
