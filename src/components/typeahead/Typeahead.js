import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
import styles from './Typeahead.module.scss';

const cx = classnames.bind(styles);

export const TypeaheadItem = ({ id, label }) => (
  <div className={styles.Item}>
    {label}
    <span className={styles.id}>{id}</span>
  </div>
);

export class Typeahead extends Component {
  static defaultProps = {
    name: 'subaccount'
  };

  handleStateChange = (changes, downshift) => {
    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  }

  typeaheadFn = ({
    getInputProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
    inputValue,
    openMenu,
    selectedItem,
    clearSelection,
    isOpen
  }) => {
    const {
      disabled,
      error,
      errorInLabel,
      helpText,
      itemToString,
      label,
      maxHeight = 300,
      // must limit number of results to avoid running out of memory
      maxNumberOfResults = 100,
      name,
      placeholder = (isOpen ? 'Type to search' : 'None'),
      renderItem,
      results
    } = this.props;

    const matches = sortMatch(
      results,
      inputValue,
      itemToString
    );

    const mappedItems = (matches.length ? matches : results)
      .slice(0, maxNumberOfResults)
      .map((item, index) => ({
        ...getItemProps({ item, index }),
        content: renderItem ? renderItem(item) : <div className={styles.Item}>{item}</div>,
        highlighted: highlightedIndex === index
      }));

    const listClasses = cx('List', {
      open: isOpen && !selectedItem && (!inputValue || matches.length),
      hasHelp: !!helpText
    });

    const textFieldProps = getInputProps({
      connectRight: selectedItem && !disabled ? this.renderClearButton(clearSelection) : null,
      readOnly: !!selectedItem,
      disabled,
      id: name,
      label,
      name,
      placeholder,
      helpText,
      error: (!isOpen && error) ? error : null,
      errorInLabel
    });

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <ActionList className={listClasses} actions={mappedItems} maxHeight={maxHeight} />
        <TextField {...textFieldProps} onFocus={openMenu} />
      </div>
    );
  };

  renderClearButton(clearSelection) {
    return <Button onClick={clearSelection}>Clear</Button>;
  }

  render() {
    const { itemToString, onChange, selectedItem } = this.props;

    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        selectedItem={selectedItem}
        onStateChange={this.handleStateChange}
      >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

Typeahead.defaultProps = {
  results: []
};
