import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, TextField } from '@sparkpost/matchbox';
import cx from 'classnames';

import sortMatch from 'src/helpers/sortMatch';
import styles from './FromDomain.module.scss';

export class FromDomain extends Component {

  handleChange = (value, downshift) => {
    const { onChange } = this.props;

    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }

    onChange && onChange(value);
  }

  getMatches = (inputValue, selectedItem) => {
    const parts = inputValue.split('@');
    let matches = [];

    // Show matches as soon as '@' exists
    if (parts[1] === '' || parts[1]) {
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
    setHighlightedIndex,
    inputValue,
    selectedItem,
    isOpen
  }) => {
    const { label, domains, onChange, value, ...rest } = this.props;
    let matches = this.getMatches(inputValue, selectedItem);

    // Create ActionList actions from matches
    matches = matches.map((item, index) => getItemProps({
      index, item,
      content: item,
      highlighted: highlightedIndex === index
    }));

    const textFieldProps = getInputProps({ label, name, onChange, value, ...rest });
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
        onChange={this.handleChange}
        value={this.props.value}>
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

const FromDomainWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <FromDomain
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest} />
  );
};

export default FromDomainWrapper;
