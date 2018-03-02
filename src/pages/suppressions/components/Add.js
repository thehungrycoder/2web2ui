import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reset, reduxForm } from 'redux-form';
import { Button, Label, Panel, Checkbox } from '@sparkpost/matchbox';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components';

import { showAlert } from 'src/actions/globalAlert';
import { addSuppression } from 'src/actions/suppressions';
import SubaccountTypeaheadWrapper from 'src/components/reduxFormWrappers/SubaccountTypeaheadWrapper';
import { required, email } from 'src/helpers/validation';
const FORM_NAME = 'addSuppression';

export class AddTab extends Component {
  atLeastOne = (value, { transactional, non_transactional }) => (!transactional && !non_transactional)
    ? 'You must select at least 1 one of Transactional or Non-Transactional'
    : undefined;

  onSubmit = ({ subaccount, ...recipient }) => {
    const { showAlert, reset } = this.props;

    return this.props.addSuppression(recipient, subaccount)
      .then(() => {
        showAlert({ message: 'Successfully updated your suppression list', type: 'success' });
        reset(FORM_NAME);
      })
      .catch(() => {
        // do nothing
      });
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <Fragment>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Panel.Section>
            <Field
              name='recipient'
              component={TextFieldWrapper}
              validate={[required, email]}
              required
              label='Email Address'
            />
            <Field
              name='description'
              component={TextFieldWrapper}
              label='Description'
            />
            <Field
              component={SubaccountTypeaheadWrapper}
              disabled={submitting}
              helpText='Leaving this field blank will add the suppressions to the master account.'
              name='subaccount'
            />
            <Checkbox.Group>
              <Field
                name='transactional'
                component={CheckboxWrapper}
                type='checkbox'
                label='Transactional'
              />
              <Field
                name='non_transactional'
                component={CheckboxWrapper}
                type='checkbox'
                label='Non-Transactional'
                validate={this.atLeastOne}
              />
            </Checkbox.Group>
          </Panel.Section>
          <Panel.Section>
            <Label>If email exists, the record will be updated</Label>
            <Button primary disabled={pristine || submitting} type="submit">Add</Button>
          </Panel.Section>
        </form>
      </Fragment>
    );

  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    transactional: false,
    non_transactional: false
  }
});

export default withRouter(connect(mapStateToProps, { showAlert, addSuppression, reset })(reduxForm({ form: FORM_NAME })(AddTab)));

