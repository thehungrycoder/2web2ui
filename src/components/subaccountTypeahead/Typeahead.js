import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
import Item from './SubaccountTypeaheadItem';
import styles from './SubaccountTypeahead.module.scss';

const cx = classnames.bind(styles);

const itemToString = (item) => (item ? `${item.name} (${item.id})` : '');

export class Typeahead extends Component {
  static defaultProps = {
    name: 'subaccount'
  };

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
    const { name, results, disabled, label = 'Subaccount', placeholder = (isOpen ? 'Type to search' : 'None'), error, helpText } = this.props;

    const matches = sortMatch(
      results,
      inputValue,
      (item) => `${item.name} ID: ${item.id}`
    );

    const mappedItems = (matches.length ? matches : results).map((item, index) => ({
      ...getItemProps({ item, index }),
      content: <Item name={item.name} id={item.id} />,
      highlighted: highlightedIndex === index
    }));

    const listClasses = cx('List', {
      open: isOpen && (!inputValue || matches.length),
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
      error: (!isOpen && error) ? error : null
    });

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <ActionList className={listClasses} actions={mappedItems} />
        <TextField {...textFieldProps} onFocus={openMenu} />
      </div>
    );
  };

  renderClearButton(clearSelection) {
    return <Button onClick={clearSelection}>Clear</Button>;
  }

  render() {
    const { onChange, selectedItem } = this.props;

    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        selectedItem={selectedItem}
      >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

Typeahead.defaultProps = {
  results: []
};
