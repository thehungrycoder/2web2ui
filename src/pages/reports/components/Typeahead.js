import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import _ from 'lodash';
import { refreshTypeaheadCache } from 'src/actions/reportOptions';
import sortMatch from 'src/helpers/sortMatch';
import { TextField, ActionList } from '@sparkpost/matchbox';
import Item from './TypeaheadItem';
import styles from './Typeahead.module.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TypeaheadLoading from './TypeaheadLoading';

const TYPES_METRICS = ['Campaign', 'Recipient Domain', 'IP Pool', 'Sending IP'];

function flattenItem({ type, value }) {
  return `${type}:${value}`;
}

export class Typeahead extends Component {
  state = {
    inputValue: '',
    matches: [],
    calculatingMatches: false,
    lastPattern: null
  };

  //Updates matches for Templates, Sending domains, subaccounts, and anything not in `TYPES_METRICS`.
  updateMatches = (pattern) => {
    const { items, selected = []} = this.props;
    const flatSelected = selected.map(flattenItem);
    const matches = sortMatch(items, pattern, (i) => i.value)
      .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })) && !TYPES_METRICS.includes(type))
      .slice(0, 100);
    this.setState({ matches });
  };

  //Updates matches for Campaign, Recipient Domain, IP Pool, and Sending Domain after the metrics api call.
  //Then concatonates the metrics matches to the previous matches.
  updateMatchesAsync = (pattern) => {
    //Only update the matches if the user is still waiting for results this is the last queued call.
    if (this.state.calculatingMatches && pattern === this.state.lastPattern) {
      const { items, selected = []} = this.props;
      const flatSelected = selected.map(flattenItem);
      let matches = sortMatch(items, pattern, (i) => i.value)
        .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })) && TYPES_METRICS.includes(type))
        .slice(0, 100);
      const currentMatches = this.state.matches;
      matches = _.concat(currentMatches, matches);
      this.setState({ matches, calculatingMatches: false, lastPattern: null });
    }
  };

  // Updates the matches with the local templates, sending domains, subaccounts then
  // makes the metrics api calls and appends to the matches.
  updateLookAhead = (pattern) => {
    this.setState({ calculatingMatches: true });
    if (!pattern || pattern.length < 2) {
      const matches = [];
      this.setState({ matches, calculatingMatches: false, lastPattern: null });
      return Promise.resolve();
    } else {
      this.setState({ lastPattern: pattern });//This sets the last queued pattern
      const options = { ...this.props.reportOptions };
      options.match = pattern;
      this.updateMatches(pattern);
      return this.props.refreshTypeaheadCache(options).then(() => {
        this.updateMatchesAsync(pattern);
      });
    }
  };

  updateLookAheadDebounced = _.debounce(this.updateLookAhead, 250);

  handleFieldChange = (e) => {
    this.updateLookAheadDebounced(e.target.value);
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
        })}
        suffix={<TypeaheadLoading isCalculating = {this.state.calculatingMatches} />}
        />
      </div>
    );
  };

  render() {
    return <Downshift onChange={this.handleDownshiftChange} itemToString={() => ''}>
      {this.onTypeahead}
    </Downshift>;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  refreshTypeaheadCache
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Typeahead));
