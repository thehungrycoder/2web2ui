import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { RadioGroup, SubaccountTypeaheadWrapper } from 'src/components';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { required } from 'src/helpers/validation';

const createOptions = [
  { label: 'Assign to Master Account', value: 'master' },
  { label: 'Share with all Subaccounts', value: 'shared' },
  { label: 'Assign to Subaccount', value: 'subaccount' }
];

/**
 * Component produces the follow redux form fields
 * If newTemplate
 * - assignTo 'master' | 'shared' | 'subaccount'
 * - subaccount if assignTo === 'subaccount'
 *
 * If !newTemplate
 * - shared_with_subaccounts
 * - subaccount_id (disabled)
 */
export default class SubaccountSection extends Component {
  componentDidUpdate(prevProps) {
    const { assignTo, formName, change } = this.props;

    // Clear subaccount value if switching away from subaccount
    // The value change also refreshes sending domain list
    if (assignTo !== 'subaccount' && prevProps.assignTo === 'subaccount') {
      change(formName, 'subaccount', null);
    }
  }

  renderCreate() {
    const { assignTo } = this.props;

    const typeahead = assignTo === 'subaccount'
      ? <Field name='subaccount' component={SubaccountTypeaheadWrapper} validate={required} helpText='This assignment is permanent.'/>
      : null;

    return (
      <div>
        <Field
          component={RadioGroup}
          name='assignTo'
          title='Subaccount Assignment'
          options={createOptions} />
        {typeahead}
      </div>
    );
  }

  renderEdit() {
    const { subaccountId, disabled } = this.props;

    if (subaccountId) {
      return (
        <Field
          component={SubaccountTypeaheadWrapper}
          name='subaccount'
          label='Subaccount'
          helpText='This assignment is permanent.'
          disabled />
      );
    }

    return (
      <Field
        component={ToggleBlock}
        type='checkbox'
        parse={(value) => !!value} // Prevents unchecked value from equaling ""
        name='shared_with_subaccounts'
        label='Share with all subaccounts'
        disabled={disabled} />
    );
  }

  render() {
    const { newTemplate } = this.props;

    return (
      <Panel.Section>
        { newTemplate ? this.renderCreate() : this.renderEdit() }
      </Panel.Section>
    );
  }
}

SubaccountSection.propTypes = {
  newTemplate: PropTypes.bool,
  assignTo: PropTypes.oneOf(['master', 'shared', 'subaccount', null]),
  change: PropTypes.func
};
