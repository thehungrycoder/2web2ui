import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import sortMatch from 'src/helpers/sortMatch';

import FromEmailInput from './FromEmailInput';
import FromEmailMenu from './FromEmailMenu';
import styles from './FromEmail.module.scss';

/**
 * This component controls downshift's inputValue manually to prevent cursor jumping on change
 * See:
 * https://github.com/paypal/downshift#oninputvaluechange
 * https://github.com/paypal/downshift/issues/217
 */
class FromEmail extends Component {
  state = {
    matches: []
  }

  componentWillUnmount() {
    this.updateMatches.cancel();
  }

  handleInputValueChange = (value) => {
    this.updateMatches(value);
  }

  handleStateChange = (changes, downshift) => {
    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  }

  // note, depending on size of domains this calculation to find matches could be expensive
  updateMatches = debounce((nextValue) => {
    const { domains, maxNumberOfResults = 100 } = this.props;
    const [inputLocalPart] = nextValue.split('@');

    if (!/@/.test(nextValue)) {
      return this.setState({ matches: []});
    }

    const matches = sortMatch(
      domains.map(({ domain }) => `${inputLocalPart}@${domain}`),
      nextValue
    );
    // note, exclude the first match if it is the current input value
    const begin = matches[0] === nextValue ? 1 : 0;

    this.setState({
      matches: matches.slice(begin, maxNumberOfResults + begin)
    });
  }, 300);

  render() {
    const { domains, value, ...inputProps } = this.props;
    const { matches } = this.state;

    return (
      <Downshift
        onInputValueChange={this.handleInputValueChange}
        onStateChange={this.handleStateChange}
        selectedItem={value}
      >
        {(downshift) => (
          <div className={styles.Typeahead}>
            <FromEmailInput {...inputProps} downshift={downshift} />
            <FromEmailMenu downshift={downshift} items={matches}/>
          </div>
        )}
      </Downshift>
    );
  }
}

export default FromEmail;
