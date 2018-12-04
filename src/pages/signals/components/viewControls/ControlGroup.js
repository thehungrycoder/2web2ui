import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '@sparkpost/matchbox';
import _ from 'lodash';
import styles from './ControlGroup.module.scss';

class ControlGroup extends Component {
  state = {
    selected: ''
  }

  componentDidMount() {
    const { initialSelected } = this.props;

    if (initialSelected) {
      this.setState({ selected: initialSelected });
    }
  }

  handleChange = (selected) => {
    const { onChange } = this.props;

    this.setState({ selected });

    if (onChange) {
      onChange(selected);
    }
  }

  renderButtons = () => {
    const { options } = this.props;
    const { selected } = this.state;

    return _.keys(options).map((key) => {
      const classes = classnames(styles.Content, selected === key && styles.Selected);
      return (
        <Button key={key} outline onClick={() => this.handleChange(key)}>
          <span className={classes}>{options[key]}</span>
        </Button>
      );
    });
  }

  render() {
    return (
      <Button.Group className={styles.Group}>
        {this.renderButtons()}
      </Button.Group>
    );
  }
}

ControlGroup.propTypes = {
  options: PropTypes.object.isRequired,
  initialSelected: PropTypes.string,
  onChange: PropTypes.func
};

export default ControlGroup;
