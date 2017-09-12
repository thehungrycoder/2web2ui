import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import _ from 'lodash';

import sortMatch from 'helpers/sortMatch';
import { TextField, ActionList } from '@sparkpost/matchbox';
import Item from './TypeaheadItem';
import styles from './Typeahead.module.scss';

function flattenItem({ type, value }) {
  return `${type}:${value}`;
}

class Typeahead extends Component {
  state = {
    inputValue: '',
    matches: []
  }

  updateMatches = _.debounce((pattern) => {
    let matches;

    if (!pattern || pattern.length < 2) {
      matches = [];
    } else {
      const { items, selected = []} = this.props;
      const flatSelected = selected.map(flattenItem);
      matches = sortMatch(items, pattern, (i) => i.value)
        .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })))
        .slice(0, 100);
    }

    this.setState({ matches });
  }, 250)

  handleFieldChange = (e) => {
    this.updateMatches(e.target.value);
  };

  render() {
    const {
      onSelect, // Maps to downshift's onChange function https://github.com/paypal/downshift#onchange
      placeholder // TextField placeholder
    } = this.props;

    const { matches = []} = this.state;

    const typeaheadFn = ({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
      clearSelection
    }) => {

      const mappedMatches = matches.map((item, index) => ({
        content: <Item value={item.value} helpText={item.type} />,
        ...getItemProps({ item, index }),
        highlighted: highlightedIndex === index,
        className: classnames(selectedItem === item && styles.selected) // Styles does nothing, was testing className pass through
      }));

      const listClasses = classnames(styles.List, isOpen && mappedMatches.length && styles.open);

      return (
        <div className={styles.Typeahead}>
          <div className={listClasses}><ActionList actions={mappedMatches} /></div>
          <TextField {...getInputProps({
            placeholder,
            onChange: this.handleFieldChange
          })} />
        </div>
      );
    };

    return <Downshift onChange={onSelect} itemToString={() => ''}>{typeaheadFn}</Downshift>;
  }
}

export default Typeahead;
