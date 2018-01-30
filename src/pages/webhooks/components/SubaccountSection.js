import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { RadioGroup, SubaccountTypeaheadWrapper, TextFieldWrapper } from 'src/components';
import { required } from 'src/helpers/validation';

const createOptions = [
  { label: 'Master account only', value: 'master' },
  { label: 'Master and all subaccounts', value: 'all' },
  { label: 'Single Subaccount', value: 'subaccount' }
];

/**
 * Component produces the follow redux form fields
 * If new
 * - assignTo 'master' | 'all' | 'subaccount'
 * - subaccount if assignTo === 'subaccount'
 *
 * If !new
 * - subaccount TextField | typeahead (disabled)
 */
export class SubaccountSection extends Component {
  componentDidUpdate(prevProps) {
    const { assignTo, formName, change } = this.props;

    // Clear subaccount value if switching away from subaccount
    if (assignTo !== 'subaccount' && prevProps.assignTo === 'subaccount') {
      change(formName, 'subaccount', null);
    }
  }

  renderCreate() {
    const { assignTo } = this.props;

    const typeahead = assignTo === 'subaccount'
      ? <Field name='subaccount' component={SubaccountTypeaheadWrapper} validate={required} />
      : null;

    return (
      <div>
        <Field
          component={RadioGroup}
          name='assignTo'
          title='Receive events from:'
          options={createOptions} />
        {typeahead}
      </div>
    );
  }

  renderEdit() {
    const { subaccount } = this.props;
    let component = SubaccountTypeaheadWrapper;

    // On 'master only' or 'master and all' webhooks
    if (typeof subaccount === 'string') {
      component = TextFieldWrapper;
    }

    return (
      <Field
        component={component}
        name='subaccount'
        label='Receive events from'
        helpText='This assignment is permanent.'
        disabled />
    );
  }

  render() {
    return this.props.newWebhook ? this.renderCreate() : this.renderEdit();
  }
}

SubaccountSection.propTypes = {
  new: PropTypes.bool,
  assignTo: PropTypes.oneOf(['master', 'all', 'subaccount', null]),
  change: PropTypes.func
};

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.formName);
  return {
    assignTo: selector(state, 'assignTo'),
    subaccount: selector(state, 'subaccount')
  };
};

export default connect(mapStateToProps, { change })(SubaccountSection);
