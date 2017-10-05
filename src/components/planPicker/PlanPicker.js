import React, { Component } from 'react';
import Downshift from 'downshift';
import { Field } from 'redux-form';
import cx from 'classnames';

import { Icon } from '@sparkpost/matchbox';
import Plan from './Plan';
import styles from './PlanPicker.module.scss';

/**
 * This component will register the a redux-form field named 'planpicker'
 * Entire selected plan object is stored in state
 */
export class PlanPicker extends Component {
  handleOpen = () => {
    this.input.focus();
  }

  planFn = ({
    getInputProps,
    getButtonProps,
    getItemProps,
    isOpen,
    selectedItem,
    highlightedIndex
  }) => {
    const { plans, input, disabled } = this.props;

    const items = plans.map((item, index) => {
      const classes = cx(
        styles.DropdownPlan,
        selectedItem.code === item.code && styles.selected,
        highlightedIndex === index && styles.highlighted
      );

      return <Plan key={index} className={classes} {...getItemProps({ item, index, plan: item })} />;
    });

    const listClasses = cx(styles.List, isOpen && styles.open);
    const triggerClasses = cx(
      styles.TriggerPlan,
      disabled && styles.disabled,
      isOpen && styles.triggerOpen
    );
    const triggerProps = getButtonProps({
      plan: selectedItem,
      onClick: this.handleOpen
    });

    return (
       <div className={styles.PlanPicker}>
         <div className={listClasses}>{ items }</div>
         <Icon name='ChevronDown' size={24} className={styles.Chevron} />
         <input {...getInputProps()} ref={(input) => this.input = input} className={styles.Input} />
         <Plan {...triggerProps} className={triggerClasses} />
       </div>
    );
  };

  render() {
    const { plans, input } = this.props;
    const { onChange, value } = input;

    return (
      <Downshift
        onChange={onChange}
        defaultSelectedItem={value || plans[0]} >
        {this.planFn}
      </Downshift>
    );
  }
}

export default ({ plans = [], ...rest }) => <Field component={PlanPicker} name='planpicker' plans={plans} {...rest} />;
