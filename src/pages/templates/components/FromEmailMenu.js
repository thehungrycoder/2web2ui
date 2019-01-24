import React from 'react';
import cx from 'classnames';
import { ActionList } from '@sparkpost/matchbox';
import styles from './FromEmail.module.scss';

const FromEmailMenu = ({ downshift: { getItemProps, highlightedIndex, isOpen }, items = []}) => {
  const actions = items.map((item, index) => (
    getItemProps({
      content: item,
      highlighted: highlightedIndex === index,
      index,
      item
    })
  ));
  const listClasses = cx(styles.List, (isOpen && items.length) && styles.open);

  return (
    <ActionList
      actions={actions}
      className={listClasses}
      maxHeight={300}
    />
  );
};

export default FromEmailMenu;
