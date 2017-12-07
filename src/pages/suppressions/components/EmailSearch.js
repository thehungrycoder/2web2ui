import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reduxForm, Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SubaccountTypeaheadWrapper } from 'src/components';

import { email as emailValidator } from 'src/helpers/validation';

export class FilterForm extends Component {
  state = {
    email: '',
    subaccountId: null
  };

  handleChange(e, key) {
    this.setState({ [key]: e.target.value }, this.handleBlur);
  }

  handleSubaccountSelect = (subaccount) => {
    this.setState({ subaccountId: subaccount.id }, this.handleBlur);
  }

  handleBlur() {
    const { email, subaccountId } = this.state;
    if (emailValidator(email) === undefined) {
      this.props.onSubmit({ email, subaccountId });
    }
  }

  render() {
    const { subaccounts, hasSubaccounts } = this.props;

    return (
    <Grid>
      <Grid.Column xs={12} md={ hasSubaccounts ? 6 : 12 }>
        <div>
          <Field
            name="email"
            onBlur={(e) => this.handleChange(e, 'email')}
            component={TextFieldWrapper}
            title="Email"
            validate={emailValidator}
            placeholder='Recipient Email'
          />

        </div>
      </Grid.Column>
      { hasSubaccounts &&
        <Grid.Column xs={12} md={6}>
          <div>
            <Field
              name="subaccount"
              component={SubaccountTypeaheadWrapper}
              subaccounts={subaccounts}
              label={false}
              onChange={this.handleSubaccountSelect}
              placeholder='Subaccount'
            />
          </div>
        </Grid.Column>
      }
    </Grid>
    );
  }
}


const formName = 'recipientSearch';

const formOptions = { form: formName };
export default connect(null, {})(reduxForm(formOptions)(FilterForm));
