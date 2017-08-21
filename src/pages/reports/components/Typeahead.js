import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { TextField, ActionList } from '@sparkpost/matchbox';
import TypeaheadItem from './TypeaheadItem';

import { addFilter, searchFilter } from 'actions/reportFilters';

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

    if (this.state.open && code === 'Escape') {
      this.setState({ open: false });
    }
  }

  handleOnChange = (e) => {
    if (e.currentTarget.value) {
      this.setState({ open: true });
    }

    this.props.searchFilter();
  }

  handleSelect = (index) => {
    this.props.addFilter(this.props.filter.searchList[index]);
  }

  render() {
    const { options = []} = this.props;

    const listClasses = classnames(styles.List, this.state.open && styles.open);
    const actions = options.map((option, index) => ({
      content: <TypeaheadItem value={option.value} type={option.type} />,
      onClick: () => this.handleSelect(index)
    }));

    return (
      <div className={styles.Typeahead}>
        <div className={listClasses}>
          <ActionList actions={actions} />
        </div>
        <TextField onChange={this.handleOnChange} />
      </div>
    );
  }
}

const mapStateToProps = ({ reportFilters }) => ({ filter: reportFilters });
export default connect(mapStateToProps, { addFilter, searchFilter })(Typeahead);
