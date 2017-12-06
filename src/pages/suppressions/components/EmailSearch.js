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

  handleSubaccountSelect(subaccount) {
    this.setState({ subaccountId: subaccount.id }, this.handleBlur);
  }

  handleBlur() {
    const { email, subaccountId } = this.state;
    if (emailValidator(email) === undefined) {
      this.props.onSubmit({ email, subaccountId });
    }
  }

  handleSelect() {
    debugger;
  }

  render() {
    const { subaccounts, hasSubaccounts } = this.props;

    return (
    <Grid>
      <Grid.Column xs={12} md={ hasSubaccounts ? 6 : 12 }>
        <div>
          <Field
            name="email"
            label='Email' //TODO remove label for both fields
            onBlur={(e) => this.handleChange(e, 'email')}
            component={TextFieldWrapper}
            title="Email"
            placeholder='Recipient Email'
          />

        </div>
      </Grid.Column>
      { hasSubaccounts &&
        <Grid.Column xs={12} md={6}>
          <div>
            <Field //TODO remove label for both fields
              name="subaccount"
              component={SubaccountTypeaheadWrapper}
              subaccounts={subaccounts}
              onChange={this.handleSubaccountSelect.bind(this)}
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
