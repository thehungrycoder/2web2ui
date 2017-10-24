import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
import Item from './PoolTypeaheadItem';
import styles from './PoolTypeahead.module.scss';

const cx = classnames.bind(styles);

const itemToString = (item) => (item ? item.name : '');

export class PoolTypeahead extends Component {
  static defaultProps = {
    name: 'ipPool'
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
    const { name, pools } = this.props;

    const mappedMatches = sortMatch(
      pools,
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
      label: 'Pool',
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

export default PoolTypeahead;
