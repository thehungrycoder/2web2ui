import React, { Component } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import _ from 'lodash';
import { METRICS_API_LIMIT, TYPEAHEAD_LIMIT } from '../../../constants';
import { refreshTypeaheadCache } from 'src/actions/reportOptions';
import sortMatch from 'src/helpers/sortMatch';
import { TextField, ActionList } from '@sparkpost/matchbox';
import Item from './TypeaheadItem';
import styles from './Typeahead.module.scss';
import { connect } from 'react-redux';
import { Loading } from 'src/components';

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

  //Gets all filter items that match the pattern with possible whitelisting and blacklisting of types
  getMatches = ({ pattern, whiteListTypes, blackListTypes }) => {
    const { items, selected = []} = this.props;
    const flatSelected = selected.map(flattenItem);
    let matches = sortMatch(items, pattern, (i) => i.value)
      .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })));
    if (whiteListTypes) {
      matches = matches.filter(({ type }) => whiteListTypes.includes(type));
    }
    if (blackListTypes) {
      matches = matches.filter(({ type }) => !blackListTypes.includes(type));
    }
    return matches;
  };

  // Updates the matches with the already-loaded templates, sending domains, subaccounts then
  // makes the metrics api calls and appends to the matches.
  updateLookAhead = (pattern) => {
    this.setState({ calculatingMatches: true });
    if (!pattern || pattern.length < 2) {
      this.setState({ matches: [], calculatingMatches: false, lastPattern: null });
      return Promise.resolve();
    } else {
      this.setState({ lastPattern: pattern });//This sets the last queued pattern
      const options = { ...this.props.reportOptions, match: pattern, limit: METRICS_API_LIMIT };
      const synchronousMatches = this.getMatches({ pattern, blackListTypes: TYPES_METRICS });
      this.setState({ matches: synchronousMatches });

      return this.props.refreshTypeaheadCache(options).then(() => {
        const asyncMatches = this.getMatches({ pattern, whiteListTypes: TYPES_METRICS });
        const matches = _.concat(synchronousMatches , asyncMatches).slice(0,TYPEAHEAD_LIMIT);
        this.setState({ matches, calculatingMatches: false, lastPattern: null });
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
        suffix={<Loading hidden = {!this.state.calculatingMatches} isForTypeahead={true}/>}
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

const mapDispatchToProps = {
  refreshTypeaheadCache
};

export default connect(null, mapDispatchToProps)(Typeahead);
