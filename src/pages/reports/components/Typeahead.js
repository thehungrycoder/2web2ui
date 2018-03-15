import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import _ from 'lodash';

import sortMatch from 'src/helpers/sortMatch';
import { TextField, ActionList } from '@sparkpost/matchbox';
import Item from './TypeaheadItem';
import styles from './Typeahead.module.scss';

function flattenItem({ type, value }) {
  return `${type}:${value}`;
}

class Typeahead extends Component {
  state = {
    inputValue: '',
    matches: [],
    calculatingMatches: false
  }

  updateMatches = (pattern) => {
    let matches;

    this.setState({ calculatingMatches: true });

    if (!pattern || pattern.length < 2) {
      matches = [];
    } else {
      const { items, selected = []} = this.props;
      const flatSelected = selected.map(flattenItem);
      matches = sortMatch(items, pattern, (i) => i.value)
        .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })))
        .slice(0, 100);
    }

    this.setState({ matches, calculatingMatches: false });
  };

  updateMatchesDebounced = _.debounce(this.updateMatches, 250);

  handleFieldChange = (e) => {
    this.updateMatchesDebounced(e.target.value);
  };

  // Pass only item selection events to mask the
  // case where we call Downshift's clearSelection() which triggers
  // onChange(null).
  handleDownshiftChange = (item) => {
    // Maps to downshift's onChange function https://github.com/paypal/downshift#onchange
    const { onSelect } = this.props;
    if (item) {
      onSelect(item);
    }
  };

  onTypeahead = ({
    getInputProps,
    getItemProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex,
    clearSelection
  }) => {

    const {
      placeholder // TextField placeholder
    } = this.props;

    const { matches = []} = this.state;

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
          onFocus: clearSelection,
          onChange: this.handleFieldChange
        })} />
      </div>
    );
  };

  render() {
    return <Downshift onChange={this.handleDownshiftChange} itemToString={() => ''}>
      {this.onTypeahead}
    </Downshift>;
  }
}

export default Typeahead;
