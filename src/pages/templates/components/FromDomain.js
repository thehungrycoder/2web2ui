import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';
import cx from 'classnames';

import sortMatch from 'src/helpers/sortMatch';
// import Item from './FromDomainItem';
// import styles from './FromDomain.module.scss';

const split = (value) => value.split('@');

export class FromDomain extends Component {
  static defaultProps = {
    name: 'content.from.email'
  };

  getMatches = (inputValue, selectedItem) => {
    const parts = split(inputValue);
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
    const { label, domains, onChange, ...rest } = this.props;
    let matches = this.getMatches(inputValue, selectedItem);

    matches = matches.map((item, index) => getItemProps({
      index, item,
      content: item,
      highlighted: highlightedIndex === index
    }));

    const handleOnChange = (e) => {
      if (!highlightedIndex) {
        setHighlightedIndex(0); // Defaults to first item highlighted
      }
      onChange && onChange(e);
    };

    const textFieldProps = getInputProps({ label, name, onChange: handleOnChange, ...rest });

    return (
      <div>
        <TextField {...textFieldProps} />
        <ActionList actions={matches} />
      </div>
    );
  }

  render() {
    return (
      <Downshift onChange={this.props.onChange} >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

const FromDomainWrapper = ({ input, meta, ...rest }) => {
  const { onChange, value } = input;
  const { active, error, touched } = meta;
  return <FromDomain onChange={onChange} {...input} value={value} error={!active && touched && error ? error : undefined} {...rest} />;
};

export default FromDomainWrapper;
