import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'helpers/sortMatch';
import Item from './SubaccountTypeaheadItem';
import styles from './SubaccountTypeahead.module.scss';

const cx = classnames.bind(styles);

const itemToString = (item) => (item ? item.name : '');

export class SubaccountTypeahead extends Component {
  static defaultProps = {
    name: 'subaccount'
  };

  typeaheadFn = ({
    getInputProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
    inputValue,
    selectedItem,
    clearSelection,
    isOpen
  }) => {
    const { name, subaccounts } = this.props;

    const mappedMatches = sortMatch(
      subaccounts,
      inputValue,
      (item) => `${item.name} ID: ${item.id}`
    ).map((item, index) => ({
      ...getItemProps({ item, index }),
      content: <Item name={item.name} id={item.id} />,
      highlighted: highlightedIndex === index
    }));

    const listClasses = cx('List', {
      open: isOpen && mappedMatches.length
    });

    const textFieldProps = getInputProps({
      connectRight: selectedItem && this.renderClearButton(clearSelection),
      disabled: !!selectedItem,
      id: name,
      label: 'Subaccount',
      name,
      placeholder: 'None'
    });

    return (
      <div className={cx('Typeahead')}>
        <TextField {...textFieldProps} />
        <ActionList className={listClasses} actions={mappedMatches} />
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

export default SubaccountTypeahead;
