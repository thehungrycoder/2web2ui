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

  /**
   * Returns all matches that match a pattern.
   *
   * If excludedItems is passed, it then takes the matches and
   * filters out any items that already exist in excludedItems.
   */
  getMatches = ({ pattern, excludedItems }) => {
    const { items, selected = []} = this.props;
    const flatSelected = selected.map(flattenItem);
    let matches = sortMatch(items, pattern, (i) => i.value)
      .filter(({ type, value }) => !flatSelected.includes(flattenItem({ type, value })))
      .slice(0,TYPEAHEAD_LIMIT);

    if (excludedItems) {
      const isInExcludedItems = function (item) {
        return excludedItems.some((excludedItem) => _.isEqual(item, excludedItem));
      };
      matches = matches.filter((item) => !isInExcludedItems(item));
    }
    return matches;
  };

  /**
   * The lookahead/typeahead only activates when there are at least 2 characters.
   * If there are, it finds matches within the currently loaded items.
   * Then it makes the metrics api calls to load new items, filters those
   * items for matches while excluding results that already exits, and finally
   * appending the results to the existing matches.
   *
   */
  updateLookAhead = (pattern) => {
    if (!pattern || pattern.length < 2) {
      this.setState({ matches: [], calculatingMatches: false, lastPattern: null });
      return Promise.resolve();
    }

    this.setState({ calculatingMatches: true });
    this.setState({ lastPattern: pattern });//This sets the last queued pattern
    this.setState({ matches: this.getMatches({ pattern }) });

    const options = { ...this.props.reportOptions, match: pattern, limit: METRICS_API_LIMIT };
    return this.props.refreshTypeaheadCache(options).then(() =>
      this.appendNewMatches(pattern)
    );
  };

  //Appends the new metrics items only if the pattern is last in the queue
  appendNewMatches = (pattern) => {
    if (pattern === this.state.lastPattern) {
      const currentMatches = this.state.matches;
      const asyncMatches = this.getMatches({ pattern, excludedItems: currentMatches });
      const matches = _.concat(currentMatches, asyncMatches).slice(0, TYPEAHEAD_LIMIT);
      this.setState({ matches, calculatingMatches: false, lastPattern: null });
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
