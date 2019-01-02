import React, { Component } from 'react';
import Downshift from 'downshift';
import { Field } from 'redux-form';
import cx from 'classnames';

import { ExpandMore } from '@sparkpost/matchbox-icons';
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
    getToggleButtonProps,
    getItemProps,
    isOpen,
    selectedItem,
    highlightedIndex
  }) => {
    const { plans, input, disabled, selectedPromo } = this.props;

    if (!selectedItem || !plans) {
      return null;
    }

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
    const triggerProps = getToggleButtonProps({
      plan: selectedItem,
      onClick: this.handleOpen
    });
    const planPriceProps = {
      selectedPromo
    };

    return (
      <div className={styles.PlanPicker}>
        <div className={listClasses}>{items}</div>
        <ExpandMore size={24} className={styles.Chevron} />
        <input {...getInputProps()} ref={(input) => this.input = input} className={styles.Input} />
        <Plan {...triggerProps} className={triggerClasses} planPriceProps={planPriceProps}/>
      </div>
    );
  };


  render() {
    const { plans, input } = this.props;
    const { onChange, value } = input;

    return (
      <Downshift
        onChange={onChange}
        itemToString={(item) => (item ? item.code : '')} // prevents the downshift console warning
        initialSelectedItem={(value && value.code) ? value : plans[0]} >
        {this.planFn}
      </Downshift>
    );
  }
}

export default ({ plans = [], ...rest }) => <Field component={PlanPicker} name='planpicker' plans={plans} {...rest} />;
