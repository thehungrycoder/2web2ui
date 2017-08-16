import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { TextField, ActionList } from '@sparkpost/matchbox';

import styles from './Typeahead.module.scss';

class Typeahead extends Component {
  state = {
    open: false
  }

  componentDidMount () {
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleEsc);
  }

  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(e.target))) {
      this.setState({ open: false });
    }
  }

  handleEsc = (e) => {
    if (this.state.open && e.code === 'Escape') {
      this.setState({ open: false });
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

  render () {
    const {
      name = '',
      input = {},
      meta: { touched, error } = {},
      options,
      ...rest
    } = this.props;

    const listClasses = classnames(styles.List, this.state.open && styles.open);

    return (
      <div className={styles.Typeahead}>
        <div className={listClasses}>
          <ActionList actions={options} />
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
