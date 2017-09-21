import React, { Component } from 'react';
import Downshift from 'downshift';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Icon } from '@sparkpost/matchbox';
import Plan from './Plan';
import styles from './PlanPicker.module.scss';

class PlanPicker extends Component {
  handleOpen = () => {
    this.input.focus();
  }

  render() {
    const { plans, onChange, value } = this.props;

    if (typeof(value.overage) === 'undefined' || typeof(value.monthly) === 'undefined') {
      // TODO is billable / manually billed, should be handled above this component
      return null;
    }

    const planFn = ({
      getInputProps,
      getRootProps,
      getButtonProps,
      getItemProps,
      isOpen,
      selectedItem,
      highlightedIndex
    }) => {
      const items = plans.map((item, index) => {
        const classes = cx(
          styles.DropdownPlan,
          selectedItem.code === item.code && styles.selected,
          highlightedIndex === index && styles.highlighted
        );
        return (
          <Plan
            key={index}
            className={classes}
            {...getItemProps({ item, index, plan: item })}
          />
        );
      });

      const listClasses = cx(styles.List, isOpen && styles.open);
      const triggerProps = getButtonProps({
        plan: selectedItem,
        onClick: this.handleOpen
      });

      return (
         <div className={styles.PlanPicker} {...getRootProps()}>
           <div className={listClasses}>{ items }</div>
           <Icon name='ChevronDown' size={24} className={styles.Chevron} />
           <input {...getInputProps()} ref={(input) => this.input = input} className={styles.Input} />
           <Plan {...triggerProps} className={cx(styles.TriggerPlan, isOpen && styles.triggerOpen)} />
         </div>
      );
    };

    return (
      <Downshift
        onChange={onChange}
        defaultSelectedItem={value || plans[0]} >
        {planFn}
      </Downshift>
    );
  }
}

PlanPicker.propTypes = {
  // List of plans in the dropdown
  plans: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    monthly: PropTypes.number.isRequired,
    overage: PropTypes.number.isRequired
  })).isRequired,

  // Sets the initial plan
  value: PropTypes.shape({
    code: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    monthly: PropTypes.number,
    overage: PropTypes.number
  })
};

export default PlanPicker;
