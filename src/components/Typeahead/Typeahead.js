/* eslint-disable */
import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';

import { TextField, ActionList, Panel } from '@sparkpost/matchbox';
import styles from './Typeahead.module.scss';

const Item = ({ value, helpText = null }) => (
  <div className={styles.Item}>
    <span className={styles.Value}>{ value }</span>
    { helpText && <span className={styles.HelpText}>{ helpText }</span> }
  </div>
);

class Typeahead extends Component {
  state = {
    inputValue: ''
  }

  handleFieldChange = (e) => {
    this.setState({ inputValue: e.target.value });
    this.props.onSearch();
  };

  render() {
    const {
      items, // Items to render in ActionList
      onSelect, // Maps to downshift's onChange function https://github.com/paypal/downshift#onchange
      placeholder, // TextField placeholder
    } = this.props;

    const internals = ({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
      clearSelection
    }) => {

      const actions = items
        .filter((i) => !inputValue || i.value.toLowerCase().includes(inputValue.toLowerCase()))
        .map((item, index) => ({
          content: <Item value={item.value} helpText={item.type} />,
          ...getItemProps({ item, index }),
          highlighted: highlightedIndex === index,
          className: classnames(selectedItem === item && styles.selected) // Styles does nothing, was testing className pass through
        }));

      const listClasses = classnames(styles.List, isOpen && actions.length && styles.open);

      return (
        <div className={styles.Typeahead}>
          <div className={listClasses}><ActionList actions={actions} /></div>
          <TextField {...getInputProps({ placeholder, onChange: this.handleFieldChange, value: this.state.inputValue })} />
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

    return <Downshift onChange={onSelect} onStateChange={handleStageChange}>{internals}</Downshift>;
  }
}

export default Typeahead;
