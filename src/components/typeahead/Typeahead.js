import classnames from 'classnames/bind';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import { ActionList, Button, TextField } from '@sparkpost/matchbox';

import sortMatch from 'src/helpers/sortMatch';
import styles from './Typeahead.module.scss';

const cx = classnames.bind(styles);

export const TypeaheadItem = ({ id, label }) => (
  <div className={styles.Item}>
    {label}
    <span className={styles.id}>{id}</span>
  </div>
);

export class Typeahead extends Component {
  static defaultProps = {
    name: 'subaccount',
    results: []
  }

  state = {
    inputValue: '',
    matches: []
  }

  componentDidMount() {
    this.updateMatches(this.state.inputValue);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.results.length && this.props.results.length) {
      this.updateMatches(this.state.inputValue);
    }
  }

  componentWillUnmount() {
    this.updateMatches.cancel();
  }

  // note, sorting large result lists can be expensive
  updateMatches = debounce((inputValue) => {
    const { itemToString, maxNumberOfResults = 100, results = []} = this.props;
    const matches = inputValue ? sortMatch(results, inputValue, itemToString) : results;

    this.setState({ inputValue, matches: matches.slice(0, maxNumberOfResults) });
  }, 300)

  handleStateChange = (changes, downshift) => {
    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  }

  typeaheadFn = ({
    clearSelection,
    getInputProps,
    getItemProps,
    highlightedIndex,
    isOpen,
    openMenu,
    selectedItem
  }) => {
    const {
      disabled,
      error,
      errorInLabel,
      helpText,
      label,
      maxHeight = 300,
      name,
      placeholder = (isOpen ? 'Type to search' : 'None'),
      renderItem
    } = this.props;
    const { matches } = this.state;
    const items = matches.map((item, index) => getItemProps({
      content: renderItem ? renderItem(item) : <div className={styles.Item}>{item}</div>,
      highlighted: highlightedIndex === index,
      index,
      item
    }));

    const listClasses = cx('List', {
      open: isOpen && !selectedItem && matches.length,
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
      error: (!isOpen && error) ? error : null,
      errorInLabel
    });

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <ActionList className={listClasses} actions={items} maxHeight={maxHeight} />
        <TextField {...textFieldProps} onFocus={openMenu} />
      </div>
    );
  };

  renderClearButton(clearSelection) {
    return <Button onClick={clearSelection}>Clear</Button>;
  }

  render() {
    const { itemToString, onChange, selectedItem } = this.props;

    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        onInputValueChange={this.updateMatches}
        onStateChange={this.handleStateChange}
        selectedItem={selectedItem}
      >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}
