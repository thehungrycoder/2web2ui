import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, formValueSelector, change } from 'redux-form';
import { Panel } from '@sparkpost/matchbox';
import { RadioGroup, SubaccountTypeaheadWrapper, TextFieldWrapper } from 'src/components';
import ToggleBlock from './ToggleBlock';

const createOptions = [
  { label: 'Assign to Master Account', value: 'master' },
  { label: 'Share with all Subaccounts', value: 'shared' },
  { label: 'Assign to Subaccount', value: 'subaccount' }
];

/**
 * Component produces the follow redux form fields
 * If `newTemplate` is true
 * - assignTo 'master' | 'shared' | 'subaccount'
 * - subaccount if assignTo === 'subaccount'
 *
 * If `newTemplate` is false
 * - shared_with_subaccounts
 * - subaccount_id (disabled)
 */
class SubaccountSection extends Component {
  componentDidUpdate(prevProps) {
    const { assignTo, formName, change } = this.props;

    // Clear subaccount value if switching away from subaccount, also refreshes sending domain list
    if (assignTo !== 'subaccount' && prevProps.assignTo === 'subaccount') {
      change(formName, 'subaccount', null);
    }
  }

  renderCreate() {
    const { assignTo } = this.props;

    const typeahead = assignTo === 'subaccount'
      ? <Field name='subaccount' component={SubaccountTypeaheadWrapper} />
      : null;

    return (
      <React.Fragment>
        <Field
          component={RadioGroup}
          name='assignTo'
          title='Subaccount Assignment'
          options={createOptions} />
        {typeahead}
      </React.Fragment>
    );
  }

  renderEdit() {
    const { subaccountId, disabled } = this.props;

    if (subaccountId) {
      return (
        <Field
          component={TextFieldWrapper}
          name='subaccount_id'
          label='Subaccount'
          disabled
        />
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
  assignTo: PropTypes.oneOf(['master', 'shared', 'subaccount', null])
};

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    assignTo: selector(state, 'assignTo'),
    subaccountId: selector(state, 'subaccount_id')
  };
};

export default connect(mapStateToProps, { change })(SubaccountSection);
