import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { TextField, ActionList } from '@sparkpost/matchbox';
import TypeaheadItem from './TypeaheadItem';

import styles from './Typeahead.module.scss';

class Typeahead extends Component {
  state = {
    open: false
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleKey);
  }

  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(e.target))) {
      this.setState({ open: false });
    }
  }

  handleKey = (e) => {
    const code = e.code;

    if (this.state.open) {
      if (code === 'Escape') {
        this.setState({ open: false });
      }
    }
  }

  handleOnChange = (e) => {
    const { input, onChange } = this.props;

    if (e.currentTarget.value) {
      this.setState({ open: true });
    }

    if (input) {
      input.onChange(e);
    } else if (onChange) {
      onChange(e);
    }
  }

  render() {
    const {
      name = '',
      input = {},
      meta: { touched, error } = {},
      options = [],
      onSelect,
      ...rest
    } = this.props;

    const listClasses = classnames(styles.List, this.state.open && styles.open);
    const actions = options.map((option, index) => ({
      content: <TypeaheadItem value={option.value} type={option.type} />,
      onClick: () => onSelect(index)
    }));

    return (
      <div className={styles.Typeahead}>
        <div className={listClasses}>
          <ActionList actions={actions} />
        </div>
        <TextField
          id={input.name || name}
          {...rest}
          {...input}
          onChange={this.handleOnChange}
          error={touched && error ? error : undefined} />
      </div>
    );
  }
}

export default Typeahead;
