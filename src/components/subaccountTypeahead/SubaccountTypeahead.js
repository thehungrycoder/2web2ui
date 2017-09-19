import cx from 'classnames';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import React from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import Item from './SubaccountTypeaheadItem';
import styles from './SubaccountTypeahead.module.scss';

const itemToString = (item) => (item ? item.name : '');

const SubaccountTypeahead = ({ name, onChange, subaccounts }) => {
  const typeaheadFn = ({
    getInputProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
    inputValue,
    selectedItem,
    clearSelection,
    isOpen
  }) => {
    const mappedMatches = subaccounts
      .filter(
        (item) =>
          !inputValue ||
          item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.id.toString().includes(inputValue)
      )
      // .slice(0, 10) // TODO tweak this number
      .map((item, index) => {
        const { id, name } = item;

        return {
          ...getItemProps({ item, index }),
          content: <Item name={name} id={id} />,
          highlighted: highlightedIndex === index
        };
      });

    const listClasses = cx(styles.List, {
      [styles.open]: isOpen && mappedMatches.length
    });

    return (
      <div className={styles.Typeahead}>
        <TextField
          {...getInputProps({
            name,
            id: name,
            placeholder: 'None',
            label: 'Subaccount',
            disabled: !!selectedItem,
            connectRight: selectedItem && (
              <Button className={styles.Clear} onClick={clearSelection}>
                Clear
              </Button>
            )
          })}
        />
        <ActionList className={listClasses} actions={mappedMatches} />
      </div>
    );
  };

  return (
    <Downshift onChange={onChange} itemToString={itemToString}>
      {typeaheadFn}
    </Downshift>
  );
};

SubaccountTypeahead.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  subaccounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

SubaccountTypeahead.defaultProps = {
  name: 'subaccount'
};

export default SubaccountTypeahead;
