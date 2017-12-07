import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Field, change, formValueSelector } from 'redux-form';

import { TextField, Icon, Popover, ActionList } from '@sparkpost/matchbox';

import styles from './FilterDropdown.module.scss';

export class FilterDropdown extends Component {

  handleActionClick(e, name) {
    const { formName, change, namespace, values } = this.props;
    const value = values && values[name] !== undefined ? values[name] : false;
    change(formName, `${namespace}.${name}`, !value);
    e.stopPropagation();
  }

  buildActions = () => {
    const { options, values } = this.props;
    const actions = options.map((option) => ({
      ...option,
      onClick: (e) => this.handleActionClick(e, option.name),
      selected: values && !!values[option.name]
    }));

    return actions;
  }

  countSelected() {
    let count = 0;
    _.forEach(this.props.values, (value) => {
      if (value) {
        count++;
      }
    });
    return count;
  }

  renderCheckboxes() {
    const { options, namespace } = this.props;

    return options.map(({ name }) => (
      <Field
        className={styles.hidden}
        key={name}
        type='checkbox'
        component='input'
        tabIndex='-1'
        name={`${namespace}.${name}`}
        parse={(value) => !!value} // Prevents unchecked value from equaling ""
      />
    ));
  }

  onClose = () => {
    const { onClose = _.noop } = this.props;

    onClose(this.props.values);
  }

  render() {
    const { displayValue } = this.props;
    const count = this.countSelected();
    const actions = this.buildActions();
    const prefix = count > 0 ? `(${count})` : null;

    return (
      <div>
        <Popover
          trigger={<TextField prefix={prefix} value={displayValue} readOnly suffix={<Icon name='CaretDown'/>} />} onClose={this.onClose}>
          <ActionList actions={actions} />
        </Popover>
        {this.renderCheckboxes()}
      </div>
    );
  }
}

FilterDropdown.propTypes = {
  formName: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  displayValue: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func
};

const mapStateToProps = (state, { formName, namespace }) => {
  const selector = formValueSelector(formName);
  return { values: selector(state, namespace) };
};
const mapDispatchToProps = { change };
export default connect(mapStateToProps, mapDispatchToProps)(FilterDropdown);
