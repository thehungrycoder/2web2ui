import React, { Component } from 'react';
import Downshift from 'downshift';
import cx from 'classnames';

import { Icon } from '@sparkpost/matchbox';
import Plan from './Plan';
import styles from './PlanPicker.module.scss';

class PlanPicker extends Component {
  handleOpen = () => {
    this.input.focus();
  }

  planFn = ({
    getInputProps,
    getRootProps,
    getButtonProps,
    getItemProps,
    isOpen,
    selectedItem,
    highlightedIndex
  }) => {
    const { plans, input } = this.props;

    const items = plans.map((item, index) => {
      const classes = cx(
        styles.DropdownPlan,
        selectedItem.code === item.code && styles.selected,
        highlightedIndex === index && styles.highlighted
      );

      return <Plan key={index} className={classes} {...getItemProps({ item, index, plan: item })} />;
    });

    const listClasses = cx(styles.List, isOpen && styles.open);
    const triggerClasses = cx(styles.TriggerPlan, isOpen && styles.triggerOpen);
    const triggerProps = getButtonProps({
      plan: selectedItem,
      onClick: this.handleOpen
    });

    return (
       <div {...getRootProps()} className={styles.PlanPicker}>
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

export default PlanPicker;
