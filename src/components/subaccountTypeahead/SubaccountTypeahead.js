import classnames from 'classnames/bind';
import Downshift from 'downshift';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { list as getSubaccountsList } from 'src/actions/subaccounts';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
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
    openMenu,
    selectedItem,
    clearSelection,
    isOpen
  }) => {
    const { name, subaccounts, disabled } = this.props;

    const matches = sortMatch(
      subaccounts,
      inputValue,
      (item) => `${item.name} ID: ${item.id}`
    );

    const mappedItems = (matches.length ? matches : subaccounts).map((item, index) => ({
      ...getItemProps({ item, index }),
      content: <Item name={item.name} id={item.id} />,
      highlighted: highlightedIndex === index
    }));

    const listClasses = cx('List', {
      open: isOpen && (!inputValue || matches.length)
    });

    const textFieldProps = getInputProps({
      connectRight: selectedItem && this.renderClearButton(clearSelection),
      readOnly: !!selectedItem,
      disabled,
      id: name,
      label: 'Subaccount',
      name,
      placeholder: 'None'
    });

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <TextField {...textFieldProps} onFocus={openMenu} />
        <ActionList className={listClasses} actions={mappedItems} />
      </div>
    );
  };

  componentDidMount() {
    const { hasSubaccounts, subaccounts } = this.props;
    if (hasSubaccounts && subaccounts.length === 0) {
      this.props.getSubaccountsList();
    }
  }

  renderClearButton(clearSelection) {
    return <Button onClick={clearSelection}>Clear</Button>;
  }

  render() {
    const { hasSubaccounts, onChange, selectedItem } = this.props;

    if (!hasSubaccounts) {
      return null;
    }

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

SubaccountTypeahead.defaultProps = {
  subaccounts: []
};

const mapStateToProps = (state) => ({
  hasSubaccounts: state.currentUser.has_subaccounts,
  subaccounts: state.subaccounts.list
});
export default connect(mapStateToProps, { getSubaccountsList })(SubaccountTypeahead);
