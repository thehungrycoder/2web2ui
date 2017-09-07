/* eslint-disable */
import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';

import { TextField, ActionList, Panel } from '@sparkpost/matchbox';
import Item from './TypeaheadItem';
import styles from './Typeahead.module.scss';

// const Item = ({ value, helpText = null }) => (
//   <div className={styles.Item}>
//     <span className={styles.Value}>{ value }</span>
//     { helpText && <span className={styles.HelpText}>{ helpText }</span> }
//   </div>
// );

class Typeahead extends Component {
  state = {
    inputValue: '',
    matches: []
  }

  findMatches = (pattern) => {
    if (!pattern || pattern.length < 2) {
      return [];
    }
    const { items } = this.props;
    return items
      .filter((item) => item.value.toLowerCase().includes(pattern.toLowerCase()))
      .slice(0, 100)
  }

  handleFieldChange = (e) => {
    const { value } = e.target;
    this.setState({ matches: this.findMatches(value), inputValue: value });
  };

  render() {
    const {
      onSelect, // Maps to downshift's onChange function https://github.com/paypal/downshift#onchange
      placeholder, // TextField placeholder
    } = this.props;

    const { matches } = this.state;

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
            onChange: this.handleFieldChange,
            value: this.state.inputValue
          })} />
        </div>
      );
    }

    // Downshift automatically sets inputValue to selected value (which is an object and it converts it to a string lol)
    // So instead we manage input value manually.
    const handleStageChange = ({ inputValue }) => {
      if (inputValue === '[object Object]') {
        this.setState({ inputValue: '' });
      }
    }

    return <Downshift onChange={onSelect} onStateChange={handleStageChange}>{typeaheadFn}</Downshift>;
  }
}

export default Typeahead;
