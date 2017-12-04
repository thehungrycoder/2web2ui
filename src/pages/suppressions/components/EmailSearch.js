import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reduxForm, Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SubaccountTypeaheadWrapper } from 'src/components';

export class EmailSearch extends Component {
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
    if (email) { //TODO validate email
      this.props.onSubmit({ email, subaccountId });
    }
  }

  handleSelect() {
    debugger;
  }

  render() {
    const { subaccounts } = this.props;

    return (
    <Grid>
      <Grid.Column xs={12} md={6}>
        <div className=''>
          <Field
            name="email"
            label='Email' //TODO remove label for both fields
            onBlur={(e) => this.handleChange(e, 'email')}
            component={TextFieldWrapper}
            title="Email"
            placeholder='Email'
          />

        </div>
      </Grid.Column>
      <Grid.Column xs={12} md={6}>
        <div className=''>
          <Field //TODO remove label for both fields
            name="subaccount"
            component={SubaccountTypeaheadWrapper}
            subaccounts={subaccounts}
            onChange={this.handleSubaccountSelect.bind(this)}
            label={false}
          />
        </div>
      </Grid.Column>
    </Grid>
    );
  }
}


const formName = 'recipientSearch';

const formOptions = { form: formName };
export default connect(null, {})(reduxForm(formOptions)(EmailSearch));
